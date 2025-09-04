import React from 'react';
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
  Heart, 
  Plus, 
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle,
  Circle
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';

type MedicationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Medications'>;

const MedicationsScreen: React.FC = () => {
  const navigation = useNavigation<MedicationsScreenNavigationProp>();
  const { 
    medications, 
    supplements, 
    getCurrentDailyHealthData,
    toggleDailyMedication,
    toggleDailySupplement 
  } = useAppStore();

  const dailyHealthData = getCurrentDailyHealthData();

  const handleToggleMedication = (medicationId: string) => {
    toggleDailyMedication(medicationId);
  };

  const handleToggleSupplement = (supplementId: string) => {
    toggleDailySupplement(supplementId);
  };

  const getMedicationStatus = (medicationId: string) => {
    return dailyHealthData.medications.find(med => med.medicationId === medicationId)?.isCompleted || false;
  };

  const getSupplementStatus = (supplementId: string) => {
    return dailyHealthData.supplements.find(supp => supp.supplementId === supplementId)?.isCompleted || false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft width={24} height={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerIconContainer}>
            <Heart width={32} height={32} color={COLORS.status.warning} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>SAĞLIK</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

                 {/* Günlük Takip Listesi */}
         {(medications.length > 0 || supplements.length > 0) && (
           <View style={styles.dailyTrackingSection}>
             <Text style={[styles.sectionTitle, TEXT_STYLES.h3, styles.dailyTrackingTitle]}>
               İlaç & Takviye Günlük Takip
             </Text>
             <View style={styles.itemsList}>
               {medications.map((medication) => {
                 const isCompleted = getMedicationStatus(medication.id);
                 return (
                   <TouchableOpacity
                     key={medication.id}
                     style={styles.itemCard}
                     onPress={() => handleToggleMedication(medication.id)}
                     activeOpacity={0.7}
                   >
                     <View style={styles.itemContent}>
                       {isCompleted ? (
                         <CheckCircle width={20} height={20} color={COLORS.status.success} />
                       ) : (
                         <Circle width={20} height={20} color={COLORS.neutral[400]} />
                       )}
                       <Text 
                         style={[
                           styles.itemText, 
                           TEXT_STYLES.body,
                           isCompleted && styles.completedItemText
                         ]}
                       >
                         {medication.name}
                       </Text>
                     </View>
                   </TouchableOpacity>
                 );
               })}
               {supplements.map((supplement) => {
                 const isCompleted = getSupplementStatus(supplement.id);
                 return (
                   <TouchableOpacity
                     key={supplement.id}
                     style={styles.itemCard}
                     onPress={() => handleToggleSupplement(supplement.id)}
                     activeOpacity={0.7}
                   >
                     <View style={styles.itemContent}>
                       {isCompleted ? (
                         <CheckCircle width={20} height={20} color={COLORS.status.success} />
                       ) : (
                         <Circle width={20} height={20} color={COLORS.neutral[400]} />
                       )}
                       <Text 
                         style={[
                           styles.itemText, 
                           TEXT_STYLES.body,
                           isCompleted && styles.completedItemText
                         ]}
                       >
                         {supplement.name}
                       </Text>
                     </View>
                   </TouchableOpacity>
                 );
               })}
             </View>
           </View>
         )}

         {/* Health Sections */}
         <View style={styles.sectionsContainer}>
           {/* İlaçlarım Section */}
           <TouchableOpacity
             style={[styles.sectionCard, { backgroundColor: COLORS.status.error + '10' }]}
             onPress={() => navigation.navigate('MedicationsList')}
             activeOpacity={0.7}
           >
             <View style={styles.sectionHeader}>
               <View style={styles.sectionIconContainer}>
                 <Heart width={32} height={32} color={COLORS.status.error} />
               </View>
               <View style={styles.sectionInfo}>
                 <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>İlaçlarım</Text>
                 <Text style={[styles.sectionSubtitle, TEXT_STYLES.caption]}>
                   İlaçlarını yönet
                 </Text>
               </View>
               <Plus width={24} height={24} color={COLORS.text.secondary} />
             </View>
           </TouchableOpacity>

           {/* Takviyelerim Section */}
           <TouchableOpacity
             style={[styles.sectionCard, { backgroundColor: COLORS.status.success + '10' }]}
             onPress={() => navigation.navigate('SupplementsList')}
             activeOpacity={0.7}
           >
             <View style={styles.sectionHeader}>
               <View style={styles.sectionIconContainer}>
                 <Heart width={32} height={32} color={COLORS.status.success} />
               </View>
               <View style={styles.sectionInfo}>
                 <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Takviyelerim</Text>
                 <Text style={[styles.sectionSubtitle, TEXT_STYLES.caption]}>
                   Takviyelerini yönet
                 </Text>
               </View>
               <Plus width={24} height={24} color={COLORS.text.secondary} />
             </View>
           </TouchableOpacity>

           {/* Doktor Randevularım Section */}
           <TouchableOpacity
             style={[styles.sectionCard, { backgroundColor: COLORS.status.info + '10' }]}
             onPress={() => navigation.navigate('AppointmentsList')}
             activeOpacity={0.7}
           >
             <View style={styles.sectionHeader}>
               <View style={styles.sectionIconContainer}>
                 <CalendarIcon width={32} height={32} color={COLORS.status.info} />
               </View>
               <View style={styles.sectionInfo}>
                 <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Doktor Randevularım</Text>
                 <Text style={[styles.sectionSubtitle, TEXT_STYLES.caption]}>
                   Randevularını yönet
                 </Text>
               </View>
               <Plus width={24} height={24} color={COLORS.text.secondary} />
             </View>
           </TouchableOpacity>
         </View>
      </ScrollView>
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
  sectionsContainer: {
    marginBottom: SPACING.lg,
  },
  sectionCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconContainer: {
    marginRight: SPACING.md,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    color: COLORS.text.secondary,
  },
  dailyTrackingSection: {
    marginBottom: SPACING.lg,
  },
  dailyTrackingTitle: {
    marginBottom: SPACING.md,
    color: COLORS.text.primary,
  },
  itemsList: {
    gap: SPACING.sm,
  },
  itemCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  itemText: {
    color: COLORS.text.primary,
    flex: 1,
  },
  completedItemText: {
    textDecorationLine: 'line-through',
    color: COLORS.text.tertiary,
  },
});

export default MedicationsScreen; 