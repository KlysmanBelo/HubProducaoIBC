export type UserRole = 'leader' | 'volunteer';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[]; // Areas/functions they participate in (e.g. 'Multimídia 1', 'Direção de Programa')
  monthlySundayLimit: number; // default is 2 (only applies to Sunday services)
  notes?: string;
  fcmToken?: string;
  createdAt: string;
}

export type EventType = 'sunday' | 'weekday';

export interface ChurchEvent {
  id: string;
  title: string;
  type: EventType; // Sunday vs Weekday
  date: string; // Main date or starting date YYYY-MM-DD
  dates?: string[]; // Multiple dates for multi-day events!
  time: string; // HH:mm
  location: string;
  description?: string;
  status: 'open_for_availability' | 'scheduled' | 'completed';
  requiredRoles: string[]; // Specific functions active for this event (each event can have specific functions)
  createdAt?: string;
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe';

export interface AvailabilityResponse {
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerPhone: string;
  status: AvailabilityStatus;
  selectedDates?: string[]; // Which days in multi-day event the volunteer can serve
  preferredRoles?: string[];
  restrictions?: string;
  updatedAt: string;
}

export type AttendanceStatus = 'scheduled' | 'confirmed' | 'present' | 'absent_justified' | 'absent_unjustified';

export interface ScheduleAssignment {
  roleId: string;
  roleName: string;
  volunteerId: string;
  volunteerName: string;
  volunteerPhone?: string;
  attendanceStatus: AttendanceStatus;
  notes?: string;
}

export interface Schedule {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventType: EventType;
  assignments: ScheduleAssignment[];
  notes?: string;
  leaderName: string;
  leaderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'announcement' | 'scale_change' | 'general';
  recipient: 'all' | string; // 'all' or volunteerId
  recipientName?: string;
  sentAt: string;
  readBy?: string[];
}

export interface SongLyricResult {
  title: string;
  artist: string;
  key?: string;
  bpm?: string;
  composers?: string;
  structure?: Array<{ section: string; lyrics: string }>;
  fullLyrics: string;
  slidesFormat: string[]; // 2-3 lines per slide for ProPresenter / Holyrics
  groundingSources?: Array<{ title: string; url: string }>;
  isOfflineFallback?: boolean;
  notice?: string;
}

export interface AudioMeetingAnalysis {
  transcription: string;
  summary: string;
  keyPoints: {
    audio?: string[];
    lighting?: string[];
    broadcastVideo?: string[];
    projectionLyrics?: string[];
    stageDirection?: string[];
    general?: string[];
  };
  actionItems: Array<{
    action: string;
    assignee: string;
    deadline?: string;
  }>;
  urgentNotes?: string[];
}
