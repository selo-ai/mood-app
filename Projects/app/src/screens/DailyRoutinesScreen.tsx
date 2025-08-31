import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  Home, 
  Plus, 
  CheckCircle, 
  Circle, 
  Edit3, 
  Trash2,
  ArrowLeft
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';
import { Routine } from '../types';

type DailyRoutinesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DailyRoutines'>;

const DailyRoutinesScreen: React.FC = () => {
  const navigation = useNavigation<DailyRoutinesScreenNavigationProp>();
  const { routines, addRoutine, updateRoutine, deleteRoutine, toggleRoutineCompletion } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [routineTitle, setRoutineTitle] = useState('');

  const handleAddRoutine = () => {
    if (!routineTitle.trim()) {
      setToastMessage('Lütfen rutin adı girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const newRoutine: Routine = {
      id: Date.now().toString(),
      title: routineTitle.trim(),
      completed: false,
      createdAt: new Date(),
    };

    addRoutine(newRoutine);
    setRoutineTitle('');
    setShowAddModal(false);
    setToastMessage('Rutin başarıyla eklendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleEditRoutine = () => {
    if (!editingRoutine || !routineTitle.trim()) {
      setToastMessage('Lütfen rutin adı girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    updateRoutine(editingRoutine.id, { title: routineTitle.trim() });
    setRoutineTitle('');
    setEditingRoutine(null);
    setShowAddModal(false);
    setToastMessage('Rutin başarıyla güncellendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteRoutine = (id: string) => {
    Alert.alert(
      'Rutin Sil',
      'Bu rutini silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteRoutine(id);
            setToastMessage('Rutin başarıyla silindi!');
            setToastType('success');
            setShowToast(true);
          },
        },
      ]
    );
  };

  const handleToggleComplete = (id: string) => {
    toggleRoutineCompletion(id);
  };

  const handleEditPress = (routine: Routine) => {
    setEditingRoutine(routine);
    setRoutineTitle(routine.title);
    setShowAddModal(true);
  };

  const handleAddPress = () => {
    setEditingRoutine(null);
    setRoutineTitle('');
    setShowAddModal(true);
  };

  const completedCount = routines.filter(r => r.completed).length;
  const totalCount = routines.length;

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
            <Home width={32} height={32} color={COLORS.primary[500]} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>GÜNLÜK RUTİNLER</Text>
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
            <Text style={[styles.progressTitle, TEXT_STYLES.subtitle]}>Bugünkü İlerleme</Text>
            <Text style={[styles.progressValue, TEXT_STYLES.score]}>
              {completedCount}/{totalCount}
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }
              ]} 
            />
          </View>
          
          <Text style={[styles.progressText, TEXT_STYLES.body]}>
            {completedCount === totalCount 
              ? 'Harika! Tüm rutinlerini tamamladın! 🎉' 
              : `${totalCount - completedCount} rutin kaldı`
            }
          </Text>
        </View>

        {/* Routines List */}
        <View style={styles.routinesContainer}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Rutinlerim</Text>
          
          {routines.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, TEXT_STYLES.body]}>
                Henüz rutin eklenmemiş. İlk rutinini ekleyerek başla!
              </Text>
            </View>
          ) : (
            <View style={styles.routinesList}>
              {routines.map((routine) => (
                <View key={routine.id} style={styles.routineCard}>
                  <TouchableOpacity
                    style={styles.routineContent}
                    onPress={() => handleToggleComplete(routine.id)}
                  >
                    <View style={styles.checkboxContainer}>
                      {routine.completed ? (
                        <CheckCircle width={24} height={24} color={COLORS.status.success} />
                      ) : (
                        <Circle width={24} height={24} color={COLORS.text.secondary} />
                      )}
                    </View>
                    
                    <View style={styles.routineInfo}>
                      <Text style={[
                        styles.routineTitle,
                        TEXT_STYLES.body,
                        routine.completed && styles.completedText
                      ]}>
                        {routine.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.routineActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditPress(routine)}
                    >
                      <Edit3 width={16} height={16} color={COLORS.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteRoutine(routine.id)}
                    >
                      <Trash2 width={16} height={16} color={COLORS.status.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              {editingRoutine ? 'Rutin Düzenle' : 'Yeni Rutin Ekle'}
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Rutin Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Rutin adı..."
              placeholderTextColor={COLORS.text.tertiary}
              value={routineTitle}
              onChangeText={setRoutineTitle}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setRoutineTitle('');
                  setEditingRoutine(null);
                }}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={editingRoutine ? handleEditRoutine : handleAddRoutine}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                  {editingRoutine ? 'Güncelle' : 'Ekle'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddPress}
      >
        <Plus width={24} height={24} color={COLORS.text.inverse} />
      </TouchableOpacity>

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
  header: {
    alignItems: 'center',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    position: 'absolute',
    left: SPACING.lg,
    top: SPACING.lg,
    zIndex: 1,
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
    margin: SPACING.lg,
    marginTop: 0,
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
    color: COLORS.primary[500],
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.status.success,
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  routinesContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  routinesList: {
    gap: SPACING.sm,
  },
  routineCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  routineContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: SPACING.md,
  },
  routineInfo: {
    flex: 1,
  },
  routineTitle: {
    color: COLORS.text.primary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.text.secondary,
  },
  routineActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  floatingButton: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.primary[500],
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '90%',
    maxWidth: 400,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  label: {
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.neutral[200],
  },
  saveButton: {
    backgroundColor: COLORS.primary[500],
  },
  modalButtonText: {
    ...TEXT_STYLES.button,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
  },
  saveButtonText: {
    color: COLORS.text.inverse,
  },
});

export default DailyRoutinesScreen; 