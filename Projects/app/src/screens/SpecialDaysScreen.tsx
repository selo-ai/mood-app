import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  ArrowLeft, 
  Plus,
  Calendar,
  Trash2,
  Edit3
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import Toast from '../components/Toast';
import { useAppStore } from '../store/useAppStore';
import { SpecialDay } from '../types';

type SpecialDaysScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SpecialDays'>;

const SpecialDaysScreen: React.FC = () => {
  const navigation = useNavigation<SpecialDaysScreenNavigationProp>();
  
  const { specialDays, addSpecialDay, updateSpecialDay, deleteSpecialDay } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<SpecialDay | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [newNotes, setNewNotes] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [editNotes, setEditNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const handleAddSpecialDay = () => {
    if (!newTitle.trim()) {
      Alert.alert('Hata', 'Lütfen başlık girin');
      return;
    }

    const newSpecialDay: SpecialDay = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      title: newTitle.trim(),
      date: newDate,
      notes: newNotes.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addSpecialDay(newSpecialDay);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate(new Date());
    setNewNotes('');
    
    setToastMessage('Özel gün eklendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteSpecialDay = (specialDay: SpecialDay) => {
    Alert.alert(
      'Özel Günü Sil',
      `"${specialDay.title}" özel gününü silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteSpecialDay(specialDay.id);
            setToastMessage('Özel gün silindi!');
            setToastType('success');
            setShowToast(true);
          },
        },
      ]
    );
  };

  const handleEditSpecialDay = (specialDay: SpecialDay) => {
    setSelectedDay(specialDay);
    setEditTitle(specialDay.title);
    setEditDate(specialDay.date);
    setEditNotes(specialDay.notes || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedDay || !editTitle.trim()) {
      Alert.alert('Hata', 'Lütfen başlık girin');
      return;
    }

    updateSpecialDay(selectedDay.id, {
      title: editTitle.trim(),
      date: editDate,
      notes: editNotes.trim() || undefined,
      updatedAt: new Date(),
    });

    setShowEditModal(false);
    setEditTitle('');
    setEditDate(new Date());
    setEditNotes('');
    
    setToastMessage('Özel gün güncellendi!');
    setToastType('success');
    setShowToast(true);
  };

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.warn('Invalid date:', date);
      return 'Geçersiz tarih';
    }
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const targetDate = new Date(date);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün!';
    if (diffDays === 1) return 'Yarın!';
    if (diffDays === -1) return 'Dün';
    if (diffDays > 0) return `${diffDays} gün kaldı`;
    if (diffDays < 0) return `${Math.abs(diffDays)} gün önce`;
    return 'Bugün!';
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowEditDatePicker(false);
    }
    
    if (selectedDate) {
      if (isEditingDate) {
        setEditDate(selectedDate);
      } else {
        setNewDate(selectedDate);
      }
    }
  };

  const showDatePickerModal = (isEdit: boolean = false) => {
    setIsEditingDate(isEdit);
    if (Platform.OS === 'ios') {
      if (isEdit) {
        setShowEditDatePicker(true);
      } else {
        setShowDatePicker(true);
      }
    } else {
      if (isEdit) {
        setShowEditDatePicker(true);
      } else {
        setShowDatePicker(true);
      }
    }
  };

  const sortedSpecialDays = [...specialDays].sort((a, b) => {
    const today = new Date();
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    aDate.setHours(0, 0, 0, 0);
    bDate.setHours(0, 0, 0, 0);
    
    const aDiff = aDate.getTime() - today.getTime();
    const bDiff = bDate.getTime() - today.getTime();
    
    // Sort by closest upcoming date first
    return aDiff - bDiff;
  });

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
            <Calendar width={32} height={32} color={COLORS.primary[600]} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>ÖZEL GÜNLER</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Special Days Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Özel Günlerim</Text>
          
          {specialDays.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar width={64} height={64} color={COLORS.neutral[400]} />
              <Text style={[styles.emptyStateText, TEXT_STYLES.body]}>
                Henüz özel gün eklenmemiş
              </Text>
              <Text style={[styles.emptyStateSubtext, TEXT_STYLES.caption]}>
                İlk özel gününüzü eklemek için aşağıdaki butona tıklayın
              </Text>
            </View>
          ) : (
            <View style={styles.specialDaysContainer}>
              {sortedSpecialDays.map((specialDay) => (
                <View key={specialDay.id} style={styles.specialDayCard}>
                  <View style={styles.specialDayInfo}>
                    <Text style={[styles.specialDayTitle, TEXT_STYLES.body]}>
                      {specialDay.title}
                    </Text>
                    <Text style={[styles.specialDayDate, TEXT_STYLES.caption]}>
                      {formatDate(specialDay.date)}
                    </Text>
                    <Text style={[styles.specialDayCountdown, TEXT_STYLES.caption]}>
                      {getDaysUntil(specialDay.date)}
                    </Text>
                    {specialDay.notes && (
                      <Text style={[styles.specialDayNotes, TEXT_STYLES.caption]}>
                        {specialDay.notes}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.specialDayActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditSpecialDay(specialDay)}
                    >
                      <Edit3 width={16} height={16} color={COLORS.neutral[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteSpecialDay(specialDay)}
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

      {/* Fixed Add Special Day Button */}
      <TouchableOpacity
        style={styles.fixedAddButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus width={24} height={24} color={COLORS.text.inverse} />
        <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
          Özel Gün Ekle
        </Text>
      </TouchableOpacity>

      {/* Add Special Day Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setShowAddModal(false)}
        >
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>📅 Yeni Özel Gün</Text>
            
            <Text style={styles.label}>Başlık:</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Doğum Günüm"
              placeholderTextColor={COLORS.text.tertiary}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />

            <Text style={styles.label}>Tarih:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => showDatePickerModal(false)}
            >
              <Calendar width={20} height={20} color={COLORS.primary[600]} />
              <Text style={[styles.dateButtonText, TEXT_STYLES.body]}>
                {formatDate(newDate)}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Notlar (İsteğe bağlı):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Örn: Ailemle kutlayacağım"
              placeholderTextColor={COLORS.text.tertiary}
              value={newNotes}
              onChangeText={setNewNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.secondary }]}>
                  İptal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddSpecialDay}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.inverse }]}>
                  Ekle
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Edit Special Day Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setShowEditModal(false)}
        >
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>✏️ Özel Gün Düzenle</Text>
            
            <Text style={styles.label}>Başlık:</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Doğum Günüm"
              placeholderTextColor={COLORS.text.tertiary}
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
            />

            <Text style={styles.label}>Tarih:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => showDatePickerModal(true)}
            >
              <Calendar width={20} height={20} color={COLORS.primary[600]} />
              <Text style={[styles.dateButtonText, TEXT_STYLES.body]}>
                {formatDate(editDate)}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Notlar (İsteğe bağlı):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Örn: Ailemle kutlayacağım"
              placeholderTextColor={COLORS.text.tertiary}
              value={editNotes}
              onChangeText={setEditNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.secondary }]}>
                  İptal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.inverse }]}>
                  Kaydet
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker for Add Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={newDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date(2100, 11, 31)}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      {/* Date Picker for Edit Modal */}
      {showEditDatePicker && (
        <DateTimePicker
          value={editDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date(2100, 11, 31)}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

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
    paddingBottom: SPACING.xl * 2,
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
  section: {
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
  emptyStateText: {
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  specialDaysContainer: {
    gap: SPACING.sm,
  },
  specialDayCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  specialDayInfo: {
    flex: 1,
  },
  specialDayTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  specialDayDate: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  specialDayCountdown: {
    color: COLORS.primary[600],
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  specialDayNotes: {
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
  specialDayActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral[100],
  },
  fixedAddButton: {
    backgroundColor: COLORS.primary[600],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
    right: SPACING.md,
  },
  addButtonText: {
    color: COLORS.text.inverse,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    margin: SPACING.md,
    width: '90%',
    maxWidth: 400,
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dateButtonText: {
    color: COLORS.text.primary,
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
    backgroundColor: COLORS.primary[600],
  },
  modalButtonText: {
    ...TEXT_STYLES.button,
    fontWeight: '600',
  },
});

export default SpecialDaysScreen;
