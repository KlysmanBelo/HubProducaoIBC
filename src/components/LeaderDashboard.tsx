import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Tv,
  ArrowUpRight,
  Clock,
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Link as LinkIcon,
  MessageSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { PRODUCTION_ROLES } from '../lib/defaultData';

export const LeaderDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const {
    events,
    volunteers,
    schedules,
    availabilities,
    getVolunteerSundayCountInMonth,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const publicFormUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?form=disponibilidade`
    : 'https://ais-dev-r5qggygsr66ctw2t22j2wq-490099951300.us-east1.run.app/?form=disponibilidade';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicFormUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyWhatsappInvite = () => {
    const message = `🎬 *PRODUÇÃO IBC FORTALEZA - DISPONIBILIDADE DO MÊS* 🎬\nOlá equipe de voluntários! Por favor, informem seus dias e cultos disponíveis no formulário oficial abaixo:\n\n🔗 *Link do Formulário:* ${publicFormUrl}\n\n⚡ Leva menos de 1 minuto e não precisa de login. Sua resposta é fundamental para a montagem das escalas.\nDeus abençoe seu serviço! 🙌`;

    navigator.clipboard.writeText(message);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const currentMonthYear = new Date().toISOString().substring(0, 7);

  // Metrics Calculations
  const totalVolunteers = volunteers.length;
  const totalEventsThisMonth = events.filter((e) => e.date.startsWith(currentMonthYear)).length;
  const totalSchedules = schedules.length;

  // Calculate overall attendance percentage
  let totalAssignments = 0;
  let totalPresent = 0;
  schedules.forEach((s) => {
    s.assignments.forEach((a) => {
      totalAssignments++;
      if (a.attendanceStatus === 'present' || a.attendanceStatus === 'confirmed') {
        totalPresent++;
      }
    });
  });
  const attendanceRate =
    totalAssignments > 0 ? Math.round((totalPresent / totalAssignments) * 100) : 100;

  // Volunteers at or exceeding Sunday limit
  const overloadedVolunteers = volunteers.filter((v) => {
    const sundayCount = getVolunteerSundayCountInMonth(v.id, currentMonthYear);
    return sundayCount >= (v.monthlySundayLimit || 2);
  });

  // Chart 1: Volunteers per Function / Area
  const rolesDistribution = PRODUCTION_ROLES.map((r) => {
    const count = volunteers.filter((v) => v.roles && v.roles.includes(r.name)).length;
    return {
      name: r.name,
      shortName: r.name.length > 14 ? r.name.substring(0, 13) + '…' : r.name,
      quantidade: count,
    };
  });

  // Chart 2: Assignments per Event
  const eventsChartData = events.slice(0, 6).map((ev) => {
    const sched = schedules.find((s) => s.eventId === ev.id);
    const assignedCount = sched ? sched.assignments.length : 0;
    const requiredCount = ev.requiredRoles ? ev.requiredRoles.length : 8;
    return {
      evento: ev.title.length > 15 ? ev.title.substring(0, 14) + '…' : ev.title,
      fullTitle: ev.title,
      escalados: assignedCount,
      necessarios: requiredCount,
    };
  });

  // Chart 3: Availability Breakdown
  const availableCount = availabilities.filter((a) => a.status === 'available').length;
  const maybeCount = availabilities.filter((a) => a.status === 'maybe').length;
  const unavailableCount = availabilities.filter((a) => a.status === 'unavailable').length;

  const availabilityData = [
    { name: 'Disponível', value: availableCount || 8, color: '#ffffff' },
    { name: 'Com Restrição', value: maybeCount || 3, color: '#71717a' },
    { name: 'Indisponível', value: unavailableCount || 2, color: '#27272a' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 text-white" />
            Visão Geral • Produção IBC
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard da Liderança
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Métricas de prontidão, frequência de voluntários, controle de sobrecarga e escalas dos cultos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('schedules')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            Gerenciar Escalas
          </button>
          <button
            onClick={() => onNavigate('events')}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Novo Evento
          </button>
        </div>
      </div>

      {/* Public Form Sharing Section */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center flex-shrink-0 shadow-sm">
              <LinkIcon className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Link do Formulário Público de Disponibilidade
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                  Sem Login
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Compartilhe este link com a equipe no WhatsApp. Os voluntários informam sua disponibilidade diretamente.
              </p>
            </div>
          </div>

          <a
            href={publicFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl text-xs font-semibold transition-all self-start sm:self-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Testar Formulário
          </a>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-2.5">
          <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5">
            <input
              type="text"
              readOnly
              value={publicFormUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full bg-transparent text-xs font-mono text-zinc-200 outline-none selection:bg-white selection:text-black cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copiado!' : 'Copiar Link'}
            </button>

            <button
              onClick={handleCopyWhatsappInvite}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              {copiedMessage ? <Check className="w-3.5 h-3.5 text-white" /> : <MessageSquare className="w-3.5 h-3.5" />}
              {copiedMessage ? 'Mensagem Copiada!' : 'Copiar Mensagem WhatsApp'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards in Monochrome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total de Servos
            </span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalVolunteers}</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span className="text-white font-semibold">100% cadastrados</span> com funções ativas
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Cultos & Eventos Mês
            </span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalEventsThisMonth}</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span className="text-white font-semibold">{totalSchedules} escalas</span> montadas no período
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Taxa de Presença
            </span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{attendanceRate}%</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span className="text-white font-semibold">Check-ins confirmados</span> nos últimos cultos
          </div>
        </div>

        {/* Card 4: Overload Warning */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Servos no Limite
            </span>
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{overloadedVolunteers.length}</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span>Cota de domingos atingida no mês</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart: Servos por Função / Área do Ministério (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-white" />
                Servos Capacitados por Função Técnica
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Quantidade de voluntários aptos em cada área da Produção IBC.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rolesDistribution}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="shortName"
                  type="category"
                  stroke="#a1a1aa"
                  fontSize={10}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#ffffff',
                  }}
                  cursor={{ fill: '#18181b' }}
                />
                <Bar dataKey="quantidade" fill="#ffffff" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Escala vs Necessidade dos Próximos Cultos (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-white" />
                Preenchimento das Escalas
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Voluntários escalados vs funções necessárias.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsChartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="evento"
                  stroke="#71717a"
                  fontSize={10}
                  angle={-25}
                  textAnchor="end"
                  tickLine={false}
                />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#ffffff',
                  }}
                  cursor={{ fill: '#18181b' }}
                />
                <Bar dataKey="escalados" fill="#ffffff" name="Escalados" radius={[4, 4, 0, 0]} />
                <Bar dataKey="necessarios" fill="#3f3f46" name="Necessários" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Row: Overload Monitor & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overload Table (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-zinc-300" />
              Monitor de Sobrecarga de Servos (Cultos Dominicais)
            </h2>
            <button
              onClick={() => onNavigate('volunteers')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              Ver todos <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-zinc-400">
            Regra da IBC: Apenas cultos de domingo consomem a cota mensal (padrão de 2 cultos/mês). Eventos de semana não entram nesta contagem.
          </p>

          <div className="divide-y divide-zinc-800/80">
            {volunteers.slice(0, 5).map((vol) => {
              const count = getVolunteerSundayCountInMonth(vol.id, currentMonthYear);
              const limit = vol.monthlySundayLimit || 2;
              const isAtLimit = count >= limit;
              const pct = Math.min(Math.round((count / limit) * 100), 100);

              return (
                <div key={vol.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{vol.name}</span>
                      {isAtLimit && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-white border border-zinc-700">
                          Limite Atingido
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {vol.roles.join(', ')}
                    </div>
                  </div>

                  <div className="w-36 flex flex-col items-end gap-1">
                    <span className="text-[11px] font-mono font-bold text-white">
                      {count} / {limit} domingos
                    </span>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${isAtLimit ? 'bg-white' : 'bg-zinc-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links & Upcoming Events (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-300" />
            Próximos Cultos Programados
          </h2>

          <div className="space-y-2.5">
            {events.slice(0, 4).map((ev) => {
              const hasSched = schedules.some((s) => s.eventId === ev.id);
              const isSunday = ev.type === 'sunday';

              return (
                <div
                  key={ev.id}
                  className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isSunday
                            ? 'bg-white text-black font-extrabold'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {isSunday ? 'Domingo' : 'Semana'}
                      </span>
                      <span className="text-xs font-bold text-white truncate">{ev.title}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">
                      📅 {ev.date} • ⏰ {ev.time}
                    </div>
                  </div>

                  <div>
                    {hasSched ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white">
                        ✓ Escala Pronta
                      </span>
                    ) : (
                      <button
                        onClick={() => onNavigate('schedules')}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-white text-black hover:bg-zinc-200 cursor-pointer transition-all"
                      >
                        Montar Escala
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
