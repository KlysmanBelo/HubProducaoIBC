import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  User,
  Phone,
  Check,
  CalendarCheck,
  CalendarDays,
  Shield,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvailabilityStatus, ChurchEvent } from '../types';
import { PRODUCTION_ROLES } from '../lib/defaultData';

export const VolunteerPortal: React.FC<{ onOpenLeaderLogin?: () => void }> = ({
  onOpenLeaderLogin,
}) => {
  const {
    events,
    volunteers,
    availabilities,
    schedules,
    submitAvailability,
    addVolunteer,
    getVolunteerSundayCountInMonth,
  } = useApp();

  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>(() => {
    return volunteers[0]?.id || '';
  });

  const [isRegisteringNew, setIsRegisteringNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRoles, setNewRoles] = useState<string[]>(['Direção de Programa']);
  const [submittingFeedback, setSubmittingFeedback] = useState<string | null>(null);

  // Per-event response state
  const [statusMap, setStatusMap] = useState<Record<string, AvailabilityStatus>>({});
  const [selectedDatesMap, setSelectedDatesMap] = useState<Record<string, string[]>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [preferredRoleMap, setPreferredRoleMap] = useState<Record<string, string>>({});

  const activeVolunteer = volunteers.find((v) => v.id === selectedVolunteerId);

  // Calculate Sunday workload for active volunteer in current month
  const currentMonth = new Date().toISOString().substring(0, 7);
  const activeVolunteerSundayCount = activeVolunteer
    ? getVolunteerSundayCountInMonth(activeVolunteer.id, currentMonth)
    : 0;
  const sundayLimit = activeVolunteer?.monthlySundayLimit || 2;

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    return [...events].sort((a, b) => a.date.localeCompare(b.date));
  }, [events]);

  // Schedules where this volunteer is assigned
  const mySchedules = useMemo(() => {
    if (!selectedVolunteerId) return [];
    return schedules.filter((s) =>
      s.assignments.some((a) => a.volunteerId === selectedVolunteerId),
    );
  }, [schedules, selectedVolunteerId]);

  // Handle status toggle
  const handleSelectStatus = (eventId: string, status: AvailabilityStatus) => {
    setStatusMap((prev) => ({ ...prev, [eventId]: status }));
  };

  // Toggle specific date for multi-day events
  const handleToggleMultiDayDate = (eventId: string, dateStr: string) => {
    setSelectedDatesMap((prev) => {
      const currentDates = prev[eventId] || [];
      const updated = currentDates.includes(dateStr)
        ? currentDates.filter((d) => d !== dateStr)
        : [...currentDates, dateStr];
      return { ...prev, [eventId]: updated };
    });
  };

  // Save response for single event
  const handleSaveResponse = async (event: ChurchEvent) => {
    if (!activeVolunteer) return;
    const status = statusMap[event.id] || 'available';
    const restrictions = notesMap[event.id] || '';
    const preferredRole = preferredRoleMap[event.id];

    // For multi-day events, take selected dates or all by default if available
    const eventDates = event.dates && event.dates.length > 0 ? event.dates : [event.date];
    const selectedDays =
      selectedDatesMap[event.id] && selectedDatesMap[event.id].length > 0
        ? selectedDatesMap[event.id]
        : eventDates;

    setSubmittingFeedback(event.id);
    await submitAvailability({
      eventId: event.id,
      volunteerId: activeVolunteer.id,
      volunteerName: activeVolunteer.name,
      volunteerPhone: activeVolunteer.phone,
      status,
      selectedDates: selectedDays,
      restrictions,
      preferredRoles: preferredRole ? [preferredRole] : activeVolunteer.roles,
    });

    setTimeout(() => {
      setSubmittingFeedback(null);
    }, 2000);
  };

  // Quick self-registration for new volunteer
  const handleRegisterNewVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newId = await addVolunteer({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@ibc.org`,
      monthlySundayLimit: 2,
      roles: newRoles.length > 0 ? newRoles : ['Direção de Programa'],
      notes: 'Cadastrado pelo formulário público.',
    });

    setSelectedVolunteerId(newId);
    setIsRegisteringNew(false);
    setNewName('');
    setNewPhone('');
  };

  const toggleNewRole = (roleName: string) => {
    setNewRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName],
    );
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-black font-black text-2xl tracking-tighter shadow-xl">
            IBC
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              Produção IBC Fortaleza
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
              Formulário Oficial de Disponibilidade para Cultos & Eventos
            </p>
          </div>
        </div>

        {/* Identification Card */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <User className="w-4 h-4 text-white" />
              1. Identifique-se na Equipe
            </h2>
            <button
              onClick={() => setIsRegisteringNew(!isRegisteringNew)}
              className="text-xs font-semibold text-zinc-300 hover:text-white underline cursor-pointer"
            >
              {isRegisteringNew ? 'Selecionar da Lista' : '+ Sou novo voluntário'}
            </button>
          </div>

          {!isRegisteringNew ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                  Selecione seu nome cadastrado:
                </label>
                <select
                  value={selectedVolunteerId}
                  onChange={(e) => setSelectedVolunteerId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white"
                >
                  {volunteers.map((vol) => (
                    <option key={vol.id} value={vol.id}>
                      {vol.name} • {vol.roles.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              {activeVolunteer && (
                <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{activeVolunteer.name}</span>
                    <span className="text-zinc-400">
                      Funções: {activeVolunteer.roles.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span className="text-zinc-300">
                      Escalado neste mês: <strong className="text-white font-mono">{activeVolunteerSundayCount}/{sundayLimit}</strong> domingos
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleRegisterNewVolunteer} className="space-y-3.5">
              <p className="text-xs text-zinc-400">
                Ainda não está na lista da Produção? Preencha seus dados abaixo para se cadastrar:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="(85) 99999-0000"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Quais áreas você atua ou deseja servir?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {PRODUCTION_ROLES.map((r) => {
                    const isSelected = newRoles.includes(r.name);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleNewRole(r.name)}
                        className={`p-2 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-zinc-200 text-black transition-all cursor-pointer"
                >
                  Concluir Cadastro e Preencher Disponibilidade
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section 2: Availability for Cultos & Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                2. Cultos e Eventos Disponíveis
              </h2>
              <p className="text-xs text-zinc-400">
                Informe se você pode servir nos cultos dominicais ou eventos de semana.
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              {upcomingEvents.length} evento(s)
            </span>
          </div>

          <div className="space-y-5">
            {upcomingEvents.map((ev) => {
              const isSunday = ev.type === 'sunday';
              const hasMultipleDates = !!(ev.dates && ev.dates.length > 1);
              const eventDatesList = hasMultipleDates ? (ev.dates || []) : [ev.date];

              // Check existing response
              const existingResp = availabilities.find(
                (a) => a.eventId === ev.id && a.volunteerId === selectedVolunteerId,
              );

              const currentStatus =
                statusMap[ev.id] || existingResp?.status || 'available';

              const selectedDays =
                selectedDatesMap[ev.id] !== undefined
                  ? selectedDatesMap[ev.id]
                  : existingResp?.selectedDates || eventDatesList;

              const isSavingThis = submittingFeedback === ev.id;

              return (
                <div
                  key={ev.id}
                  className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4 shadow-lg transition-all"
                >
                  {/* Event Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-zinc-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            isSunday
                              ? 'bg-white text-black'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                          }`}
                        >
                          {isSunday ? 'Culto de Domingo' : 'Evento de Semana'}
                        </span>

                        {hasMultipleDates && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-white border border-zinc-700">
                            {ev.dates?.length} Dias de Evento
                          </span>
                        )}

                        {existingResp && (
                          <span className="text-[10px] text-zinc-400 font-medium">
                            ✓ Você já respondeu este evento
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-white leading-snug">
                        {ev.title}
                      </h3>
                      {ev.description && (
                        <p className="text-xs text-zinc-400 mt-1">{ev.description}</p>
                      )}
                    </div>

                    <div className="text-right text-xs space-y-1 sm:self-auto flex-shrink-0">
                      <div className="flex items-center sm:justify-end gap-1.5 text-white font-bold">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Início: {ev.time}</span>
                      </div>
                      <div className="flex items-center sm:justify-end gap-1.5 text-zinc-400 text-[11px]">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Day Options: "no formulário, aparece o card do evento e as opções dos dias" */}
                  {hasMultipleDates && (
                    <div className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-white" />
                        Opções dos Dias (Selecione em quais dias você pode servir):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {eventDatesList.map((dStr, dIdx) => {
                          const isDaySelected = selectedDays.includes(dStr);
                          return (
                            <button
                              key={dIdx}
                              type="button"
                              onClick={() => handleToggleMultiDayDate(ev.id, dStr)}
                              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                                isDaySelected
                                  ? 'bg-white text-black border-white font-bold'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <span>{dStr} (Dia {dIdx + 1})</span>
                              {isDaySelected && <Check className="w-3.5 h-3.5 text-black" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Single day date badge if not multi-day */}
                  {!hasMultipleDates && (
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <Calendar className="w-4 h-4 text-white" />
                      <span>Data do Culto: <strong className="text-white">{ev.date}</strong></span>
                    </div>
                  )}

                  {/* Functions required for this event */}
                  {ev.requiredRoles && ev.requiredRoles.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                        Funções Necessárias neste evento:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {ev.requiredRoles.map((r, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response Selector */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                      Sua Disponibilidade:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectStatus(ev.id, 'available')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          currentStatus === 'available'
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Disponível</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectStatus(ev.id, 'maybe')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          currentStatus === 'maybe'
                            ? 'bg-zinc-800 text-white border-zinc-500 shadow-lg'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Com Restrição</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectStatus(ev.id, 'unavailable')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          currentStatus === 'unavailable'
                            ? 'bg-zinc-900 text-zinc-300 border-zinc-600 shadow-lg'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Indisponível</span>
                      </button>
                    </div>

                    {/* If with restriction, show text area */}
                    {currentStatus === 'maybe' && (
                      <div className="pt-2">
                        <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                          Descreva sua restrição ou preferência de horário:
                        </label>
                        <input
                          type="text"
                          value={notesMap[ev.id] || existingResp?.restrictions || ''}
                          onChange={(e) =>
                            setNotesMap((prev) => ({ ...prev, [ev.id]: e.target.value }))
                          }
                          placeholder="Ex: Posso servir apenas até as 19h; prefiro mesa de som..."
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                        />
                      </div>
                    )}

                    {/* Save Button for this event */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveResponse(ev)}
                        disabled={isSavingThis}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isSavingThis ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Disponibilidade Salva!
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Confirmar Resposta Deste Evento
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: My Confirmed Schedules */}
        {mySchedules.length > 0 && (
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-white" />
              Suas Escalas Confirmadas
            </h2>
            <div className="divide-y divide-zinc-800/80">
              {mySchedules.map((sched) => {
                const myAssignment = sched.assignments.find(
                  (a) => a.volunteerId === selectedVolunteerId,
                );
                return (
                  <div
                    key={sched.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{sched.eventTitle}</span>
                      <span className="text-zinc-400">
                        📅 {sched.eventDate} • ⏰ {sched.eventTime}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
                        {myAssignment?.roleName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 border-t border-zinc-900 text-center space-y-2 pb-8">
          <p className="text-xs text-zinc-500">
            IBC Fortaleza • Ministério de Produção • Formulário de Disponibilidade
          </p>
          <p className="text-[11px] text-zinc-600">
            Dúvidas ou alterações na sua escala? Converse diretamente com a coordenação de produção.
          </p>
        </div>
      </div>
    </div>
  );
};
