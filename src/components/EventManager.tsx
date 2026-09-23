import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  CalendarDays,
  Layers,
  X,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChurchEvent, EventType } from '../types';
import { PRODUCTION_ROLES } from '../lib/defaultData';

export const EventManager: React.FC<{ onNavigateSchedule?: () => void }> = ({ onNavigateSchedule }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('sunday');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [singleDate, setSingleDate] = useState('');
  const [multiDates, setMultiDates] = useState<string[]>(['']);
  const [time, setTime] = useState('10:00');
  const [location, setLocation] = useState('Campus Edson Queiroz - Nave Principal');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'open_for_availability' | 'scheduled' | 'completed'>('open_for_availability');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    'Direção de Programa',
    'Mesa de Som',
    'Direção de Imagem',
    'Câmera 2',
    'Multimídia 1',
  ]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setTitle('');
    setType('sunday');
    setIsMultiDay(false);
    setSingleDate('');
    setMultiDates(['']);
    setTime('10:00');
    setLocation('Campus Edson Queiroz - Nave Principal');
    setDescription('');
    setStatus('open_for_availability');
    // Default subset of roles (not all, as requested)
    setSelectedRoles([
      'Direção de Programa',
      'Mesa de Som',
      'Direção de Imagem',
      'Câmera 2',
      'Multimídia 1',
      'Transmissão',
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: ChurchEvent) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setType(ev.type);
    const hasMultiple = !!(ev.dates && ev.dates.length > 1);
    setIsMultiDay(hasMultiple);
    setSingleDate(ev.date || '');
    setMultiDates(ev.dates && ev.dates.length > 0 ? ev.dates : [ev.date]);
    setTime(ev.time);
    setLocation(ev.location);
    setDescription(ev.description || '');
    setStatus(ev.status);
    setSelectedRoles(ev.requiredRoles || PRODUCTION_ROLES.slice(0, 6).map((r) => r.name));
    setIsModalOpen(true);
  };

  const handleAddDateInput = () => {
    setMultiDates((prev) => [...prev, '']);
  };

  const handleRemoveDateInput = (idx: number) => {
    setMultiDates((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDateChange = (idx: number, val: string) => {
    setMultiDates((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName],
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (selectedRoles.length === 0) {
      alert('Por favor, selecione ao menos uma função técnica para este evento.');
      return;
    }

    const cleanDates = isMultiDay
      ? multiDates.filter((d) => d.trim().length > 0)
      : [singleDate];

    if (cleanDates.length === 0 || !cleanDates[0]) {
      alert('Por favor, informe a data do evento.');
      return;
    }

    const primaryDate = cleanDates[0];

    const eventPayload: Omit<ChurchEvent, 'id'> = {
      title: title.trim(),
      type,
      date: primaryDate,
      dates: cleanDates,
      time,
      location,
      description: description.trim(),
      status,
      requiredRoles: selectedRoles,
    };

    if (editingEvent) {
      await updateEvent(editingEvent.id, eventPayload);
    } else {
      await addEvent(eventPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-white" />
            Liderança • Gestão de Eventos & Cultos
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Cadastro de Cultos e Eventos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cadastre os cultos dominicais e eventos de semana (incluindo eventos de múltiplos dias). Selecione as funções necessárias para cada evento.
          </p>
        </div>

        <button
          id="btn-create-new-event-page"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-zinc-200 text-black transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Culto ou Evento
        </button>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => {
          const isSunday = ev.type === 'sunday';
          const hasMultipleDates = ev.dates && ev.dates.length > 1;

          return (
            <div
              key={ev.id}
              className="p-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSunday
                          ? 'bg-white text-black'
                          : 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {isSunday ? 'Domingo (Aplica Limite)' : 'Semana (Livre de Limite)'}
                    </span>

                    {hasMultipleDates && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-white border border-zinc-700">
                        {ev.dates?.length} Dias de Evento
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(ev)}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Editar evento"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir evento "${ev.title}"?`)) {
                          deleteEvent(ev.id);
                        }
                      }}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Excluir evento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    {ev.title}
                  </h3>
                  {ev.description && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{ev.description}</p>
                  )}
                </div>

                {/* Dates & Time */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CalendarDays className="w-3.5 h-3.5 text-white" />
                    {hasMultipleDates ? (
                      <span className="font-semibold text-white">
                        {ev.dates?.join(' • ')}
                      </span>
                    ) : (
                      <span>Data: {ev.date}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Início: {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 truncate">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                {/* Required Roles for this event */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
                    Funções Solicitadas ({ev.requiredRoles?.length || 0} funções):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(ev.requiredRoles || []).map((r, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Status: {ev.status === 'scheduled' ? 'Escala montada' : 'Aberto para respostas'}</span>
                <span className="text-white font-medium">Aparece no formulário público</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Create / Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                {editingEvent ? 'Editar Evento / Culto' : 'Cadastrar Novo Culto ou Evento'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Título do Culto / Evento *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Culto de Celebração (Manhã) ou Conferência de Louvor"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Tipo de Evento *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                  >
                    <option value="sunday">Culto de Domingo (Conta no limite mensal)</option>
                    <option value="weekday">Evento de Semana (Livre de limite)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Horário de Início *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Multi-day Toggle */}
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Evento com mais de um dia? (Ex: conferências, acampamentos)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMultiDay}
                      onChange={(e) => setIsMultiDay(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:after:bg-black"></div>
                  </label>
                </div>

                {isMultiDay ? (
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Datas do Evento:
                    </label>
                    {multiDates.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="date"
                          required
                          value={d}
                          onChange={(e) => handleDateChange(i, e.target.value)}
                          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                        />
                        {multiDates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDateInput(i)}
                            className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddDateInput}
                      className="text-xs text-zinc-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer pt-1"
                    >
                      + Adicionar outro dia
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                      Data do Evento *
                    </label>
                    <input
                      type="date"
                      required
                      value={singleDate}
                      onChange={(e) => setSingleDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Local / Campus
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Campus Edson Queiroz - Nave Principal"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                />
              </div>

              {/* Required Functions / Roles for this specific event */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white block">
                    Funções Necessárias para este Evento *
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    {selectedRoles.length} de {PRODUCTION_ROLES.length} selecionadas
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Cada evento possui funções específicas. Apenas as funções marcadas aqui estarão disponíveis para escala e aparecerão para os voluntários.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                  {PRODUCTION_ROLES.map((r) => {
                    const isChecked = selectedRoles.includes(r.name);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleRole(r.name)}
                        className={`p-2 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <span className="truncate">{r.name}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-1 text-black" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Orientações / Descrição
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Informações relevantes para a equipe da produção..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white outline-none focus:border-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-zinc-200 text-black transition-all cursor-pointer shadow-md"
                >
                  {editingEvent ? 'Atualizar Evento' : 'Salvar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
