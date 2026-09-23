import React, { useState } from 'react';
import {
  LogOut,
  Bell,
  Calendar,
  Users,
  Music,
  Mic,
  CheckCircle2,
  Tv,
  Layers,
  BarChart3,
  ExternalLink,
  Shield,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSwitchToVolunteer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSwitchToVolunteer,
}) => {
  const { currentUser, logout, isDemoLeader } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'schedules', label: 'Escalas & Imagens', icon: Layers },
    { id: 'volunteers', label: 'Servos & Áreas', icon: Users },
    { id: 'events', label: 'Eventos & Cultos', icon: Calendar },
    { id: 'attendance', label: 'Presença', icon: CheckCircle2 },
    { id: 'notifications', label: 'Notificações FCM', icon: Bell },
    { id: 'lyrics', label: 'Projeção / Letras', icon: Music },
    { id: 'transcription', label: 'Reuniões IA', icon: Mic },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Church Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm tracking-tighter shadow-sm">
              IBC
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight uppercase">
                  PAINEL DA PRODUÇÃO
                </span>
                <span className="hidden sm:inline-block text-[10px] font-black px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
                  Liderança
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 hidden xs:block">
                IBC Fortaleza • Gestão e Escalas
              </div>
            </div>
          </div>

          {/* Main Navigation for Leaders */}
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions (Switch to Public Form & Logout) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToVolunteer}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              title="Abrir página pública do voluntário"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Formulário Público</span>
            </button>

            {/* User details & logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="hidden md:flex flex-col text-right text-xs">
                <span className="font-bold text-white leading-tight">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Líder IBC'}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {isDemoLeader ? 'Acesso Demonstração' : 'Coordenador'}
                </span>
              </div>

              <button
                id="btn-header-logout"
                onClick={logout}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
                title="Sair do painel de liderança"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Sub-navigation for Medium Screens */}
        <div className="hidden md:flex xl:hidden items-center gap-1 py-2 border-t border-zinc-900 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-zinc-900 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-zinc-900">
              <button
                onClick={() => {
                  onSwitchToVolunteer();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Formulário Público do Voluntário</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
