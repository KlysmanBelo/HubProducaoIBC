import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  UserCheck,
  Search,
  Phone,
  Filter,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';

export const AttendanceControl: React.FC = () => {
  const { schedules, updateAttendance } = useApp();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(() => {
    return schedules[0]?.id || '';
  });
  const [filterText, setFilterText] = useState('');

  const activeSchedule = schedules.find((s) => s.id === selectedScheduleId) || schedules[0];

  const handleStatusChange = async (volunteerId: string, status: AttendanceStatus) => {
    if (!activeSchedule) return;
    await updateAttendance(activeSchedule.id, volunteerId, status);
  };

  const filteredAssignments = (activeSchedule?.assignments || []).filter((a) => {
    const term = filterText.toLowerCase();
    return (
      a.volunteerName.toLowerCase().includes(term) ||
      a.roleName.toLowerCase().includes(term)
    );
  });

  const totalAssigned = activeSchedule?.assignments?.length || 0;
  const presentCount =
    activeSchedule?.assignments?.filter((a) => a.attendanceStatus === 'present').length || 0;
  const confirmedCount =
    activeSchedule?.assignments?.filter((a) => a.attendanceStatus === 'confirmed').length || 0;
  const absentCount =
    activeSchedule?.assignments?.filter(
      (a) =>
        a.attendanceStatus === 'absent_justified' ||
        a.attendanceStatus === 'absent_unjustified',
    ).length || 0;

  const attendancePercent =
    totalAssigned > 0 ? Math.round((presentCount / totalAssigned) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5 text-white" />
            Liderança • Controle de Presença
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Check-in e Frequência dos Voluntários
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Acompanhe em tempo real quem compareceu ao culto, registre faltas justificadas e taxa de presença da equipe.
          </p>
        </div>

        {/* Schedule Selector */}
        <div className="min-w-[260px]">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
            Selecione o Culto / Evento:
          </label>
          <select
            id="select-attendance-schedule"
            value={activeSchedule?.id || ''}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-white"
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.eventTitle} ({s.eventDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeSchedule ? (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">
                Total Escalados
              </span>
              <span className="text-2xl font-black text-white">{totalAssigned}</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">
                Presentes (Check-in)
              </span>
              <span className="text-2xl font-black text-white">{presentCount}</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">
                Confirmados Prévia
              </span>
              <span className="text-2xl font-black text-zinc-300">{confirmedCount}</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">
                Taxa de Presença
              </span>
              <span className="text-2xl font-black text-white">{attendancePercent}%</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3">
            <Search className="w-4 h-4 text-zinc-500 ml-2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar por voluntário ou função..."
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none"
            />
          </div>

          {/* Assignments Roster */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
            {filteredAssignments.map((assignment, index) => {
              const status = assignment.attendanceStatus;

              return (
                <div
                  key={index}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {assignment.volunteerName || 'Vaga Não Preenchida'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-medium">
                        {assignment.roleName}
                      </span>
                    </div>
                    {assignment.volunteerPhone && (
                      <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {assignment.volunteerPhone}
                      </div>
                    )}
                  </div>

                  {/* Status Selection Buttons in B&W */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleStatusChange(assignment.volunteerId, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        status === 'present'
                          ? 'bg-white text-black shadow-md'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Presente
                    </button>

                    <button
                      onClick={() => handleStatusChange(assignment.volunteerId, 'confirmed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        status === 'confirmed'
                          ? 'bg-zinc-800 text-white border border-zinc-600'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      Confirmado
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(assignment.volunteerId, 'absent_justified')
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        status === 'absent_justified'
                          ? 'bg-zinc-800 text-zinc-200 border border-zinc-600'
                          : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      Falta Justificada
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(assignment.volunteerId, 'absent_unjustified')
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        status === 'absent_unjustified'
                          ? 'bg-zinc-900 text-zinc-400 border border-zinc-700 font-bold'
                          : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      Faltou
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-10 bg-zinc-950 border border-zinc-800 rounded-2xl text-center text-zinc-400 text-xs">
          Nenhuma escala montada para controle de presença.
        </div>
      )}
    </div>
  );
};
