import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  BookOpen,
  Book,
  Heart
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';
import { Prayer } from '../types';

type PrayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Prayer'>;

const PrayerScreen: React.FC = () => {
  const navigation = useNavigation<PrayerScreenNavigationProp>();
  const { togglePrayer, toggleQuranReading, toggleIlmihalReading, toggleTasbihPrayer, getCurrentPrayerData } = useAppStore();
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  


  const prayerData = getCurrentPrayerData();
  const prayers = prayerData.prayers;
  const quranReading = prayerData.quranReading;

  const handleTogglePrayer = (prayerName: Prayer['name']) => {
    const prayer = prayers.find(p => p.name === prayerName);
    const wasCompleted = prayer?.isCompleted;
    
    togglePrayer(prayerName);
    
    setToastMessage(wasCompleted ? 'Namaz işareti kaldırıldı.' : 'Namaz işaretlendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleToggleQuranReading = () => {
    const isCompleted = prayerData.quranReading?.isCompleted || false;
    toggleQuranReading();
    
    setToastMessage(isCompleted ? 'Kur\'an okuma işareti kaldırıldı.' : 'Kur\'an okuma işaretlendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleToggleIlmihalReading = () => {
    const isCompleted = prayerData.ilmihalReading?.isCompleted || false;
    toggleIlmihalReading();
    
    setToastMessage(isCompleted ? 'İlmihal okuma işareti kaldırıldı.' : 'İlmihal okuma işaretlendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleToggleTasbihPrayer = () => {
    const isCompleted = prayerData.tasbihPrayer?.isCompleted || false;
    toggleTasbihPrayer();
    
    setToastMessage(isCompleted ? 'Tesbih çekme işareti kaldırıldı.' : 'Tesbih çekme işaretlendi!');
    setToastType('success');
    setShowToast(true);
  };

  const getPrayerLabel = (name: Prayer['name']) => {
    switch (name) {
      case 'sabah': return 'Sabah Namazı';
      case 'öğlen': return 'Öğlen Namazı';
      case 'ikindi': return 'İkindi Namazı';
      case 'akşam': return 'Akşam Namazı';
      case 'yatsı': return 'Yatsı Namazı';
      default: return name;
    }
  };



  const getProgressPercentage = () => {
    return Math.round((prayerData.totalPrayersCompleted / prayerData.totalPrayersCount) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft width={24} height={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerIconContainer}>
            <BookOpen width={32} height={32} color={COLORS.neutral[600]} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>İBADET</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, TEXT_STYLES.subtitle]}>Günlük Namaz Takibi</Text>
            <Text style={[styles.progressValue, TEXT_STYLES.score]}>
              {prayerData.totalPrayersCompleted}/{prayerData.totalPrayersCount}
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
          </View>
          
          <Text style={[styles.progressText, TEXT_STYLES.body]}>
            %{getProgressPercentage()} tamamlandı
          </Text>
        </View>

        {/* Prayers Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Günlük Namazlar</Text>
          
          <View style={styles.prayersList}>
            {prayers.map((prayer) => (
              <TouchableOpacity
                key={prayer.id}
                style={[
                  styles.prayerCard,
                  prayer.isCompleted && styles.prayerCardCompleted
                ]}
                onPress={() => handleTogglePrayer(prayer.name)}
              >
                                 <View style={styles.prayerInfo}>
                   <Text style={[styles.prayerName, TEXT_STYLES.body]}>
                     {getPrayerLabel(prayer.name)}
                   </Text>
                 </View>
                
                <View style={styles.prayerStatus}>
                  {prayer.isCompleted ? (
                    <CheckCircle width={24} height={24} color={COLORS.status.success} />
                  ) : (
                    <Circle width={24} height={24} color={COLORS.neutral[400]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

                 {/* Additional Prayers Section */}
         <View style={styles.section}>
           <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Ek İbadetler</Text>
           
           <View style={styles.additionalPrayersList}>
             {/* Quran Reading */}
             <TouchableOpacity
               style={[
                 styles.additionalPrayerCard,
                 prayerData.quranReading?.isCompleted && styles.additionalPrayerCardCompleted
               ]}
               onPress={handleToggleQuranReading}
             >
               <View style={styles.additionalPrayerInfo}>
                 <BookOpen width={20} height={20} color={COLORS.neutral[600]} />
                 <Text style={[styles.additionalPrayerName, TEXT_STYLES.body]}>
                   Kur'an-ı Kerim Okuması
                 </Text>
               </View>
               <View style={styles.additionalPrayerStatus}>
                 {prayerData.quranReading?.isCompleted ? (
                   <CheckCircle width={24} height={24} color={COLORS.status.success} />
                 ) : (
                   <Circle width={24} height={24} color={COLORS.neutral[400]} />
                 )}
               </View>
             </TouchableOpacity>

             {/* Ilmihal Reading */}
             <TouchableOpacity
               style={[
                 styles.additionalPrayerCard,
                 prayerData.ilmihalReading?.isCompleted && styles.additionalPrayerCardCompleted
               ]}
               onPress={handleToggleIlmihalReading}
             >
               <View style={styles.additionalPrayerInfo}>
                 <Book width={20} height={20} color={COLORS.neutral[600]} />
                 <Text style={[styles.additionalPrayerName, TEXT_STYLES.body]}>
                   İlmihal Okuması
                 </Text>
               </View>
               <View style={styles.additionalPrayerStatus}>
                 {prayerData.ilmihalReading?.isCompleted ? (
                   <CheckCircle width={24} height={24} color={COLORS.status.success} />
                 ) : (
                   <Circle width={24} height={24} color={COLORS.neutral[400]} />
                 )}
               </View>
             </TouchableOpacity>

             {/* Tasbih Prayer */}
             <TouchableOpacity
               style={[
                 styles.additionalPrayerCard,
                 prayerData.tasbihPrayer?.isCompleted && styles.additionalPrayerCardCompleted
               ]}
               onPress={handleToggleTasbihPrayer}
             >
                               <View style={styles.additionalPrayerInfo}>
                  <Heart width={20} height={20} color={COLORS.neutral[600]} />
                  <Text style={[styles.additionalPrayerName, TEXT_STYLES.body]}>
                    Tesbih Çekme
                  </Text>
                </View>
               <View style={styles.additionalPrayerStatus}>
                 {prayerData.tasbihPrayer?.isCompleted ? (
                   <CheckCircle width={24} height={24} color={COLORS.status.success} />
                 ) : (
                   <Circle width={24} height={24} color={COLORS.neutral[400]} />
                 )}
               </View>
             </TouchableOpacity>
           </View>
         </View>
      </ScrollView>

      

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
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: SPACING.sm,
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
  progressCard: {
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
  progressHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  progressValue: {
    color: COLORS.neutral[600],
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.neutral[600],
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text.primary,
  },
  prayersList: {
    gap: SPACING.sm,
  },
  additionalPrayersList: {
    gap: SPACING.sm,
  },
  prayerCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  prayerCardCompleted: {
    backgroundColor: COLORS.status.success + '10',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  prayerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  prayerTime: {
    color: COLORS.text.secondary,
  },
  prayerStatus: {
    alignItems: 'center',
  },
  additionalPrayerCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  additionalPrayerCardCompleted: {
    backgroundColor: COLORS.status.success + '10',
  },
  additionalPrayerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  additionalPrayerName: {
    color: COLORS.text.primary,
  },
  additionalPrayerStatus: {
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: SPACING.lg,
  },


});

export default PrayerScreen;
