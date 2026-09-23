import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { VolunteerPortal } from './components/VolunteerPortal';
import { LeaderLogin } from './components/LeaderLogin';
import { LeaderDashboard } from './components/LeaderDashboard';
import { ScheduleManager } from './components/ScheduleManager';
import { VolunteersDirectory } from './components/VolunteersDirectory';
import { EventManager } from './components/EventManager';
import { AttendanceControl } from './components/AttendanceControl';
import { LyricsSearch } from './components/LyricsSearch';
import { AudioTranscription } from './components/AudioTranscription';
import { NotificationCenter } from './components/NotificationCenter';

function checkIsVolunteerFormUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  return (
    search.includes('form') ||
    search.includes('voluntario') ||
    search.includes('disponibilidade') ||
    hash.includes('form') ||
    path.endsWith('/form') ||
    path.endsWith('/formulario')
  );
}

const MainContent: React.FC = () => {
  // Initial screen is leader (login if not authenticated). Volunteer form is on separate link (?form=disponibilidade)
  const [portalMode, setPortalMode] = useState<'volunteer' | 'leader'>(() => {
    return checkIsVolunteerFormUrl() ? 'volunteer' : 'leader';
  });
  const [activeLeaderTab, setActiveLeaderTab] = useState<string>('dashboard');

  const { currentUser, isDemoLeader, loading } = useApp();

  const isLeaderAuthenticated = !!currentUser || isDemoLeader;

  // Sync portal mode with URL changes (popstate)
  React.useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsVolunteerFormUrl()) {
        setPortalMode('volunteer');
      } else {
        setPortalMode('leader');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToVolunteer = () => {
    try {
      const newUrl = window.location.pathname + '?form=disponibilidade';
      window.history.pushState({}, '', newUrl);
    } catch {}
    setPortalMode('volunteer');
  };

  const navigateToLeader = () => {
    try {
      const newUrl = window.location.pathname;
      window.history.pushState({}, '', newUrl);
    } catch {}
    setPortalMode('leader');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="text-xs font-semibold text-zinc-400">
            Carregando Produção IBC Fortaleza...
          </div>
        </div>
      </div>
    );
  }

  // 1. Volunteer Portal (Accessible via separate link ?form=disponibilidade, without leader access button)
  if (portalMode === 'volunteer') {
    return (
      <VolunteerPortal onOpenLeaderLogin={navigateToLeader} />
    );
  }

  // 2. Leader Auth Gate: First screen when accessing directly. If leader is not signed in, show Login
  if (!isLeaderAuthenticated) {
    return (
      <LeaderLogin onBackToVolunteer={navigateToVolunteer} />
    );
  }

  // 3. Leader Dashboard & Panel: Monochromatic Black and White Theme
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      {/* Black & White Header with full navigation */}
      <Header
        activeTab={activeLeaderTab}
        setActiveTab={setActiveLeaderTab}
        onSwitchToVolunteer={navigateToVolunteer}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeLeaderTab === 'dashboard' && (
          <LeaderDashboard onNavigate={(tab: string) => setActiveLeaderTab(tab)} />
        )}
        {activeLeaderTab === 'schedules' && (
          <ScheduleManager onNavigateEvents={() => setActiveLeaderTab('events')} />
        )}
        {activeLeaderTab === 'volunteers' && <VolunteersDirectory />}
        {activeLeaderTab === 'events' && (
          <EventManager onNavigateSchedule={() => setActiveLeaderTab('schedules')} />
        )}
        {activeLeaderTab === 'attendance' && <AttendanceControl />}
        {activeLeaderTab === 'notifications' && <NotificationCenter />}
        {activeLeaderTab === 'lyrics' && <LyricsSearch />}
        {activeLeaderTab === 'transcription' && <AudioTranscription />}
      </main>

      {/* Clean Footer in Black & White */}
      <footer className="border-t border-zinc-900 bg-black py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-white tracking-wider">IBC FORTALEZA</span>
            <span>•</span>
            <span className="text-zinc-400">Ministério de Produção</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPortalMode('volunteer')}
              className="text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Formulário do Voluntário
            </button>
            <span>Campus Edson Queiroz</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
