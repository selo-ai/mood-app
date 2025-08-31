import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import AddTaskModal from '../components/AddTaskModal';
import AddMistakeModal from '../components/AddMistakeModal';
import AddMoodModal from '../components/AddMoodModal';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';
import { 
  Target, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  AlertTriangle, 
  Smile, 
  Home, 
  List, 
  FileText, 
  BookOpen,
  Heart,
  Coffee,
  Star,
  Moon,
  ShoppingBag,
  Calendar
} from 'react-native-feather';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { addTask, addMistake, addMoodEntry, getCurrentDailyRecord } = useAppStore();
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMistakeModal, setShowMistakeModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const currentRecord = getCurrentDailyRecord();
  const tasks = currentRecord.tasks;
  const mistakes = currentRecord.mistakes;
  const moods = currentRecord.moodEntries;

  const handleAddTask = (taskData: { title: string; description: string; category: string; priority: string; duration: string }) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || undefined,
      category: taskData.category as 'work' | 'school' | 'personal' | 'health',
      priority: taskData.priority as 'high' | 'medium' | 'low',
      duration: taskData.duration as 'daily' | 'weekly' | 'monthly' | 'yearly',
      completed: false,
      createdAt: new Date(),
    };
    addTask(newTask);
    setShowTaskModal(false);
    setToastMessage('Görev başarıyla eklendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleAddMistake = (mistakeData: { type: string; description: string; severity: number }) => {
    const newMistake = {
      id: Date.now().toString(),
      type: mistakeData.type as 'forgetfulness' | 'distraction' | 'impulsivity' | 'other',
      description: mistakeData.description,
      severity: mistakeData.severity,
      timestamp: new Date(),
    };
    addMistake(newMistake);
    setShowMistakeModal(false);
    setToastMessage('Hata kaydedildi. Kendine nazik ol!');
    setToastType('success');
    setShowToast(true);
  };

  const handleAddMood = (moodData: { score: number; note: string }) => {
    const newMood = {
      id: Date.now().toString(),
      score: moodData.score,
      note: moodData.note || undefined,
      triggers: [],
      timestamp: new Date(),
    };
    addMoodEntry(newMood);
    setShowMoodModal(false);
    setToastMessage('Mood kaydedildi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === 'Günlük Rutinler') {
      navigation.navigate('DailyRoutines');
    } else if (categoryId === 'Hata Takibi') {
      navigation.navigate('Mistakes');
    } else if (categoryId === 'Görevler') {
      navigation.navigate('Tasks');
    } else if (categoryId === 'Sağlık') {
      navigation.navigate('Medications');
    } else if (categoryId === 'Notlar') {
      navigation.navigate('Notes');
    } else if (categoryId === 'Kitap Oku') {
      navigation.navigate('Books');
    } else if (categoryId === 'Beslenme') {
      navigation.navigate('Nutrition');
      } else if (categoryId === 'İbadet') {
    navigation.navigate('Prayer');
  } else if (categoryId === 'Alışveriş') {
    navigation.navigate('Shopping');
  } else if (categoryId === 'Özel Günler') {
    navigation.navigate('SpecialDays');
  } else if (categoryId === 'Modül Ekle') {
    // TODO: Modül yönetim sayfasına git
    Alert.alert('Modül Yönetimi', 'Modül yönetim sayfası yakında eklenecek!');
  } else {
    Alert.alert('Kategori', `${categoryId} sayfasına gidilecek`);
  }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Target width={32} height={32} color={COLORS.primary[500]} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>GÜNLÜK MOD</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={[styles.scoreTitle, TEXT_STYLES.subtitle]}>Bugünkü Puanın</Text>
            <Text style={[styles.scoreValue, TEXT_STYLES.score]}>0/100</Text>
          </View>
          
          <View style={styles.scoreDetails}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={styles.starText}>☆</Text>
              ))}
            </View>
            <View style={styles.moodContainer}>
              <Smile width={32} height={32} color={COLORS.neutral[600]} />
            </View>
          </View>

          <Text style={[styles.motivationText, TEXT_STYLES.body]}>Bugün zor bir gündü. Kendine nazik ol!</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <CheckCircle width={24} height={24} color={COLORS.status.success} />
            </View>
            <Text style={[styles.statNumber, TEXT_STYLES.stat]}>{tasks.filter(t => t.completed).length}/{tasks.length}</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.caption]}>Görev Tamamla</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <XCircle width={24} height={24} color={COLORS.status.error} />
            </View>
            <Text style={[styles.statNumber, TEXT_STYLES.stat]}>{mistakes.length}</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.caption]}>Hata</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Clock width={24} height={24} color={COLORS.status.info} />
            </View>
            <Text style={[styles.statNumber, TEXT_STYLES.stat]}>0dk</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.caption]}>Odaklanma</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Hızlı Aksiyonlar</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowTaskModal(true)}
            >
              <View style={styles.actionIconContainer}>
                <Plus width={24} height={24} color={COLORS.text.inverse} />
              </View>
              <Text style={[styles.actionButtonText, TEXT_STYLES.button]}>Görev Ekle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowMistakeModal(true)}
            >
              <View style={styles.actionIconContainer}>
                <AlertTriangle width={24} height={24} color={COLORS.text.inverse} />
              </View>
                             <Text style={[styles.actionButtonText, TEXT_STYLES.button]}>Hata Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Kategoriler</Text>
          
          <View style={styles.categoryGrid}>
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.primary[50] }]}
              onPress={() => handleCategoryPress('Günlük Rutinler')}
            >
              <View style={styles.categoryIconContainer}>
                <Home width={32} height={32} color={COLORS.primary[500]} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Günlük Rutinler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.primary[100] }]}
              onPress={() => handleCategoryPress('Görevler')}
            >
              <View style={styles.categoryIconContainer}>
                <List width={32} height={32} color={COLORS.primary[600]} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Görevler</Text>
            </TouchableOpacity>
            
                                  <TouchableOpacity
                        style={[styles.categoryCard, { backgroundColor: COLORS.status.error + '20' }]}
                        onPress={() => handleCategoryPress('Hata Takibi')}
                      >
                        <View style={styles.categoryIconContainer}>
                          <AlertTriangle width={32} height={32} color={COLORS.status.error} />
                        </View>
                        <Text style={[styles.categoryName, TEXT_STYLES.body]}>Hata Takibi</Text>
                      </TouchableOpacity>


            
                         <TouchableOpacity
               style={[styles.categoryCard, { backgroundColor: COLORS.status.warning + '20' }]}
               onPress={() => handleCategoryPress('Sağlık')}
             >
               <View style={styles.categoryIconContainer}>
                 <Heart width={32} height={32} color={COLORS.status.warning} />
               </View>
               <Text style={[styles.categoryName, TEXT_STYLES.body]}>Sağlık</Text>
             </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.status.info + '20' }]}
              onPress={() => handleCategoryPress('Notlar')}
            >
              <View style={styles.categoryIconContainer}>
                <FileText width={32} height={32} color={COLORS.status.info} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Notlar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.status.success + '20' }]}
              onPress={() => handleCategoryPress('Beslenme')}
            >
              <View style={styles.categoryIconContainer}>
                <Coffee width={32} height={32} color={COLORS.status.success} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Beslenme</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.neutral[200] }]}
              onPress={() => handleCategoryPress('Kitap Oku')}
            >
              <View style={styles.categoryIconContainer}>
                <BookOpen width={32} height={32} color={COLORS.neutral[600]} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Kitap Oku</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.primary[200] }]}
              onPress={() => handleCategoryPress('İbadet')}
            >
              <View style={styles.categoryIconContainer}>
                <Moon width={32} height={32} color={COLORS.primary[700]} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>İbadet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.status.info + '30' }]}
              onPress={() => handleCategoryPress('Alışveriş')}
            >
              <View style={styles.categoryIconContainer}>
                <ShoppingBag width={32} height={32} color={COLORS.status.info} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Alışveriş</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.status.warning + '20' }]}
              onPress={() => handleCategoryPress('Özel Günler')}
            >
              <View style={styles.categoryIconContainer}>
                <Calendar width={32} height={32} color={COLORS.status.warning} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Özel Günler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: COLORS.primary[100] }]}
              onPress={() => handleCategoryPress('Modül Ekle')}
            >
              <View style={styles.categoryIconContainer}>
                <Plus width={32} height={32} color={COLORS.primary[600]} />
              </View>
              <Text style={[styles.categoryName, TEXT_STYLES.body]}>Modül Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button - Mood */}
      <TouchableOpacity
        style={styles.floatingMoodButton}
        onPress={() => setShowMoodModal(true)}
      >
        <Smile width={24} height={24} color={COLORS.text.inverse} />
      </TouchableOpacity>

      {/* Modals */}
      <AddTaskModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onAddTask={handleAddTask}
      />

      <AddMistakeModal
        visible={showMistakeModal}
        onClose={() => setShowMistakeModal(false)}
        onAddMistake={handleAddMistake}
      />

      <AddMoodModal
        visible={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onAddMood={handleAddMood}
      />

      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2, // Floating button için extra padding
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerIconContainer: {
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  dateText: {
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  scoreCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scoreTitle: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  scoreValue: {
    color: COLORS.primary[500],
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starText: {
    fontSize: 24,
    color: COLORS.neutral[400],
  },
  moodContainer: {
    alignItems: 'center',
  },
  motivationText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    marginBottom: SPACING.xs,
  },
  statNumber: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: COLORS.text.inverse,
  },
  categories: {
    marginBottom: SPACING.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  categoryName: {
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  floatingMoodButton: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    backgroundColor: COLORS.status.success,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1000,
  },
});

export default DashboardScreen; 