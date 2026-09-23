import React, { useState } from 'react';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Shield,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Layers,
  Search,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Volunteer } from '../types';
import { PRODUCTION_ROLES } from '../lib/defaultData';

export const VolunteersDirectory: React.FC = () => {
  const {
    volunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    getVolunteerSundayCountInMonth,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formLimit, setFormLimit] = useState(2);
  const [formRoles, setFormRoles] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState('');

  const currentMonthYear = new Date().toISOString().substring(0, 7);

  const handleOpenAdd = () => {
    setEditingVolunteer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormLimit(2);
    setFormRoles(['Direção de Programa']);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Volunteer) => {
    setEditingVolunteer(v);
    setFormName(v.name);
    setFormPhone(v.phone);
    setFormEmail(v.email);
    setFormLimit(v.monthlySundayLimit || 2);
    setFormRoles(v.roles || []);
    setFormNotes(v.notes || '');
    setIsModalOpen(true);
  };

  const toggleRoleInForm = (roleName: string) => {
    setFormRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    if (formRoles.length === 0) {
      alert('Selecione pelo menos uma área/função para este servo.');
      return;
    }

    if (editingVolunteer) {
      await updateVolunteer(editingVolunteer.id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        monthlySundayLimit: Number(formLimit),
        roles: formRoles,
        notes: formNotes,
      });
    } else {
      await addVolunteer({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        monthlySundayLimit: Number(formLimit),
        roles: formRoles,
        notes: formNotes,
      });
    }
    setIsModalOpen(false);
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      v.name.toLowerCase().includes(term) ||
      v.phone.includes(term) ||
      v.roles.some((r) => r.toLowerCase().includes(term));

    const matchesRole =
      roleFilter === 'all' || v.roles.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-white" />
            Liderança • Gestão de Servos da Produção
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Servos da Produção IBC Fortaleza
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cadastre os voluntários e as áreas que cada um faz parte (ex: Multimídia, Direção de Programa, Mesa de Som, etc).
          </p>
        </div>

        <button
          id="btn-create-volunteer-modal"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-zinc-200 text-black transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Novo Servo
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, telefone ou função do servo..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-white"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-64 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
          >
            <option value="all">Todas as Áreas ({volunteers.length} servos)</option>
            {PRODUCTION_ROLES.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVolunteers.map((vol) => {
          const sundayCount = getVolunteerSundayCountInMonth(vol.id, currentMonthYear);
          const limit = vol.monthlySundayLimit || 2;
          const isAtLimit = sundayCount >= limit;

          return (
            <div
              key={vol.id}
              className="p-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {vol.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <Phone className="w-3 h-3 text-zinc-500" />
                      <span>{vol.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(vol)}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Editar servo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remover ${vol.name}?`)) {
                          deleteVolunteer(vol.id);
                        }
                      }}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Excluir servo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Assigned Roles */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Áreas / Funções que faz parte:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {vol.roles.map((r, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Workload Sunday Bar */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white" />
                      Domingos Servidos no Mês:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isAtLimit ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {sundayCount} / {limit}
                    </span>
                  </div>

                  <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full ${isAtLimit ? 'bg-white' : 'bg-zinc-400'}`}
                      style={{
                        width: `${Math.min((sundayCount / limit) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  {isAtLimit && (
                    <div className="text-[10px] text-zinc-300 font-semibold flex items-center gap-1 pt-0.5">
                      <AlertTriangle className="w-3 h-3 text-white" />
                      Cota de domingo preenchida. Eventos de semana continuam livres!
                    </div>
                  )}
                </div>

                {vol.notes && (
                  <p className="text-[11px] text-zinc-400 italic">
                    Obs: {vol.notes}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <a
                  href={`https://wa.me/55${vol.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá ${vol.name}, tudo bem? Aqui é da Liderança da Produção IBC Fortaleza!`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3 h-3 text-white" />
                  Abrir WhatsApp
                </a>
                <span className="text-[11px] text-zinc-500">
                  Limite: {limit} cultos/mês
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Volunteer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-white" />
                {editingVolunteer ? 'Editar Dados do Servo' : 'Cadastrar Servo da Produção'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(85) 99999-0000"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="servo@gmail.com"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Limite Mensal de Cultos Dominicais *
                  </label>
                  <span className="text-xs font-bold text-white font-mono">
                    {formLimit} cultos / mês
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={formLimit}
                  onChange={(e) => setFormLimit(Number(e.target.value))}
                  className="w-full accent-white"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  Padrão IBC: 2 cultos de domingo no mês. Eventos durante a semana não são contabilizados.
                </p>
              </div>

              {/* Roles Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white block">
                    Áreas / Funções que faz parte no ministério *
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    {formRoles.length} selecionada(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                  {PRODUCTION_ROLES.map((r) => {
                    const isChecked = formRoles.includes(r.name);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleRoleInForm(r.name)}
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
                  Observações Técnicas
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ex: Opera console digital, tem carro para transporte de equipamento..."
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
                  {editingVolunteer ? 'Salvar Alterações' : 'Cadastrar Servo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
