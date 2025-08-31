import { Category } from '../types';

// Sabit Kategoriler
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'daily-routines',
    name: 'Günlük Rutinler',
    icon: '🏠',
    color: '#4CAF50',
    isDefault: true,
    order: 1,
  },
  {
    id: 'tasks',
    name: 'Görevler',
    icon: '📋',
    color: '#2196F3',
    isDefault: true,
    order: 2,
  },
  {
    id: 'medications',
    name: 'İlaçlar / Takviyeler',
    icon: '💊',
    color: '#FF9800',
    isDefault: true,
    order: 3,
  },
  {
    id: 'notes',
    name: 'Notlar',
    icon: '📝',
    color: '#9C27B0',
    isDefault: true,
    order: 4,
  },
  {
    id: 'nutrition',
    name: 'Beslenme',
    icon: '🍎',
    color: '#4CAF50',
    isDefault: true,
    order: 5,
  },
  {
    id: 'reading',
    name: 'Kitap Oku',
    icon: '📚',
    color: '#795548',
    isDefault: true,
    order: 6,
  },
];

// Opsiyonel Kategoriler
export const OPTIONAL_CATEGORIES: Category[] = [
  {
    id: 'prayer',
    name: 'İbadet',
    icon: '🕌',
    color: '#607D8B',
    isDefault: false,
    order: 7,
  },
  {
    id: 'wc-tracking',
    name: 'WC Takibi',
    icon: '🚽',
    color: '#FF5722',
    isDefault: false,
    order: 8,
  },
  {
    id: 'shopping',
    name: 'Alışveriş Listesi',
    icon: '🛒',
    color: '#E91E63',
    isDefault: false,
    order: 9,
  },
  {
    id: 'exercise',
    name: 'Egzersiz / Spor',
    icon: '🏃‍♂️',
    color: '#00BCD4',
    isDefault: false,
    order: 10,
  },
  {
    id: 'social',
    name: 'Sosyal İlişkiler',
    icon: '👥',
    color: '#8BC34A',
    isDefault: false,
    order: 11,
  },
  {
    id: 'finance',
    name: 'Finansal Takip',
    icon: '💰',
    color: '#FFC107',
    isDefault: false,
    order: 12,
  },
  {
    id: 'tech-detox',
    name: 'Teknoloji Detoksu',
    icon: '📱',
    color: '#9E9E9E',
    isDefault: false,
    order: 13,
  },
  {
    id: 'sleep',
    name: 'Uyku Takibi',
    icon: '😴',
    color: '#3F51B5',
    isDefault: false,
    order: 14,
  },
  {
    id: 'creativity',
    name: 'Yaratıcılık',
    icon: '🎨',
    color: '#FF5722',
    isDefault: false,
    order: 15,
  },
  {
    id: 'learning',
    name: 'Öğrenme / Gelişim',
    icon: '🎓',
    color: '#673AB7',
    isDefault: false,
    order: 16,
  },
];

// Tüm kategorileri birleştir
export const ALL_CATEGORIES = [...DEFAULT_CATEGORIES, ...OPTIONAL_CATEGORIES];

// Kategori ID'lerine göre bulma fonksiyonu
export const getCategoryById = (id: string): Category | undefined => {
  return ALL_CATEGORIES.find(category => category.id === id);
}; 