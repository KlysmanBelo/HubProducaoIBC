import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Save,
  Share2,
  Check,
  ChevronRight,
  Info,
  CalendarDays,
  Layers,
  FileText,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChurchEvent, Schedule, ScheduleAssignment, EventType } from '../types';
import { PRODUCTION_ROLES } from '../lib/defaultData';
import { ScheduleCardImage } from './ScheduleCardImage';

export const ScheduleManager: React.FC<{ onNavigateEvents?: () => void }> = ({ onNavigateEvents }) => {
  const {
    events,
    volunteers,
    schedules,
    availabilities,
    saveSchedule,
    deleteSchedule,
    currentUser,
    getVolunteerSundayCountInMonth,
  } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    return events[0]?.id || '';
  });

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'image' | 'responses'>('roster');

  // Active Event & Existing Schedule
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const existingSchedule = schedules.find((s) => s.eventId === activeEvent?.id);

  // Draft assignments while building schedule
  const [assignmentsDraft, setAssignmentsDraft] = useState<ScheduleAssignment[]>([]);
  const [scheduleNotes, setScheduleNotes] = useState('');

  // Open editor with existing schedule or predefined roles for this event
  const handleOpenEditor = () => {
    if (!activeEvent) return;

    if (existingSchedule) {
      setAssignmentsDraft([...existingSchedule.assignments]);
      setScheduleNotes(existingSchedule.notes || '');
    } else {
      // Use required roles defined for this event!
      // "cada evento pode ter certas funções, não podendo ter todas as funções"
      const rolesToUse =
        activeEvent.requiredRoles && activeEvent.requiredRoles.length > 0
          ? activeEvent.requiredRoles
          : PRODUCTION_ROLES.slice(0, 6).map((r) => r.name);

      const initialDraft: ScheduleAssignment[] = rolesToUse.map((roleName) => {
        // Try to auto-suggest available volunteer for this role
        const availableVol = volunteers.find((v) => {
          const resp = availabilities.find(
            (a) => a.eventId === activeEvent.id && a.volunteerId === v.id,
          );
          return (
            (resp?.status === 'available' || resp?.status === 'maybe') &&
            v.roles &&
            v.roles.includes(roleName)
          );
        });

        return {
          roleId: roleName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          roleName: roleName,
          volunteerId: availableVol ? availableVol.id : '',
          volunteerName: availableVol ? availableVol.name : '',
          volunteerPhone: availableVol ? availableVol.phone : '',
          attendanceStatus: 'scheduled',
        };
      });

      setAssignmentsDraft(initialDraft);
      setScheduleNotes('Passagem de som e alinhamento com a equipe 1 hora antes do início do culto.');
    }
    setIsEditingSchedule(true);
    setActiveTab('roster');
  };

  // Assign volunteer to role in draft
  const handleAssignVolunteer = (roleIdx: number, volId: string) => {
    const vol = volunteers.find((v) => v.id === volId);
    setAssignmentsDraft((prev) => {
      const updated = [...prev];
      updated[roleIdx] = {
        ...updated[roleIdx],
        volunteerId: volId,
        volunteerName: vol ? vol.name : '',
        volunteerPhone: vol ? vol.phone : '',
      };
      return updated;
    });
  };

  // Add extra role to draft
  const handleAddRoleToDraft = (roleName: string) => {
    setAssignmentsDraft((prev) => [
      ...prev,
      {
        roleId: `role-${Date.now()}`,
        roleName: roleName,
        volunteerId: '',
        volunteerName: '',
        attendanceStatus: 'scheduled',
      },
    ]);
  };

  // Remove role from draft
  const handleRemoveRoleFromDraft = (idx: number) => {
    setAssignmentsDraft((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save Schedule
  const handleSaveSchedule = async () => {
    if (!activeEvent) return;

    const leaderName = currentUser?.displayName || currentUser?.email || 'Liderança de Produção IBC';
    const leaderId = currentUser?.uid || 'leader-ibc';

    await saveSchedule(
      {
        eventId: activeEvent.id,
        eventTitle: activeEvent.title,
        eventDate: activeEvent.date,
        eventTime: activeEvent.time,
        eventType: activeEvent.type,
        assignments: assignmentsDraft,
        notes: scheduleNotes,
        leaderName,
        leaderId,
      },
      existingSchedule?.id,
    );

    setIsEditingSchedule(false);
    setActiveTab('image'); // Switch to WhatsApp image preview
  };

  const isSunday = activeEvent?.type === 'sunday';
  const monthYear = activeEvent?.date.substring(0, 7) || new Date().toISOString().substring(0, 7);

  // Filter responses for this event
  const eventResponses = availabilities.filter((a) => a.eventId === activeEvent?.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-white" />
            Liderança • Montagem de Escalas
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Escalas da Produção & Gerador de Imagem
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monte a escala conforme as funções de cada culto, respeite o limite de 2 domingos por servo e gere a imagem em alta resolução para o WhatsApp.
          </p>
        </div>

        {activeEvent && (
          <button
            id="btn-edit-scale-open"
            onClick={handleOpenEditor}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-zinc-200 text-black transition-all shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {existingSchedule ? 'Editar Escala Deste Culto' : 'Montar Escala Deste Culto'}
          </button>
        )}
      </div>

      {/* Event Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {events.map((ev) => {
          const isSelected = ev.id === (activeEvent?.id || '');
          const hasScale = schedules.some((s) => s.eventId === ev.id);
          const isEvSunday = ev.type === 'sunday';

          return (
            <button
              key={ev.id}
              onClick={() => {
                setSelectedEventId(ev.id);
                setIsEditingSchedule(false);
              }}
              className={`px-4 py-3 rounded-xl border text-left whitespace-nowrap transition-all cursor-pointer flex-shrink-0 flex items-center gap-3 ${
                isSelected
                  ? 'bg-zinc-900 border-white text-white shadow-md'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                      isEvSunday
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {isEvSunday ? 'Domingo' : 'Semana'}
                  </span>
                  <span className="text-xs font-bold text-white">{ev.title}</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  📅 {ev.date} • ⏰ {ev.time}
                </div>
              </div>

              {hasScale && (
                <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" title="Escala salva" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main View Area */}
      {activeEvent ? (
        <div className="space-y-6">
          {/* Event Context Card */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{activeEvent.title}</span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    isSunday ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  {isSunday ? 'Culto Dominical (Aplica Limite)' : 'Evento de Semana (Livre de Limite)'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span>📅 Data: <strong className="text-zinc-200">{activeEvent.date}</strong></span>
                <span>⏰ Horário: <strong className="text-zinc-200">{activeEvent.time}</strong></span>
                <span>📍 {activeEvent.location}</span>
                <span>👥 {activeEvent.requiredRoles?.length || 0} funções requeridas</span>
              </div>
            </div>

            {/* Navigation tabs between roster, whatsapp image, and responses */}
            <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('roster')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'roster'
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Escala
              </button>
              <button
                onClick={() => setActiveTab('image')}
                disabled={!existingSchedule && !isEditingSchedule}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-40 ${
                  activeTab === 'image'
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Imagem WhatsApp
              </button>
              <button
                onClick={() => setActiveTab('responses')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'responses'
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Respostas ({eventResponses.length})
              </button>
            </div>
          </div>

          {/* TAB 1: Roster Editor / Display */}
          {activeTab === 'roster' && (
            <div className="space-y-6">
              {isEditingSchedule ? (
                /* Editing Mode */
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Preenchendo Escala • {activeEvent.title}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {isSunday
                          ? 'Atenção aos alertas de sobrecarga (limite de cultos dominicais no mês).'
                          : 'Culto/evento de semana: não consome o limite mensal de domingos dos servos.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingSchedule(false)}
                        className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveSchedule}
                        className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        Salvar Escala
                      </button>
                    </div>
                  </div>

                  {/* List of roles in draft */}
                  <div className="space-y-3">
                    {assignmentsDraft.map((item, idx) => {
                      const selectedVol = volunteers.find((v) => v.id === item.volunteerId);
                      const sundayCount = selectedVol
                        ? getVolunteerSundayCountInMonth(selectedVol.id, monthYear)
                        : 0;
                      const limit = selectedVol?.monthlySundayLimit || 2;
                      const isOverLimit = isSunday && selectedVol && sundayCount >= limit;

                      return (
                        <div
                          key={idx}
                          className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="w-full sm:w-1/3">
                            <span className="text-xs font-bold text-white block">
                              {item.roleName}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              Função Técnica da Produção
                            </span>
                          </div>

                          <div className="w-full sm:w-1/2">
                            <select
                              value={item.volunteerId}
                              onChange={(e) => handleAssignVolunteer(idx, e.target.value)}
                              className={`w-full bg-zinc-950 border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                                isOverLimit
                                  ? 'border-zinc-400 text-white font-semibold'
                                  : 'border-zinc-700 text-white focus:border-white'
                              }`}
                            >
                              <option value="">-- Selecione o servo --</option>
                              {volunteers.map((vol) => {
                                const volSundayCount = getVolunteerSundayCountInMonth(
                                  vol.id,
                                  monthYear,
                                );
                                const volLimit = vol.monthlySundayLimit || 2;
                                const willOverload = isSunday && volSundayCount >= volLimit;
                                const isQualified = vol.roles && vol.roles.includes(item.roleName);

                                return (
                                  <option key={vol.id} value={vol.id}>
                                    {vol.name}{' '}
                                    {isQualified ? '✓ (Apto)' : ''}{' '}
                                    {isSunday ? `[${volSundayCount}/${volLimit} dom]` : ''}{' '}
                                    {willOverload ? '⚠️ LIMITE ATINGIDO' : ''}
                                  </option>
                                );
                              })}
                            </select>

                            {isOverLimit && (
                              <div className="text-[10px] text-zinc-300 font-bold flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3 h-3 text-white" />
                                Aviso: {selectedVol?.name} já atingiu a cota de {limit} domingos no mês ({sundayCount}/{limit})!
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveRoleFromDraft(idx)}
                            className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer self-end sm:self-auto"
                            title="Remover função da escala"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add additional function from remaining roles */}
                  <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-400 font-semibold">
                      Adicionar outra função à escala:
                    </span>
                    {PRODUCTION_ROLES.map((r) => {
                      const alreadyIn = assignmentsDraft.some((a) => a.roleName === r.name);
                      if (alreadyIn) return null;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleAddRoleToDraft(r.name)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-white transition-all cursor-pointer"
                        >
                          + {r.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Orientações Gerais da Escala (aparece na imagem do WhatsApp)
                    </label>
                    <textarea
                      rows={2}
                      value={scheduleNotes}
                      onChange={(e) => setScheduleNotes(e.target.value)}
                      placeholder="Passagem de som e alinhamento com a equipe..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white outline-none focus:border-white"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveSchedule}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Concluir e Salvar Escala
                    </button>
                  </div>
                </div>
              ) : existingSchedule ? (
                /* View Mode */
                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Escala Confirmada ({existingSchedule.assignments.length} funções)
                    </h3>
                    <button
                      onClick={handleOpenEditor}
                      className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Editar Escala
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {existingSchedule.assignments.map((a, i) => (
                      <div
                        key={i}
                        className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                          {a.roleName}
                        </span>
                        <div className="text-sm font-bold text-white">
                          {a.volunteerName || 'A Definir'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {existingSchedule.notes && (
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                      <strong>Orientações:</strong> {existingSchedule.notes}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveTab('image')}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      Ver Imagem para WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                /* No schedule yet */
                <div className="p-12 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-3">
                  <Layers className="w-8 h-8 text-zinc-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">
                    Nenhuma escala montada para este evento ainda
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Os voluntários já podem responder a disponibilidade no formulário público. Clique no botão abaixo para montar a escala.
                  </p>
                  <button
                    onClick={handleOpenEditor}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Montar Escala Agora
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WhatsApp Image Generator */}
          {activeTab === 'image' && (
            <div>
              {existingSchedule ? (
                <ScheduleCardImage schedule={existingSchedule} />
              ) : (
                <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-400">
                  Salve a escala primeiro para gerar a imagem.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Volunteer Responses for this Event */}
          {activeTab === 'responses' && (
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Respostas de Disponibilidade dos Voluntários
                </h3>
                <span className="text-xs text-zinc-400">
                  {eventResponses.length} resposta(s) recebida(s)
                </span>
              </div>

              {eventResponses.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">
                  Ainda não há respostas enviadas pelos servos para este culto/evento.
                </p>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {eventResponses.map((resp) => {
                    const isAvail = resp.status === 'available';
                    const isMaybe = resp.status === 'maybe';

                    return (
                      <div key={resp.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {resp.volunteerName}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            WhatsApp: {resp.volunteerPhone}
                          </span>
                          {resp.selectedDates && resp.selectedDates.length > 0 && (
                            <span className="text-[10px] text-zinc-300 block font-medium mt-0.5">
                              📅 Dias disponíveis: {resp.selectedDates.join(', ')}
                            </span>
                          )}
                          {resp.restrictions && (
                            <span className="text-[10px] text-zinc-400 italic block mt-0.5">
                              Restrição: {resp.restrictions}
                            </span>
                          )}
                        </div>

                        <div>
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                              isAvail
                                ? 'bg-white text-black'
                                : isMaybe
                                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                            }`}
                          >
                            {isAvail ? 'Disponível' : isMaybe ? 'Com Restrição' : 'Indisponível'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-400">
          Nenhum evento cadastrado. Acesse a página de eventos para cadastrar os cultos.
        </div>
      )}
    </div>
  );
};
