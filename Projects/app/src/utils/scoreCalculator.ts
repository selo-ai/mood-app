import { DailyScore, Task, Mistake, FocusSession, MoodEntry } from '../types';

/**
 * Günlük puan hesaplama fonksiyonu
 */
export const calculateDailyScore = (
  tasks: Task[],
  mistakes: Mistake[],
  focusSessions: FocusSession[],
  moodEntries: MoodEntry[]
): DailyScore => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const mistakesCount = mistakes.length;
  
  // Toplam odaklanma süresi (dakika)
  const totalFocusTime = focusSessions.reduce((total, session) => {
    const duration = session.endTime 
      ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
      : 0;
    return total + duration;
  }, 0);
  
  const moodEntriesCount = moodEntries.length;

  // Puan hesaplama formülü
  const baseScore = totalTasks > 0 ? (completedTasks / totalTasks) * 50 : 0;
  const mistakePenalty = mistakesCount * -5;
  const focusBonus = (totalFocusTime / 60) * 10;
  const moodBonus = moodEntriesCount * 2;

  const finalScore = Math.max(0, Math.min(100, 
    baseScore + mistakePenalty + focusBonus + moodBonus
  ));

  // Günlük mood belirleme
  const dailyMood = getDailyMood(finalScore);

  return {
    completedTasks,
    totalTasks,
    mistakes: mistakesCount,
    focusTime: totalFocusTime,
    moodEntries: moodEntriesCount,
    finalScore: Math.round(finalScore),
    dailyMood,
  };
};

/**
 * Puanına göre günlük mood belirleme
 */
export const getDailyMood = (score: number): DailyScore['dailyMood'] => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 50) return 'neutral';
  if (score >= 25) return 'bad';
  return 'terrible';
};

/**
 * Mood skorunu emoji ile göster
 */
export const getMoodEmoji = (mood: DailyScore['dailyMood']): string => {
  switch (mood) {
    case 'excellent': return '😄';
    case 'good': return '🙂';
    case 'neutral': return '😐';
    case 'bad': return '😔';
    case 'terrible': return '😢';
    default: return '😐';
  }
};

/**
 * Puanı yıldızlarla göster
 */
export const getScoreStars = (score: number): string => {
  const fullStars = Math.floor(score / 20);
  const hasHalfStar = score % 20 >= 10;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '⭐'.repeat(fullStars) + 
         (hasHalfStar ? '⭐' : '') + 
         '☆'.repeat(emptyStars);
};

/**
 * Günlük hedef belirleme
 */
export const getDailyGoal = (yesterdayScore: number): number => {
  if (yesterdayScore >= 90) return 95; // Mükemmel performans, biraz daha yüksek hedef
  if (yesterdayScore >= 75) return yesterdayScore + 5; // İyi performans, 5 puan artır
  if (yesterdayScore >= 50) return yesterdayScore + 10; // Orta performans, 10 puan artır
  return 60; // Düşük performans, 60'a çıkarmaya odaklan
};

/**
 * Motivasyon mesajı oluştur
 */
export const getMotivationMessage = (score: number, yesterdayScore?: number): string => {
  if (yesterdayScore !== undefined) {
    if (score > yesterdayScore) {
      return `Harika! Dünden ${score - yesterdayScore} puan daha iyi!`;
    } else if (score < yesterdayScore) {
      return `Bugün biraz zorlandın. Yarın daha iyi olacak!`;
    } else {
      return `Aynı seviyede kaldın. Biraz daha çaba göster!`;
    }
  }

  if (score >= 90) return 'Mükemmel bir gün! Sen harikasın!';
  if (score >= 75) return 'Çok iyi bir gün geçirdin!';
  if (score >= 50) return 'Orta seviyede bir gün. Biraz daha çaba göster!';
  if (score >= 25) return 'Zor bir gün olmuş. Yarın daha iyi olacak!';
  return 'Bugün zor bir gündü. Kendine nazik ol!';
}; 