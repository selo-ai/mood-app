// Günlük Puan Sistemi
export interface DailyScore {
  completedTasks: number;
  totalTasks: number;
  mistakes: number;
  focusTime: number; // dakika
  moodEntries: number;
  finalScore: number; // 0-100
  dailyMood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
}

// Günlük Kayıt
export interface DailyRecord {
  date: string; // YYYY-MM-DD
  tasks: Task[];
  mistakes: Mistake[];
  focusSessions: FocusSession[];
  moodEntries: MoodEntry[];
  dailyScore: DailyScore;
}

// Görev
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'work' | 'school' | 'personal' | 'health';
  priority: 'high' | 'medium' | 'low';
  duration: 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

// Günlük Rutin
export interface DailyRoutine {
  id: string;
  title: string;
  timeCategory: 'morning' | 'afternoon' | 'evening';
  hasReminder: boolean;
  completed: boolean;
  notes?: string;
  order: number;
  lastUpdate?: string; // Son güncelleme zamanı
}

// Hata
export interface Mistake {
  id: string;
  type: 'forgetfulness' | 'distraction' | 'impulsivity' | 'other';
  description: string;
  severity: number; // 1-5 arası hata puanı
  timestamp: Date;
}

// Odaklanma Seansı
export interface FocusSession {
  id: string;
  duration: number; // dakika
  startTime: Date;
  endTime: Date;
}

// Mood Girişi
export interface MoodEntry {
  id: string;
  score: number; // 1-10
  note?: string;
  triggers?: string[];
  timestamp: Date;
}

// Kategori
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  order: number;
}

// Kullanıcı
export interface User {
  id: string;
  name: string;
  preferences: {
    notificationEnabled: boolean;
    soundEnabled: boolean;
    theme: 'light' | 'dark';
  };
}

// Not
export interface TextNote {
  id: string;
  type: 'text';
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioNote {
  id: string;
  type: 'audio';
  title: string;
  audioUri: string;
  duration: number; // saniye
  createdAt: Date;
  updatedAt: Date;
}

export type Note = TextNote | AudioNote;

// Kitap
export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Beslenme Modülü Type'ları
export interface Meal {
  id: string;
  name: string;
  time: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface NutritionData {
  waterIntake: number;
  waterTarget: number;
  dailyCalories: number;
  meals: Meal[];
  date: string; // YYYY-MM-DD
  lastUpdate?: string; // Son güncelleme zamanı
}

export interface NutritionSettings {
  waterTarget: number;
  mealTimes: {
    breakfast: string;
    morningSnack: string;
    lunch: string;
    afternoonSnack: string;
    dinner: string;
  };
}

// Sağlık Modülü Type'ları
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: 'morning' | 'noon' | 'evening';
  notes: string;
  createdAt: Date;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  notes: string;
  createdAt: Date;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  time: 'morning' | 'noon' | 'evening';
  notes: string;
  createdAt: Date;
}

export interface Routine {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// İbadet Modülü Type'ları
export interface Prayer {
  id: string;
  name: 'sabah' | 'öğlen' | 'ikindi' | 'akşam' | 'yatsı';
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface QuranReading {
  id: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface IlmihalReading {
  id: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface TasbihPrayer {
  id: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface PrayerData {
  date: string; // YYYY-MM-DD
  prayers: Prayer[];
  quranReading: QuranReading | null;
  ilmihalReading: IlmihalReading | null;
  tasbihPrayer: TasbihPrayer | null;
  totalPrayersCompleted: number;
  totalPrayersCount: number;
  lastUpdate?: string; // Son güncelleme zamanı
}

// Alışveriş Modülü Type'ları
export interface ShoppingItem {
  id: string;
  name: string;
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SpecialDay {
  id: string;
  title: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Günlük İlaç/Takviye Takibi Type'ları
export interface DailyMedication {
  id: string;
  medicationId: string;
  name: string;
  isCompleted: boolean;
  completedAt?: Date;
  date: string; // YYYY-MM-DD
}

export interface DailySupplement {
  id: string;
  supplementId: string;
  name: string;
  isCompleted: boolean;
  completedAt?: Date;
  date: string; // YYYY-MM-DD
}

export interface DailyHealthData {
  date: string; // YYYY-MM-DD
  medications: DailyMedication[];
  supplements: DailySupplement[];
  lastUpdate?: string;
}

// Modül Yönetimi
export interface Module {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isEnabled: boolean;
  order: number;
  description: string;
  screenName: keyof RootStackParamList;
}

export interface ModuleSettings {
  enabledModules: string[]; // Module ID'leri
  moduleOrder: string[]; // Module ID'leri sıralı
  lastUpdate: string;
}

// Pomodoro Modülü
export interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number; // dakika cinsinden
  isCompleted: boolean;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  isCycle?: boolean; // Otomatik geçişli döngü seansı mı?
}

export interface PomodoroSettings {
  workDuration: number; // dakika
  shortBreakDuration: number; // dakika
  longBreakDuration: number; // dakika
  longBreakInterval: number; // kaç pomodoro sonra uzun mola
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  lastUpdate: string;
}

export interface PomodoroData {
  date: string;
  sessions: PomodoroSession[];
  completedPomodoros: number;
  totalWorkTime: number; // dakika
  totalBreakTime: number; // dakika
  lastUpdate: string;
} 