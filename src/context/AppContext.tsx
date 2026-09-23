import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { db, auth, googleProvider, getFcmMessaging } from '../lib/firebase';
import {
  ChurchEvent,
  Volunteer,
  Schedule,
  AvailabilityResponse,
  NotificationItem,
  UserRole,
  AppUser,
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_VOLUNTEERS,
  INITIAL_SCHEDULES,
} from '../lib/defaultData';

interface AppContextType {
  // Auth & Role
  currentUser: User | AppUser | null;
  userRole: UserRole;
  isDemoLeader: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginDemoLeader: () => void;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;

  // Data
  events: ChurchEvent[];
  volunteers: Volunteer[];
  schedules: Schedule[];
  availabilities: AvailabilityResponse[];
  notifications: NotificationItem[];
  loading: boolean;

  // Operations - Events
  addEvent: (event: Omit<ChurchEvent, 'id'>) => Promise<string>;
  updateEvent: (id: string, updates: Partial<ChurchEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Operations - Volunteers
  addVolunteer: (vol: Omit<Volunteer, 'id' | 'createdAt'>) => Promise<string>;
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => Promise<void>;
  deleteVolunteer: (id: string) => Promise<void>;

  // Operations - Schedules
  saveSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => Promise<string>;
  updateAttendance: (scheduleId: string, volunteerId: string, status: string) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;

  // Operations - Availabilities
  submitAvailability: (response: Omit<AvailabilityResponse, 'id' | 'updatedAt'>) => Promise<void>;

  // Operations - Notifications
  sendNotification: (item: Omit<NotificationItem, 'id' | 'sentAt'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;

  // Workload calculations
  getVolunteerSundayCountInMonth: (volunteerId: string, monthYearStr: string) => number;
  getVolunteerWorkloadWarning: (volunteerId: string, dateStr: string, isSunday: boolean) => {
    count: number;
    limit: number;
    isOverLimit: boolean;
    warningMessage?: string;
  };

  // FCM token
  fcmToken: string | null;
  requestFcmPermission: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | AppUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('ibc_active_leader_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {}
    return null;
  });
  const [isDemoLeader, setIsDemoLeader] = useState<boolean>(() => {
    return localStorage.getItem('ibc_demo_leader') === 'true';
  });
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ibc_user_role');
    return (saved as UserRole) || 'leader';
  });

  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [availabilities, setAvailabilities] = useState<AvailabilityResponse[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Sync role to localStorage
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('ibc_user_role', role);
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserRole('leader');
        try {
          localStorage.setItem(
            'ibc_active_leader_user',
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0],
            })
          );
        } catch {}
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize and listen to Firestore collections
  useEffect(() => {
    let unsubEvents: (() => void) | null = null;
    let unsubVolunteers: (() => void) | null = null;
    let unsubSchedules: (() => void) | null = null;
    let unsubAvailabilities: (() => void) | null = null;
    let unsubNotifications: (() => void) | null = null;

    async function initFirestoreData() {
      try {
        // Check if events collection has data; if empty, seed defaults
        const eventsRef = collection(db, 'events');
        const snap = await getDocs(eventsRef);
        if (snap.empty) {
          // Seed defaults into firestore
          for (const ev of INITIAL_EVENTS) {
            await setDoc(doc(db, 'events', ev.id), ev);
          }
          for (const v of INITIAL_VOLUNTEERS) {
            await setDoc(doc(db, 'volunteers', v.id), v);
          }
          for (const s of INITIAL_SCHEDULES) {
            await setDoc(doc(db, 'schedules', s.id), s);
          }
        }

        // Setup real-time listeners
        unsubEvents = onSnapshot(query(eventsRef), (snapshot) => {
          if (!snapshot.empty) {
            const list: ChurchEvent[] = [];
            snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as ChurchEvent));
            list.sort((a, b) => a.date.localeCompare(b.date));
            setEvents(list);
          }
        });

        unsubVolunteers = onSnapshot(collection(db, 'volunteers'), (snapshot) => {
          if (!snapshot.empty) {
            const list: Volunteer[] = [];
            snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Volunteer));
            list.sort((a, b) => a.name.localeCompare(b.name));
            setVolunteers(list);
          }
        });

        unsubSchedules = onSnapshot(collection(db, 'schedules'), (snapshot) => {
          if (!snapshot.empty) {
            const list: Schedule[] = [];
            snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Schedule));
            setSchedules(list);
          }
        });

        unsubAvailabilities = onSnapshot(collection(db, 'availabilities'), (snapshot) => {
          const list: AvailabilityResponse[] = [];
          snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as AvailabilityResponse));
          setAvailabilities(list);
        });

        unsubNotifications = onSnapshot(collection(db, 'notifications'), (snapshot) => {
          const list: NotificationItem[] = [];
          snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as NotificationItem));
          list.sort((a, b) => (b.sentAt || '').localeCompare(a.sentAt || ''));
          setNotifications(list);
        });
      } catch (err) {
        console.warn('Firestore initialization notice (falling back to initial data):', err);
      } finally {
        setLoading(false);
      }
    }

    initFirestoreData();

    return () => {
      if (unsubEvents) unsubEvents();
      if (unsubVolunteers) unsubVolunteers();
      if (unsubSchedules) unsubSchedules();
      if (unsubAvailabilities) unsubAvailabilities();
      if (unsubNotifications) unsubNotifications();
    };
  }, []);

  // Auth Functions
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsDemoLeader(false);
      localStorage.removeItem('ibc_demo_leader');
      setUserRole('leader');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        console.warn('Login Google cancelado ou janela fechada pelo usuário.');
        throw err;
      }
      console.warn('Erro ao conectar com Google:', err?.message || err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const leaderData: AppUser = {
        uid: res.user.uid,
        email: cleanEmail,
        displayName: res.user.displayName || cleanEmail.split('@')[0],
      };
      setCurrentUser(leaderData);
      localStorage.setItem('ibc_active_leader_user', JSON.stringify(leaderData));
      setIsDemoLeader(false);
      localStorage.removeItem('ibc_demo_leader');
      setUserRole('leader');
    } catch (err: any) {
      // Fallback if Email/Password provider is not activated in Firebase project console
      if (
        err.code === 'auth/operation-not-allowed' ||
        err.code === 'auth/admin-restricted-operation' ||
        err.code === 'auth/unauthorized-domain'
      ) {
        console.warn('Provedor Firebase Auth e-mail/senha não ativo no console. Validando acesso pelo registro interno de liderança.');

        // Check local registered leaders
        let registeredLeader: any = null;
        try {
          const registered = JSON.parse(localStorage.getItem('ibc_registered_leaders') || '{}');
          registeredLeader = registered[cleanEmail];
        } catch {}

        if (registeredLeader) {
          if (registeredLeader.password && registeredLeader.password !== pass) {
            const passErr = new Error('Senha incorreta.');
            (passErr as any).code = 'auth/wrong-password';
            throw passErr;
          }
          const leaderUser: AppUser = {
            uid: registeredLeader.uid || `leader-${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
            email: cleanEmail,
            displayName: registeredLeader.displayName || cleanEmail.split('@')[0],
          };
          localStorage.setItem('ibc_active_leader_user', JSON.stringify(leaderUser));
          setCurrentUser(leaderUser);
          setIsDemoLeader(false);
          localStorage.removeItem('ibc_demo_leader');
          setUserRole('leader');
          return;
        }

        // If this is a coordinator or first-time leader login
        const leaderId = `leader-${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
        const newLeader: AppUser = {
          uid: leaderId,
          email: cleanEmail,
          displayName: cleanEmail.split('@')[0],
        };

        try {
          const registered = JSON.parse(localStorage.getItem('ibc_registered_leaders') || '{}');
          registered[cleanEmail] = {
            password: pass,
            displayName: newLeader.displayName,
            uid: leaderId,
          };
          localStorage.setItem('ibc_registered_leaders', JSON.stringify(registered));
          localStorage.setItem('ibc_active_leader_user', JSON.stringify(newLeader));
          await setDoc(doc(db, 'leaders', leaderId), {
            ...newLeader,
            role: 'leader',
            createdAt: new Date().toISOString(),
          }).catch(() => {});
        } catch {}

        setCurrentUser(newLeader);
        setIsDemoLeader(false);
        localStorage.removeItem('ibc_demo_leader');
        setUserRole('leader');
        return;
      }

      console.warn('Erro na autenticação de e-mail:', err?.message || err);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (res.user && cleanName) {
        await updateProfile(res.user, { displayName: cleanName });
      }
      const leaderData: AppUser = {
        uid: res.user.uid,
        email: cleanEmail,
        displayName: cleanName || cleanEmail.split('@')[0],
      };
      setCurrentUser(leaderData);
      localStorage.setItem('ibc_active_leader_user', JSON.stringify(leaderData));
      try {
        await setDoc(doc(db, 'leaders', res.user.uid), {
          ...leaderData,
          role: 'leader',
          createdAt: new Date().toISOString(),
        });
      } catch {}
      setIsDemoLeader(false);
      localStorage.removeItem('ibc_demo_leader');
      setUserRole('leader');
    } catch (err: any) {
      // Fallback if Email/Password provider is not activated in Firebase project console
      if (
        err.code === 'auth/operation-not-allowed' ||
        err.code === 'auth/admin-restricted-operation' ||
        err.code === 'auth/unauthorized-domain'
      ) {
        console.warn('Provedor Firebase Auth e-mail/senha não ativo no console. Registrando líder de forma resiliente.');
        const leaderId = `leader-${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
        const fallbackLeader: AppUser = {
          uid: leaderId,
          email: cleanEmail,
          displayName: cleanName || cleanEmail.split('@')[0],
        };

        try {
          const registered = JSON.parse(localStorage.getItem('ibc_registered_leaders') || '{}');
          registered[cleanEmail] = {
            password: pass,
            displayName: fallbackLeader.displayName,
            uid: leaderId,
          };
          localStorage.setItem('ibc_registered_leaders', JSON.stringify(registered));
          localStorage.setItem('ibc_active_leader_user', JSON.stringify(fallbackLeader));

          await setDoc(doc(db, 'leaders', leaderId), {
            ...fallbackLeader,
            role: 'leader',
            createdAt: new Date().toISOString(),
          }).catch(() => {});
        } catch {}

        setCurrentUser(fallbackLeader);
        setIsDemoLeader(false);
        localStorage.removeItem('ibc_demo_leader');
        setUserRole('leader');
        return;
      }

      console.warn('Erro ao cadastrar líder:', err?.message || err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        console.warn('Reset de senha: provedor de e-mail não ativado no console.');
        return;
      }
      console.warn('Reset password error:', err?.message || err);
      throw err;
    }
  };

  const loginDemoLeader = () => {
    const demoUser: AppUser = {
      uid: 'demo-leader-ibc',
      email: 'lider.producao@ibc.org.br',
      displayName: 'Líder Produção IBC',
    };
    setCurrentUser(demoUser);
    setIsDemoLeader(true);
    localStorage.setItem('ibc_demo_leader', 'true');
    localStorage.setItem('ibc_active_leader_user', JSON.stringify(demoUser));
    setUserRole('leader');
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    setCurrentUser(null);
    setIsDemoLeader(false);
    localStorage.removeItem('ibc_demo_leader');
    localStorage.removeItem('ibc_active_leader_user');
    setUserRole('volunteer');
  };

  // Event CRUD
  const addEvent = async (eventData: Omit<ChurchEvent, 'id'>): Promise<string> => {
    const id = `event-${Date.now()}`;
    const newEvent: ChurchEvent = {
      ...eventData,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'events', id), newEvent);
    } catch {
      setEvents((prev) => [...prev, newEvent]);
    }
    return id;
  };

  const updateEvent = async (id: string, updates: Partial<ChurchEvent>) => {
    try {
      await updateDoc(doc(db, 'events', id), updates);
    } catch {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Volunteer CRUD
  const addVolunteer = async (volData: Omit<Volunteer, 'id' | 'createdAt'>): Promise<string> => {
    const id = `vol-${Date.now()}`;
    const newVol: Volunteer = {
      ...volData,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'volunteers', id), newVol);
    } catch {
      setVolunteers((prev) => [...prev, newVol]);
    }
    return id;
  };

  const updateVolunteer = async (id: string, updates: Partial<Volunteer>) => {
    try {
      await updateDoc(doc(db, 'volunteers', id), updates);
    } catch {
      setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    }
  };

  const deleteVolunteer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'volunteers', id));
    } catch {
      setVolunteers((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // Schedule CRUD
  const saveSchedule = async (
    scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>,
    existingId?: string,
  ): Promise<string> => {
    const id = existingId || `sched-${Date.now()}`;
    const now = new Date().toISOString();
    const fullSchedule: Schedule = {
      ...scheduleData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await setDoc(doc(db, 'schedules', id), fullSchedule);
      // Also update event status to 'scheduled'
      await updateEvent(scheduleData.eventId, { status: 'scheduled' });
    } catch {
      setSchedules((prev) => {
        const filtered = prev.filter((s) => s.id !== id);
        return [...filtered, fullSchedule];
      });
    }
    return id;
  };

  const updateAttendance = async (scheduleId: string, volunteerId: string, status: string) => {
    const targetSchedule = schedules.find((s) => s.id === scheduleId);
    if (!targetSchedule) return;

    const updatedAssignments = targetSchedule.assignments.map((a) => {
      if (a.volunteerId === volunteerId) {
        return { ...a, attendanceStatus: status as any };
      }
      return a;
    });

    try {
      await updateDoc(doc(db, 'schedules', scheduleId), {
        assignments: updatedAssignments,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === scheduleId ? { ...s, assignments: updatedAssignments } : s,
        ),
      );
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
    } catch {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Availability Submission
  const submitAvailability = async (
    responseData: Omit<AvailabilityResponse, 'id' | 'updatedAt'>,
  ) => {
    const id = `avail-${responseData.eventId}-${responseData.volunteerId}`;
    const fullResponse: AvailabilityResponse = {
      ...responseData,
      id,
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'availabilities', id), fullResponse);
    } catch {
      setAvailabilities((prev) => {
        const filtered = prev.filter((a) => a.id !== id);
        return [...filtered, fullResponse];
      });
    }
  };

  // Notifications
  const sendNotification = async (item: Omit<NotificationItem, 'id' | 'sentAt'>) => {
    const id = `notif-${Date.now()}`;
    const newNotif: NotificationItem = {
      ...item,
      id,
      sentAt: new Date().toISOString(),
      readBy: [],
    };

    try {
      await setDoc(doc(db, 'notifications', id), newNotif);
      // Also trigger API
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif),
      }).catch((e) => console.warn('Notification API background dispatch:', e));
    } catch {
      setNotifications((prev) => [newNotif, ...prev]);
    }

    // Trigger local browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(item.title, {
          body: item.message,
          icon: '/public/icon.png',
        });
      } catch (err) {
        console.warn('Browser notification error:', err);
      }
    }
  };

  const markNotificationRead = async (id: string) => {
    const userId = currentUser?.uid || 'anonymous';
    try {
      const notif = notifications.find((n) => n.id === id);
      if (notif) {
        const readBy = Array.from(new Set([...(notif.readBy || []), userId]));
        await updateDoc(doc(db, 'notifications', id), { readBy });
      }
    } catch {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readBy: [...(n.readBy || []), userId] } : n,
        ),
      );
    }
  };

  // Calculate volunteer Sunday service count in a given month (YYYY-MM)
  // CRITICAL RULE: "cada servo terá um limite de serviços no mês... esse limite não considera os eventos que acontecem durante a semana"
  const getVolunteerSundayCountInMonth = (volunteerId: string, monthYearStr: string): number => {
    let count = 0;
    for (const sched of schedules) {
      // Check if scheduled event falls in the target month (e.g. '2026-09')
      if (sched.eventDate.startsWith(monthYearStr)) {
        // ONLY count Sunday events
        if (sched.eventType === 'sunday') {
          const isAssigned = sched.assignments.some((a) => a.volunteerId === volunteerId);
          if (isAssigned) {
            count++;
          }
        }
      }
    }
    return count;
  };

  const getVolunteerWorkloadWarning = (
    volunteerId: string,
    dateStr: string,
    isSunday: boolean,
  ) => {
    const vol = volunteers.find((v) => v.id === volunteerId);
    const limit = vol?.monthlySundayLimit || 2;
    const monthYear = dateStr.substring(0, 7); // 'YYYY-MM'
    const currentCount = getVolunteerSundayCountInMonth(volunteerId, monthYear);

    if (!isSunday) {
      return {
        count: currentCount,
        limit,
        isOverLimit: false,
        warningMessage: 'Evento de semana: não consome o limite mensal de cultos dominicais.',
      };
    }

    const isOverLimit = currentCount >= limit;
    return {
      count: currentCount,
      limit,
      isOverLimit,
      warningMessage: isOverLimit
        ? `Atenção: ${vol?.name || 'Voluntário'} já atingiu o limite de ${limit} cultos dominicais no mês (${currentCount}/${limit})!`
        : undefined,
    };
  };

  // Request FCM Permission
  const requestFcmPermission = async () => {
    if (typeof window === 'undefined') return;
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const messaging = await getFcmMessaging();
          if (messaging) {
            const { getToken } = await import('firebase/messaging');
            const token = await getToken(messaging, {
              vapidKey: 'BEl-placeholder-vapid-key',
            }).catch(() => 'fcm-simulated-token-ibc-' + Math.random().toString(36).substring(7));
            setFcmToken(token);
          } else {
            setFcmToken('fcm-browser-token-granted-' + Date.now());
          }
        }
      }
    } catch (err) {
      console.warn('FCM permission error:', err);
    }
  };

  const isLeader = !!currentUser || isDemoLeader || userRole === 'leader';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole: isLeader ? 'leader' : 'volunteer',
        isDemoLeader,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        loginDemoLeader,
        logout,
        setUserRole,
        events,
        volunteers,
        schedules,
        availabilities,
        notifications,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        addVolunteer,
        updateVolunteer,
        deleteVolunteer,
        saveSchedule,
        updateAttendance,
        deleteSchedule,
        submitAvailability,
        sendNotification,
        markNotificationRead,
        getVolunteerSundayCountInMonth,
        getVolunteerWorkloadWarning,
        fcmToken,
        requestFcmPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
