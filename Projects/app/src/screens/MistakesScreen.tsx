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
import { 
  AlertTriangle, 
  Plus, 
  ArrowLeft,
  Trash2,
  Edit3
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';
import { Mistake } from '../types';
import AddMistakeModal from '../components/AddMistakeModal';

type MistakesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Mistakes'>;

const MistakesScreen: React.FC = () => {
  const navigation = useNavigation<MistakesScreenNavigationProp>();
  const { getCurrentDailyRecord, deleteMistake, addMistake } = useAppStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showAddModal, setShowAddModal] = useState(false);

  const currentRecord = getCurrentDailyRecord();
  const mistakes = currentRecord.mistakes;

  const handleDeleteMistake = (id: string) => {
    Alert.alert(
      'Hata Sil',
      'Bu hatayı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteMistake(id);
            setToastMessage('Hata başarıyla silindi!');
            setToastType('success');
            setShowToast(true);
          },
        },
      ]
    );
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
    setShowAddModal(false);
    setToastMessage('Hata kaydedildi. Kendine nazik ol!');
    setToastType('success');
    setShowToast(true);
  };

  const getMistakeTypeLabel = (type: string) => {
    switch (type) {
      case 'forgetfulness': return 'Unutkanlık';
      case 'distraction': return 'Dikkat Dağınıklığı';
      case 'impulsivity': return 'Dürtü';
      case 'other': return 'Diğer';
      default: return 'Unutkanlık';
    }
  };

  const getMistakeTypeColor = (type: string) => {
    switch (type) {
      case 'forgetfulness': return COLORS.status.error;
      case 'distraction': return COLORS.status.warning;
      case 'impulsivity': return COLORS.status.info;
      case 'other': return COLORS.neutral[600];
      default: return COLORS.status.error;
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return COLORS.status.success;
    if (severity <= 3) return COLORS.status.warning;
    return COLORS.status.error;
  };

  const getSeverityText = (severity: number) => {
    switch (severity) {
      case 1: return 'Çok Hafif';
      case 2: return 'Hafif';
      case 3: return 'Orta';
      case 4: return 'Ağır';
      case 5: return 'Çok Ağır';
      default: return 'Orta';
    }
  };

  const totalMistakes = mistakes.length;
  const averageSeverity = totalMistakes > 0 
    ? mistakes.reduce((sum, mistake) => sum + mistake.severity, 0) / totalMistakes 
    : 0;

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
            <AlertTriangle width={32} height={32} color={COLORS.status.error} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>HATA TAKİBİ</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, TEXT_STYLES.score]}>{totalMistakes}</Text>
              <Text style={[styles.statLabel, TEXT_STYLES.caption]}>Toplam Hata</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, TEXT_STYLES.score]}>
                {averageSeverity.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, TEXT_STYLES.caption]}>Ortalama Puan</Text>
            </View>
          </View>
        </View>

        {/* Mistakes List */}
        <View style={styles.mistakesContainer}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Hatalarım</Text>
          
          {mistakes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <AlertTriangle width={64} height={64} color={COLORS.neutral[400]} />
              </View>
              <Text style={[styles.emptyTitle, TEXT_STYLES.h3]}>
                Henüz Hata Kaydedilmemiş
              </Text>
              <Text style={[styles.emptyText, TEXT_STYLES.body]}>
                İlk hatanı kaydederek başla
              </Text>
            </View>
          ) : (
            <View style={styles.mistakesList}>
              {mistakes.map((mistake) => (
                <View key={mistake.id} style={styles.mistakeCard}>
                  <View style={styles.mistakeHeader}>
                    <View style={styles.mistakeTypeContainer}>
                      <View style={styles.tagsRow}>
                        <View style={[
                          styles.typeTag,
                          { backgroundColor: getMistakeTypeColor(mistake.type) + '20' }
                        ]}>
                          <Text style={[
                            styles.typeText,
                            TEXT_STYLES.caption,
                            { color: getMistakeTypeColor(mistake.type) }
                          ]}>
                            {getMistakeTypeLabel(mistake.type)}
                          </Text>
                        </View>
                        <View style={[
                          styles.severityTag,
                          { backgroundColor: getSeverityColor(mistake.severity) + '20' }
                        ]}>
                          <Text style={[
                            styles.severityText,
                            TEXT_STYLES.caption,
                            { color: getSeverityColor(mistake.severity) }
                          ]}>
                            {mistake.severity}/5 - {getSeverityText(mistake.severity)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.mistakeActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteMistake(mistake.id)}
                      >
                        <Trash2 width={16} height={16} color={COLORS.status.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={[styles.descriptionText, TEXT_STYLES.body]}>
                    {mistake.description}
                  </Text>
                  
                  <Text style={[styles.timestampText, TEXT_STYLES.caption]}>
                    {mistake.timestamp.toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Mistake Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus width={24} height={24} color={COLORS.text.inverse} />
        <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
          Hata Ekle
        </Text>
      </TouchableOpacity>

      {/* Add Mistake Modal */}
      <AddMistakeModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddMistake={handleAddMistake}
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
  statsCard: {
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.primary[500],
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.neutral[300],
    marginHorizontal: SPACING.lg,
  },
  mistakesContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl * 2,
  },
  emptyIconContainer: {
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  mistakesList: {
    gap: SPACING.sm,
  },
  mistakeCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  mistakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  mistakeTypeContainer: {
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeText: {
    fontWeight: '600',
  },
  severityTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  severityText: {
    fontWeight: '600',
  },
  mistakeActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  descriptionText: {
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  timestampText: {
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: COLORS.status.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: COLORS.text.inverse,
    marginLeft: SPACING.sm,
  },
});

export default MistakesScreen;
