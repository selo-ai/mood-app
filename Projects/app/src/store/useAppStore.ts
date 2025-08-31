import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  DailyRecord, 
  Task, 
  Mistake, 
  FocusSession, 
  MoodEntry, 
  DailyRoutine,
  Category,
  User,
  NutritionData,
  NutritionSettings,
  Meal,
  Note,
  Book,
  Medication,
  DoctorAppointment,
  Supplement,
  Routine,
  Prayer,
  QuranReading,
  IlmihalReading,
  TasbihPrayer,
  PrayerData,
  ShoppingList,
  ShoppingItem,
  SpecialDay,
  DailyHealthData,
  DailyMedication,
  DailySupplement
} from '../types';
import { calculateDailyScore } from '../utils/scoreCalculator';
import { DEFAULT_CATEGORIES } from '../constants/categories';

interface AppState {
  // Kullanıcı bilgileri
  user: User | null;
  
  // Aktif kategoriler
  activeCategories: Category[];
  
  // Günlük veriler
  currentDate: string;
  dailyRecords: Record<string, DailyRecord>;
  
  // Günlük rutinler
  dailyRoutines: DailyRoutine[];
  
  // Aktif odaklanma seansı
  activeFocusSession: FocusSession | null;
  
  // Beslenme modülü
  nutritionData: Record<string, NutritionData>;
  nutritionSettings: NutritionSettings;
  
  // Notlar modülü
  notes: Note[];
  
  // Kitap okuma modülü
  books: Book[];
  
  // Sağlık modülü
  medications: Medication[];
  appointments: DoctorAppointment[];
  supplements: Supplement[];
  routines: Routine[];
  dailyHealthData: Record<string, DailyHealthData>;
  
  // İbadet modülü
  prayerData: Record<string, PrayerData>;
  
  // Alışveriş modülü
  shoppingLists: ShoppingList[];
  
  // Actions
  setUser: (user: User) => void;
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
  reorderCategories: (categories: Category[]) => void;
  
  // Günlük veri işlemleri
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  
  addMistake: (mistake: Mistake) => void;
  deleteMistake: (mistakeId: string) => void;
  
  addMoodEntry: (moodEntry: MoodEntry) => void;
  deleteMoodEntry: (moodEntryId: string) => void;
  
  startFocusSession: () => void;
  endFocusSession: () => void;
  
  addDailyRoutine: (routine: DailyRoutine) => void;
  updateDailyRoutine: (routineId: string, updates: Partial<DailyRoutine>) => void;
  deleteDailyRoutine: (routineId: string) => void;
  toggleRoutineCompletion: (routineId: string) => void;
  
  // Yardımcı fonksiyonlar
  getCurrentDailyRecord: () => DailyRecord;
  getDailyRecord: (date: string) => DailyRecord | null;
  getCurrentScore: () => number;
  
  // Beslenme modülü action'ları
  addWater: (amount: number) => void;
  removeWater: (amount: number) => void;
  setWaterTarget: (target: number) => void;
  addCalories: (calories: number) => void;
  toggleMeal: (mealId: string) => void;
  resetDailyNutrition: () => void;
  getCurrentNutritionData: () => NutritionData;
  getNutritionData: (date: string) => NutritionData | null;
  
  // Notlar modülü action'ları
  addNote: (note: Note) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  getNote: (noteId: string) => Note | null;
  
  // Kitap okuma modülü action'ları
  addBook: (book: Book) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  deleteBook: (bookId: string) => void;
  updateBookProgress: (bookId: string, currentPage: number) => void;
  completeBook: (bookId: string) => void;
  getBook: (bookId: string) => Book | null;
  
  // Sağlık modülü action'ları
  addMedication: (medication: Medication) => void;
  updateMedication: (medicationId: string, updates: Partial<Medication>) => void;
  deleteMedication: (medicationId: string) => void;
  getMedication: (medicationId: string) => Medication | null;
  
  addAppointment: (appointment: DoctorAppointment) => void;
  updateAppointment: (appointmentId: string, updates: Partial<DoctorAppointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
  getAppointment: (appointmentId: string) => DoctorAppointment | null;
  
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (supplementId: string, updates: Partial<Supplement>) => void;
  deleteSupplement: (supplementId: string) => void;
  getSupplement: (supplementId: string) => Supplement | null;
  
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routineId: string, updates: Partial<Routine>) => void;
  deleteRoutine: (routineId: string) => void;
  toggleRoutineCompletion: (routineId: string) => void;
  getRoutine: (routineId: string) => Routine | null;
  
  // İbadet modülü action'ları
  togglePrayer: (prayerName: Prayer['name']) => void;
  toggleQuranReading: () => void;
  toggleIlmihalReading: () => void;
  toggleTasbihPrayer: () => void;
  getCurrentPrayerData: () => PrayerData;
  getPrayerData: (date: string) => PrayerData | null;
  
  // Alışveriş modülü action'ları
  addShoppingList: (name: string) => string;
  updateShoppingList: (listId: string, updates: Partial<ShoppingList>) => void;
  deleteShoppingList: (listId: string) => void;
  addShoppingItem: (listId: string, itemName: string, notes?: string) => void;
  updateShoppingItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => void;
  deleteShoppingItem: (listId: string, itemId: string) => void;
  toggleShoppingItem: (listId: string, itemId: string) => void;
  getShoppingList: (listId: string) => ShoppingList | null;
  replaceShoppingListItems: (listId: string, newItems: string[]) => void;
  
  // Özel Günler modülü action'ları
  addSpecialDay: (specialDay: SpecialDay) => void;
  updateSpecialDay: (specialDayId: string, updates: Partial<SpecialDay>) => void;
  deleteSpecialDay: (specialDayId: string) => void;
  getSpecialDay: (specialDayId: string) => SpecialDay | null;
  
  // Günlük Sağlık Takibi action'ları
  toggleDailyMedication: (medicationId: string) => void;
  toggleDailySupplement: (supplementId: string) => void;
  getCurrentDailyHealthData: () => DailyHealthData;
  getDailyHealthData: (date: string) => DailyHealthData | null;
}

const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createEmptyDailyRecord = (date: string): DailyRecord => ({
  date,
  tasks: [],
  mistakes: [],
  focusSessions: [],
  moodEntries: [],
  dailyScore: {
    completedTasks: 0,
    totalTasks: 0,
    mistakes: 0,
    focusTime: 0,
    moodEntries: 0,
    finalScore: 0,
    dailyMood: 'neutral',
  },
});

const createEmptyNutritionData = (date: string): NutritionData => ({
  date,
  waterIntake: 0,
  waterTarget: 2000,
  dailyCalories: 0,
  meals: [
    { id: '1', name: 'Sabah Kahvaltısı', time: '08:00', isCompleted: false },
    { id: '2', name: 'Ara Öğün', time: '10:30', isCompleted: false },
    { id: '3', name: 'Öğlen Yemeği', time: '13:00', isCompleted: false },
    { id: '4', name: 'Ara Öğün', time: '15:30', isCompleted: false },
    { id: '5', name: 'Akşam Yemeği', time: '19:00', isCompleted: false },
  ],
  lastUpdate: new Date().toISOString(),
});

const createEmptyPrayerData = (date: string): PrayerData => ({
  date,
  prayers: [
    { id: '1', name: 'sabah', isCompleted: false },
    { id: '2', name: 'öğlen', isCompleted: false },
    { id: '3', name: 'ikindi', isCompleted: false },
    { id: '4', name: 'akşam', isCompleted: false },
    { id: '5', name: 'yatsı', isCompleted: false },
  ],
  quranReading: null,
  ilmihalReading: null,
  tasbihPrayer: null,
  totalPrayersCompleted: 0,
  totalPrayersCount: 5,
  lastUpdate: new Date().toISOString(),
});

const DEFAULT_NUTRITION_SETTINGS: NutritionSettings = {
  waterTarget: 2000,
  mealTimes: {
    breakfast: '08:00',
    morningSnack: '10:30',
    lunch: '13:00',
    afternoonSnack: '15:30',
    dinner: '19:00',
  },
};

// Tarih string'lerini Date objelerine çeviren helper fonksiyon
const parseDates = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  if (Array.isArray(data)) {
    return data.map(parseDates);
  }
  
  const parsed: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'completedAt' || 
        key === 'timestamp' || key === 'startTime' || key === 'endTime') {
      parsed[key] = value ? new Date(value as string) : undefined;
    } else if (key === 'items' && Array.isArray(value)) {
      // ShoppingList içindeki items array'ini parse et
      parsed[key] = value.map(parseDates);
    } else if (typeof value === 'object' && value !== null) {
      parsed[key] = parseDates(value);
    } else {
      parsed[key] = value;
    }
  }
  return parsed;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      activeCategories: DEFAULT_CATEGORIES,
      currentDate: getTodayString(),
      dailyRecords: {},
      dailyRoutines: [],
      activeFocusSession: null,
             nutritionData: {},
       nutritionSettings: DEFAULT_NUTRITION_SETTINGS,
       notes: [],
       books: [],
       medications: [],
       appointments: [],
               supplements: [],
        routines: [],
        prayerData: {},
        shoppingLists: [],
        specialDays: [],
        dailyHealthData: {},

      // User actions
      setUser: (user: User) => set({ user }),

      // Category actions
      addCategory: (category: Category) => 
        set(state => ({
          activeCategories: [...state.activeCategories, category]
        })),

      removeCategory: (categoryId: string) =>
        set(state => ({
          activeCategories: state.activeCategories.filter(cat => cat.id !== categoryId)
        })),

      reorderCategories: (categories: Category[]) =>
        set({ activeCategories: categories }),

      // Task actions
      addTask: (task: Task) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedTasks = [...currentRecord.tasks, task];
        
        const updatedRecord = {
          ...currentRecord,
          tasks: updatedTasks,
          dailyScore: calculateDailyScore(
            updatedTasks,
            currentRecord.mistakes,
            currentRecord.focusSessions,
            currentRecord.moodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedTasks = currentRecord.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        );

        const updatedRecord = {
          ...currentRecord,
          tasks: updatedTasks,
          dailyScore: calculateDailyScore(
            updatedTasks,
            currentRecord.mistakes,
            currentRecord.focusSessions,
            currentRecord.moodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      deleteTask: (taskId: string) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedTasks = currentRecord.tasks.filter(task => task.id !== taskId);

        const updatedRecord = {
          ...currentRecord,
          tasks: updatedTasks,
          dailyScore: calculateDailyScore(
            updatedTasks,
            currentRecord.mistakes,
            currentRecord.focusSessions,
            currentRecord.moodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      toggleTaskCompletion: (taskId: string) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedTasks = currentRecord.tasks.map(task =>
          task.id === taskId 
            ? { 
                ...task, 
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : undefined,
              }
            : task
        );

        const updatedRecord = {
          ...currentRecord,
          tasks: updatedTasks,
          dailyScore: calculateDailyScore(
            updatedTasks,
            currentRecord.mistakes,
            currentRecord.focusSessions,
            currentRecord.moodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      // Mistake actions
      addMistake: (mistake: Mistake) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedMistakes = [...currentRecord.mistakes, mistake];

        const updatedRecord = {
          ...currentRecord,
          mistakes: updatedMistakes,
          dailyScore: calculateDailyScore(
            currentRecord.tasks,
            updatedMistakes,
            currentRecord.focusSessions,
            currentRecord.moodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      deleteMistake: (mistakeId: string) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedMistakes = currentRecord.mistakes.filter(mistake => mistake.id !== mistakeId);

        const updatedRecord = {
          ...currentRecord,
          mistakes: updatedMistakes,
          dailyScore: calculateDailyScore(
            currentRecord.tasks,
            updatedMistakes,
            currentRecord.focusSessions,
            currentRecord.moodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      // Mood actions
      addMoodEntry: (moodEntry: MoodEntry) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedMoodEntries = [...currentRecord.moodEntries, moodEntry];

        const updatedRecord = {
          ...currentRecord,
          moodEntries: updatedMoodEntries,
          dailyScore: calculateDailyScore(
            currentRecord.tasks,
            currentRecord.mistakes,
            currentRecord.focusSessions,
            updatedMoodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      deleteMoodEntry: (moodEntryId: string) => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        const updatedMoodEntries = currentRecord.moodEntries.filter(entry => entry.id !== moodEntryId);

        const updatedRecord = {
          ...currentRecord,
          moodEntries: updatedMoodEntries,
          dailyScore: calculateDailyScore(
            currentRecord.tasks,
            currentRecord.mistakes,
            currentRecord.focusSessions,
            updatedMoodEntries
          ),
        };

        set(state => ({
          dailyRecords: {
            ...state.dailyRecords,
            [state.currentDate]: updatedRecord,
          },
        }));
      },

      // Focus session actions
      startFocusSession: () => {
        const session: FocusSession = {
          id: Date.now().toString(),
          duration: 0,
          startTime: new Date(),
          endTime: null,
        };

        set({ activeFocusSession: session });
      },

      endFocusSession: () => {
        const state = get();
        const activeSession = state.activeFocusSession;
        
        if (activeSession) {
          const endTime = new Date();
          const duration = Math.floor((endTime.getTime() - activeSession.startTime.getTime()) / (1000 * 60));
          
          const completedSession: FocusSession = {
            ...activeSession,
            endTime,
            duration,
          };

          const currentRecord = state.getCurrentDailyRecord();
          const updatedFocusSessions = [...currentRecord.focusSessions, completedSession];

          const updatedRecord = {
            ...currentRecord,
            focusSessions: updatedFocusSessions,
            dailyScore: calculateDailyScore(
              currentRecord.tasks,
              currentRecord.mistakes,
              updatedFocusSessions,
              currentRecord.moodEntries
            ),
          };

          set(state => ({
            activeFocusSession: null,
            dailyRecords: {
              ...state.dailyRecords,
              [state.currentDate]: updatedRecord,
            },
          }));
        }
      },

      // Daily routine actions
      addDailyRoutine: (routine: DailyRoutine) => {
        set(state => ({
          dailyRoutines: [...state.dailyRoutines, {
            ...routine,
            lastUpdate: new Date().toISOString()
          }]
        }));
      },

      updateDailyRoutine: (routineId: string, updates: Partial<DailyRoutine>) => {
        set(state => ({
          dailyRoutines: state.dailyRoutines.map(routine =>
            routine.id === routineId ? { 
              ...routine, 
              ...updates,
              lastUpdate: new Date().toISOString()
            } : routine
          )
        }));
      },

      deleteDailyRoutine: (routineId: string) => {
        set(state => ({
          dailyRoutines: state.dailyRoutines.filter(routine => routine.id !== routineId)
        }));
      },

      toggleRoutineCompletion: (routineId: string) => {
        set(state => {
          // Günlük sıfırlama kontrolü
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          // Eğer rutinlerde lastUpdate yoksa veya farklı günse, tüm rutinleri sıfırla
          const needsReset = state.dailyRoutines.some(routine => {
            if (!routine.lastUpdate) return true;
            const lastUpdate = new Date(routine.lastUpdate);
            const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
            return lastUpdateDate < today;
          });

          if (needsReset) {
            // Tüm rutinleri sıfırla
            return {
              dailyRoutines: state.dailyRoutines.map(routine => ({
                ...routine,
                completed: false,
                lastUpdate: now.toISOString(),
              }))
            };
          }

          // Normal toggle işlemi
          return {
            dailyRoutines: state.dailyRoutines.map(routine =>
              routine.id === routineId 
                ? { 
                    ...routine, 
                    completed: !routine.completed,
                    lastUpdate: now.toISOString()
                  }
                : routine
            )
          };
        });
      },

      // Helper functions
      getCurrentDailyRecord: () => {
        const state = get();
        const currentRecord = state.dailyRecords[state.currentDate];
        
        if (!currentRecord) {
          const newRecord = createEmptyDailyRecord(state.currentDate);
          set(state => ({
            dailyRecords: {
              ...state.dailyRecords,
              [state.currentDate]: newRecord,
            },
          }));
          return newRecord;
        }
        
        return currentRecord;
      },

      getDailyRecord: (date: string) => {
        const state = get();
        return state.dailyRecords[date] || null;
      },

      getCurrentScore: () => {
        const state = get();
        const currentRecord = state.getCurrentDailyRecord();
        return currentRecord.dailyScore.finalScore;
      },

      // Beslenme modülü action'ları
      addWater: (amount: number) => {
        const state = get();
        const currentData = state.getCurrentNutritionData();
        const updatedData = {
          ...currentData,
          waterIntake: currentData.waterIntake + amount,
          lastUpdate: new Date().toISOString(),
        };

        set(state => ({
          nutritionData: {
            ...state.nutritionData,
            [state.currentDate]: updatedData,
          },
        }));
      },

      removeWater: (amount: number) => {
        const state = get();
        const currentData = state.getCurrentNutritionData();
        const updatedData = {
          ...currentData,
          waterIntake: Math.max(0, currentData.waterIntake - amount),
          lastUpdate: new Date().toISOString(),
        };

        set(state => ({
          nutritionData: {
            ...state.nutritionData,
            [state.currentDate]: updatedData,
          },
        }));
      },

      setWaterTarget: (target: number) => {
        const state = get();
        const currentData = state.getCurrentNutritionData();
        const updatedData = {
          ...currentData,
          waterTarget: target,
          lastUpdate: new Date().toISOString(),
        };

        set(state => ({
          nutritionData: {
            ...state.nutritionData,
            [state.currentDate]: updatedData,
          },
          nutritionSettings: {
            ...state.nutritionSettings,
            waterTarget: target,
          },
        }));
      },

      addCalories: (calories: number) => {
        const state = get();
        const currentData = state.getCurrentNutritionData();
        const updatedData = {
          ...currentData,
          dailyCalories: currentData.dailyCalories + calories,
          lastUpdate: new Date().toISOString(),
        };

        set(state => ({
          nutritionData: {
            ...state.nutritionData,
            [state.currentDate]: updatedData,
          },
        }));
      },

      toggleMeal: (mealId: string) => {
        const state = get();
        const currentData = state.getCurrentNutritionData();
        const updatedMeals = currentData.meals.map(meal =>
          meal.id === mealId
            ? {
                ...meal,
                isCompleted: !meal.isCompleted,
                completedAt: !meal.isCompleted ? new Date() : undefined,
              }
            : meal
        );

        const updatedData = {
          ...currentData,
          meals: updatedMeals,
          lastUpdate: new Date().toISOString(),
        };

        set(state => ({
          nutritionData: {
            ...state.nutritionData,
            [state.currentDate]: updatedData,
          },
        }));
      },

      resetDailyNutrition: () => {
        const state = get();
        const newData = createEmptyNutritionData(state.currentDate);
        
        set(state => ({
          nutritionData: {
            ...state.nutritionData,
            [state.currentDate]: newData,
          },
        }));
      },

             getCurrentNutritionData: () => {
         const state = get();
         const currentData = state.nutritionData[state.currentDate];
         
         if (!currentData) {
           const newData = createEmptyNutritionData(state.currentDate);
           // setState'i render sırasında çağırmamak için setTimeout kullan
           setTimeout(() => {
             set(state => ({
               nutritionData: {
                 ...state.nutritionData,
                 [state.currentDate]: newData,
               },
             }));
           }, 0);
           return newData;
         }
         
         // Günlük sıfırlama kontrolü - gece 00:00'dan sonra tüm işaretleri kaldır
         const now = new Date();
         const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
         const lastUpdate = currentData.lastUpdate ? new Date(currentData.lastUpdate) : null;
         
         if (lastUpdate && lastUpdate < today) {
           // Yeni gün başladı, tüm işaretleri sıfırla
           const resetData = {
             ...currentData,
             waterIntake: 0,
             dailyCalories: 0,
             meals: currentData.meals.map(meal => ({
               ...meal,
               isCompleted: false,
               completedAt: undefined,
             })),
             lastUpdate: now.toISOString()
           };
           
           // State'i güncelle
           setTimeout(() => {
             set(state => ({
               nutritionData: {
                 ...state.nutritionData,
                 [state.currentDate]: resetData,
               },
             }));
           }, 0);
           
           return resetData;
         }
         
         return currentData;
       },

      getNutritionData: (date: string) => {
        const state = get();
        return state.nutritionData[date] || null;
      },

      // Notlar modülü action'ları
      addNote: (note: Note) => {
        set(state => ({
          notes: [...state.notes, note]
        }));
      },

      updateNote: (noteId: string, updates: Partial<Note>) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === noteId 
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          )
        }));
      },

      deleteNote: (noteId: string) => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== noteId)
        }));
      },

      getNote: (noteId: string) => {
        const state = get();
        return state.notes.find(note => note.id === noteId) || null;
      },

      // Kitap okuma modülü action'ları
      addBook: (book: Book) => {
        set(state => ({
          books: [...state.books, book]
        }));
      },

      updateBook: (bookId: string, updates: Partial<Book>) => {
        set(state => ({
          books: state.books.map(book =>
            book.id === bookId 
              ? { ...book, ...updates, updatedAt: new Date() }
              : book
          )
        }));
      },

      deleteBook: (bookId: string) => {
        set(state => ({
          books: state.books.filter(book => book.id !== bookId)
        }));
      },

      updateBookProgress: (bookId: string, currentPage: number) => {
        set(state => ({
          books: state.books.map(book =>
            book.id === bookId 
              ? { 
                  ...book, 
                  currentPage,
                  updatedAt: new Date(),
                  isCompleted: currentPage >= book.totalPages
                }
              : book
          )
        }));
      },

      completeBook: (bookId: string) => {
        set(state => ({
          books: state.books.map(book =>
            book.id === bookId 
              ? { 
                  ...book, 
                  currentPage: book.totalPages,
                  isCompleted: true,
                  completedAt: new Date(),
                  updatedAt: new Date()
                }
              : book
          )
        }));
      },

      getBook: (bookId: string) => {
        const state = get();
        return state.books.find(book => book.id === bookId) || null;
      },

      // Sağlık modülü action'ları
      addMedication: (medication: Medication) => {
        set(state => ({
          medications: [...state.medications, medication]
        }));
      },

      updateMedication: (medicationId: string, updates: Partial<Medication>) => {
        set(state => ({
          medications: state.medications.map(medication =>
            medication.id === medicationId 
              ? { ...medication, ...updates }
              : medication
          )
        }));
      },

      deleteMedication: (medicationId: string) => {
        set(state => ({
          medications: state.medications.filter(medication => medication.id !== medicationId)
        }));
      },

      getMedication: (medicationId: string) => {
        const state = get();
        return state.medications.find(medication => medication.id === medicationId) || null;
      },

      addAppointment: (appointment: DoctorAppointment) => {
        set(state => ({
          appointments: [...state.appointments, appointment]
        }));
      },

      updateAppointment: (appointmentId: string, updates: Partial<DoctorAppointment>) => {
        set(state => ({
          appointments: state.appointments.map(appointment =>
            appointment.id === appointmentId 
              ? { ...appointment, ...updates }
              : appointment
          )
        }));
      },

      deleteAppointment: (appointmentId: string) => {
        set(state => ({
          appointments: state.appointments.filter(appointment => appointment.id !== appointmentId)
        }));
      },

      getAppointment: (appointmentId: string) => {
        const state = get();
        return state.appointments.find(appointment => appointment.id === appointmentId) || null;
      },

      addSupplement: (supplement: Supplement) => {
        set(state => ({
          supplements: [...state.supplements, supplement]
        }));
      },

      updateSupplement: (supplementId: string, updates: Partial<Supplement>) => {
        set(state => ({
          supplements: state.supplements.map(supplement =>
            supplement.id === supplementId 
              ? { ...supplement, ...updates }
              : supplement
          )
        }));
      },

      deleteSupplement: (supplementId: string) => {
        set(state => ({
          supplements: state.supplements.filter(supplement => supplement.id !== supplementId)
        }));
      },

      getSupplement: (supplementId: string) => {
        const state = get();
        return state.supplements.find(supplement => supplement.id === supplementId) || null;
      },

      addRoutine: (routine: Routine) => {
        set(state => ({
          routines: [...state.routines, routine]
        }));
      },

      updateRoutine: (routineId: string, updates: Partial<Routine>) => {
        set(state => ({
          routines: state.routines.map(routine =>
            routine.id === routineId 
              ? { ...routine, ...updates }
              : routine
          )
        }));
      },

      deleteRoutine: (routineId: string) => {
        set(state => ({
          routines: state.routines.filter(routine => routine.id !== routineId)
        }));
      },

      toggleRoutineCompletion: (routineId: string) => {
        set(state => ({
          routines: state.routines.map(routine =>
            routine.id === routineId 
              ? { ...routine, completed: !routine.completed }
              : routine
          )
        }));
      },

             getRoutine: (routineId: string) => {
         const state = get();
         return state.routines.find(routine => routine.id === routineId) || null;
       },

       // İbadet modülü action'ları
       togglePrayer: (prayerName: Prayer['name']) => {
         const state = get();
         const currentData = state.getCurrentPrayerData();
         const updatedPrayers = currentData.prayers.map(prayer =>
           prayer.name === prayerName
             ? {
                 ...prayer,
                 isCompleted: !prayer.isCompleted,
                 completedAt: !prayer.isCompleted ? new Date() : undefined,
               }
             : prayer
         );

         const totalPrayersCompleted = updatedPrayers.filter(p => p.isCompleted).length;

                   const updatedData = {
            ...currentData,
            prayers: updatedPrayers,
            totalPrayersCompleted,
            lastUpdate: new Date().toISOString(),
          };

         set(state => ({
           prayerData: {
             ...state.prayerData,
             [state.currentDate]: updatedData,
           },
         }));
       },

               toggleQuranReading: () => {
          const state = get();
          const currentData = state.getCurrentPrayerData();
          const isCompleted = currentData.quranReading?.isCompleted || false;
          
          const quranReading: QuranReading = {
            id: Date.now().toString(),
            isCompleted: !isCompleted,
            completedAt: !isCompleted ? new Date() : undefined,
          };

          const updatedData = {
            ...currentData,
            quranReading,
            lastUpdate: new Date().toISOString(),
          };

          set(state => ({
            prayerData: {
              ...state.prayerData,
              [state.currentDate]: updatedData,
            },
          }));
        },

        toggleIlmihalReading: () => {
          const state = get();
          const currentData = state.getCurrentPrayerData();
          const isCompleted = currentData.ilmihalReading?.isCompleted || false;
          
          const ilmihalReading: IlmihalReading = {
            id: Date.now().toString(),
            isCompleted: !isCompleted,
            completedAt: !isCompleted ? new Date() : undefined,
          };

          const updatedData = {
            ...currentData,
            ilmihalReading,
            lastUpdate: new Date().toISOString(),
          };

          set(state => ({
            prayerData: {
              ...state.prayerData,
              [state.currentDate]: updatedData,
            },
          }));
        },

        toggleTasbihPrayer: () => {
          const state = get();
          const currentData = state.getCurrentPrayerData();
          const isCompleted = currentData.tasbihPrayer?.isCompleted || false;
          
          const tasbihPrayer: TasbihPrayer = {
            id: Date.now().toString(),
            isCompleted: !isCompleted,
            completedAt: !isCompleted ? new Date() : undefined,
          };

          const updatedData = {
            ...currentData,
            tasbihPrayer,
            lastUpdate: new Date().toISOString(),
          };

          set(state => ({
            prayerData: {
              ...state.prayerData,
              [state.currentDate]: updatedData,
            },
          }));
        },

               getCurrentPrayerData: () => {
          const state = get();
          const currentData = state.prayerData[state.currentDate];
          
          if (!currentData) {
            const newData = createEmptyPrayerData(state.currentDate);
            setTimeout(() => {
              set(state => ({
                prayerData: {
                  ...state.prayerData,
                  [state.currentDate]: newData,
                },
              }));
            }, 0);
            return newData;
          }
          
          // Günlük sıfırlama kontrolü - gece 00:00'dan sonra tüm işaretleri kaldır
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const lastUpdate = currentData.lastUpdate ? new Date(currentData.lastUpdate) : null;
          
          if (lastUpdate && lastUpdate < today) {
            // Yeni gün başladı, tüm işaretleri sıfırla
                         const resetData = {
               ...currentData,
               prayers: currentData.prayers.map(prayer => ({
                 ...prayer,
                 isCompleted: false,
                 completedAt: undefined,
               })),
               quranReading: null,
               ilmihalReading: null,
               tasbihPrayer: null,
               totalPrayersCompleted: 0,
               lastUpdate: now.toISOString(),
             };
            
            setTimeout(() => {
              set(state => ({
                prayerData: {
                  ...state.prayerData,
                  [state.currentDate]: resetData,
                },
              }));
            }, 0);
            
            return resetData;
          }
          
          return currentData;
        },

               getPrayerData: (date: string) => {
          const state = get();
          return state.prayerData[date] || null;
        },

                 // Alışveriş modülü action'ları
         addShoppingList: (name: string) => {
           const newList: ShoppingList = {
             id: Date.now().toString(),
             name,
             items: [],
             createdAt: new Date(),
             updatedAt: new Date(),
           };

           set(state => ({
             shoppingLists: [...state.shoppingLists, newList]
           }));
           
           return newList.id;
         },

        updateShoppingList: (listId: string, updates: Partial<ShoppingList>) => {
          set(state => ({
            shoppingLists: state.shoppingLists.map(list =>
              list.id === listId 
                ? { ...list, ...updates, updatedAt: new Date() }
                : list
            )
          }));
        },

        deleteShoppingList: (listId: string) => {
          set(state => ({
            shoppingLists: state.shoppingLists.filter(list => list.id !== listId)
          }));
        },

        addShoppingItem: (listId: string, itemName: string, notes?: string) => {
          const newItem: ShoppingItem = {
            id: Date.now().toString(),
            name: itemName,
            isCompleted: false,
            notes,
          };

          set(state => ({
            shoppingLists: state.shoppingLists.map(list =>
              list.id === listId 
                ? { 
                    ...list, 
                    items: [...list.items, newItem],
                    updatedAt: new Date()
                  }
                : list
            )
          }));
        },

        updateShoppingItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
          set(state => ({
            shoppingLists: state.shoppingLists.map(list =>
              list.id === listId 
                ? {
                    ...list,
                    items: list.items.map(item =>
                      item.id === itemId 
                        ? { ...item, ...updates }
                        : item
                    ),
                    updatedAt: new Date()
                  }
                : list
            )
          }));
        },

        deleteShoppingItem: (listId: string, itemId: string) => {
          set(state => ({
            shoppingLists: state.shoppingLists.map(list =>
              list.id === listId 
                ? {
                    ...list,
                    items: list.items.filter(item => item.id !== itemId),
                    updatedAt: new Date()
                  }
                : list
            )
          }));
        },

        toggleShoppingItem: (listId: string, itemId: string) => {
          set(state => ({
            shoppingLists: state.shoppingLists.map(list =>
              list.id === listId 
                ? {
                    ...list,
                    items: list.items.map(item =>
                      item.id === itemId 
                        ? {
                            ...item,
                            isCompleted: !item.isCompleted,
                            completedAt: !item.isCompleted ? new Date() : undefined,
                          }
                        : item
                    ),
                    updatedAt: new Date()
                  }
                : list
            )
          }));
        },

                 getShoppingList: (listId: string) => {
           const state = get();
           return state.shoppingLists.find(list => list.id === listId) || null;
         },

         replaceShoppingListItems: (listId: string, newItems: string[]) => {
           const newItemsList = newItems.map((item, index) => ({
             id: Date.now().toString() + '_' + index + '_' + Math.random(),
             name: item,
             isCompleted: false,
           }));

           set(state => ({
             shoppingLists: state.shoppingLists.map(list =>
               list.id === listId 
                 ? { 
                     ...list, 
                     items: newItemsList,
                     updatedAt: new Date()
                   }
                 : list
             )
           }));
         },

         // Özel Günler modülü action'ları
         addSpecialDay: (specialDay: SpecialDay) => {
           set(state => ({
             specialDays: [...state.specialDays, specialDay]
           }));
         },

         updateSpecialDay: (specialDayId: string, updates: Partial<SpecialDay>) => {
           set(state => ({
             specialDays: state.specialDays.map(specialDay =>
               specialDay.id === specialDayId 
                 ? { ...specialDay, ...updates, updatedAt: new Date() }
                 : specialDay
             )
           }));
         },

         deleteSpecialDay: (specialDayId: string) => {
           set(state => ({
             specialDays: state.specialDays.filter(specialDay => specialDay.id !== specialDayId)
           }));
         },

         getSpecialDay: (specialDayId: string) => {
           const state = get();
           return state.specialDays.find(specialDay => specialDay.id === specialDayId) || null;
         },

         // Günlük Sağlık Takibi action'ları
         toggleDailyMedication: (medicationId: string) => {
           const state = get();
           const currentDate = state.currentDate;
           const currentData = state.getCurrentDailyHealthData();
           
           const existingMedication = currentData.medications.find(
             med => med.medicationId === medicationId
           );
           
           let updatedMedications;
           if (existingMedication) {
             // Mevcut ilacı toggle et
             updatedMedications = currentData.medications.map(med =>
               med.medicationId === medicationId
                 ? {
                     ...med,
                     isCompleted: !med.isCompleted,
                     completedAt: !med.isCompleted ? new Date() : undefined
                   }
                 : med
             );
           } else {
             // Yeni ilaç ekle
             const medication = state.medications.find(med => med.id === medicationId);
             if (medication) {
               const newDailyMedication: DailyMedication = {
                 id: Date.now().toString(),
                 medicationId: medicationId,
                 name: medication.name,
                 isCompleted: true,
                 completedAt: new Date(),
                 date: currentDate
               };
               updatedMedications = [...currentData.medications, newDailyMedication];
             } else {
               updatedMedications = currentData.medications;
             }
           }
           
           const updatedData: DailyHealthData = {
             ...currentData,
             medications: updatedMedications,
             lastUpdate: new Date().toISOString()
           };
           
           set(state => ({
             dailyHealthData: {
               ...state.dailyHealthData,
               [currentDate]: updatedData
             }
           }));
         },

         toggleDailySupplement: (supplementId: string) => {
           const state = get();
           const currentDate = state.currentDate;
           const currentData = state.getCurrentDailyHealthData();
           
           const existingSupplement = currentData.supplements.find(
             supp => supp.supplementId === supplementId
           );
           
           let updatedSupplements;
           if (existingSupplement) {
             // Mevcut takviyeyi toggle et
             updatedSupplements = currentData.supplements.map(supp =>
               supp.supplementId === supplementId
                 ? {
                     ...supp,
                     isCompleted: !supp.isCompleted,
                     completedAt: !supp.isCompleted ? new Date() : undefined
                   }
                 : supp
             );
           } else {
             // Yeni takviye ekle
             const supplement = state.supplements.find(supp => supp.id === supplementId);
             if (supplement) {
               const newDailySupplement: DailySupplement = {
                 id: Date.now().toString(),
                 supplementId: supplementId,
                 name: supplement.name,
                 isCompleted: true,
                 completedAt: new Date(),
                 date: currentDate
               };
               updatedSupplements = [...currentData.supplements, newDailySupplement];
             } else {
               updatedSupplements = currentData.supplements;
             }
           }
           
           const updatedData: DailyHealthData = {
             ...currentData,
             supplements: updatedSupplements,
             lastUpdate: new Date().toISOString()
           };
           
           set(state => ({
             dailyHealthData: {
               ...state.dailyHealthData,
               [currentDate]: updatedData
             }
           }));
         },

         getCurrentDailyHealthData: () => {
           const state = get();
           const currentDate = state.currentDate;
           
           if (!state.dailyHealthData[currentDate]) {
             // Mevcut ilaç ve takviyelerden günlük veri oluştur
             const dailyMedications: DailyMedication[] = state.medications.map(med => ({
               id: Date.now().toString() + '_' + med.id,
               medicationId: med.id,
               name: med.name,
               isCompleted: false,
               date: currentDate
             }));
             
             const dailySupplements: DailySupplement[] = state.supplements.map(supp => ({
               id: Date.now().toString() + '_' + supp.id,
               supplementId: supp.id,
               name: supp.name,
               isCompleted: false,
               date: currentDate
             }));
             
             const newData: DailyHealthData = {
               date: currentDate,
               medications: dailyMedications,
               supplements: dailySupplements,
               lastUpdate: new Date().toISOString()
             };
             
             // State'i güncelle
             set(state => ({
               dailyHealthData: {
                 ...state.dailyHealthData,
                 [currentDate]: newData
               }
             }));
             
             return newData;
           }
           
           // Günlük sıfırlama kontrolü - gece 00:00'dan sonra tüm işaretleri kaldır
           const currentData = state.dailyHealthData[currentDate];
           const now = new Date();
           const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
           const lastUpdate = currentData.lastUpdate ? new Date(currentData.lastUpdate) : null;
           
           if (lastUpdate && lastUpdate < today) {
             // Yeni gün başladı, tüm işaretleri sıfırla
             const resetData: DailyHealthData = {
               ...currentData,
               medications: currentData.medications.map(med => ({
                 ...med,
                 isCompleted: false,
                 completedAt: undefined,
               })),
               supplements: currentData.supplements.map(supp => ({
                 ...supp,
                 isCompleted: false,
                 completedAt: undefined,
               })),
               lastUpdate: now.toISOString()
             };
             
             // State'i güncelle
             set(state => ({
               dailyHealthData: {
                 ...state.dailyHealthData,
                 [currentDate]: resetData
               }
             }));
             
             return resetData;
           }
           
           return currentData;
         },

         getDailyHealthData: (date: string) => {
           const state = get();
           return state.dailyHealthData[date] || null;
         },
    }),
    {
      name: 'my-mood-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        activeCategories: state.activeCategories,
        dailyRecords: state.dailyRecords,
        dailyRoutines: state.dailyRoutines,
        nutritionData: state.nutritionData,
        nutritionSettings: state.nutritionSettings,
        notes: state.notes,
        books: state.books,
        medications: state.medications,
        appointments: state.appointments,
                           supplements: state.supplements,
          routines: state.routines,
          prayerData: state.prayerData,
          shoppingLists: state.shoppingLists,
          dailyHealthData: state.dailyHealthData,
      }),
             onRehydrateStorage: () => (state) => {
         if (state) {
           // Tarih string'lerini Date objelerine çevir
           state.notes = parseDates(state.notes);
           state.books = parseDates(state.books);
           state.medications = parseDates(state.medications);
           state.appointments = parseDates(state.appointments);
           state.supplements = parseDates(state.supplements);
           state.routines = parseDates(state.routines);
           state.shoppingLists = parseDates(state.shoppingLists);
           
           // Daily records içindeki tarihleri de çevir
           Object.keys(state.dailyRecords).forEach(date => {
             state.dailyRecords[date] = parseDates(state.dailyRecords[date]);
           });
           
           // Prayer data içindeki tarihleri de çevir
           Object.keys(state.prayerData).forEach(date => {
             state.prayerData[date] = parseDates(state.prayerData[date]);
           });
           
           // Daily health data içindeki tarihleri de çevir
           Object.keys(state.dailyHealthData).forEach(date => {
             state.dailyHealthData[date] = parseDates(state.dailyHealthData[date]);
           });
         }
       },
    }
  )
); 