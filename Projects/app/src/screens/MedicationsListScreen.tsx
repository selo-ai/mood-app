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
  Heart, 
  Plus, 
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Calendar as CalendarIcon,
  Edit3,
  Trash2
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: 'morning' | 'noon' | 'evening';
  notes: string;
  createdAt: Date;
}

type MedicationsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MedicationsList'>;

const MedicationsListScreen: React.FC = () => {
  const navigation = useNavigation<MedicationsListScreenNavigationProp>();
  const { medications, addMedication, updateMedication, deleteMedication } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: 'morning' as 'morning' | 'noon' | 'evening',
    notes: '',
  });

  const handleAddMedication = () => {
    if (!formData.name.trim() || !formData.dosage.trim()) {
      setToastMessage('Lütfen ilaç adı ve dozaj girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const newMedication: Medication = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };

    addMedication(newMedication);
    setFormData({ name: '', dosage: '', time: 'morning', notes: '' });
    setShowAddModal(false);
    setToastMessage('İlaç başarıyla eklendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      time: medication.time,
      notes: medication.notes,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedMedication || !formData.name.trim() || !formData.dosage.trim()) {
      setToastMessage('Lütfen ilaç adı ve dozaj girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    updateMedication(selectedMedication.id, {
      name: formData.name.trim(),
      dosage: formData.dosage.trim(),
      time: formData.time,
      notes: formData.notes.trim() || undefined,
    });

    setFormData({ name: '', dosage: '', time: 'morning', notes: '' });
    setShowEditModal(false);
    setSelectedMedication(null);
    setToastMessage('İlaç başarıyla güncellendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteMedication = (medication: Medication) => {
    Alert.alert(
      'İlacı Sil',
      `"${medication.name}" ilacını silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteMedication(medication.id);
            setToastMessage('İlaç başarıyla silindi!');
            setToastType('success');
            setShowToast(true);
          },
        },
      ]
    );
  };

  const getTimeLabel = (time: string) => {
    switch (time) {
      case 'morning': return 'Sabah';
      case 'noon': return 'Öğlen';
      case 'evening': return 'Akşam';
      default: return 'Sabah';
    }
  };

  const getTimeColor = (time: string) => {
    switch (time) {
      case 'morning': return COLORS.status.warning;
      case 'noon': return COLORS.status.info;
      case 'evening': return COLORS.status.error;
      default: return COLORS.status.warning;
    }
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
            <Heart width={32} height={32} color={COLORS.status.error} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>İLAÇLARIM</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Medications List */}
        {medications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Heart width={64} height={64} color={COLORS.neutral[400]} />
            </View>
            <Text style={[styles.emptyTitle, TEXT_STYLES.h3]}>
              Henüz İlaç Eklenmemiş
            </Text>
            <Text style={[styles.emptyText, TEXT_STYLES.body]}>
              İlk ilacını ekleyerek başla
            </Text>
          </View>
        ) : (
          <View style={styles.medicationsList}>
            {medications.map((medication) => (
              <View key={medication.id} style={styles.medicationCard}>
                <View style={styles.medicationHeader}>
                  <Text style={[styles.medicationName, TEXT_STYLES.body]}>
                    {medication.name}
                  </Text>
                  <View style={[
                    styles.timeTag,
                    { backgroundColor: getTimeColor(medication.time) + '20' }
                  ]}>
                    <Text style={[
                      styles.timeText,
                      TEXT_STYLES.caption,
                      { color: getTimeColor(medication.time) }
                    ]}>
                      {getTimeLabel(medication.time)}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.dosageText, TEXT_STYLES.body]}>
                  Dozaj: {medication.dosage}
                </Text>
                
                {medication.notes && (
                  <Text style={[styles.notesText, TEXT_STYLES.caption]}>
                    Not: {medication.notes}
                  </Text>
                )}

                <View style={styles.medicationActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditMedication(medication)}
                  >
                    <Edit3 width={16} height={16} color={COLORS.neutral[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteMedication(medication)}
                  >
                    <Trash2 width={16} height={16} color={COLORS.status.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Medication Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus width={24} height={24} color={COLORS.text.inverse} />
        <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
          İlaç Ekle
        </Text>
      </TouchableOpacity>

      {/* Add Medication Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              Yeni İlaç Ekle
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>İlaç Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="İlaç adı..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Dozaj:</Text>
            <TextInput
              style={styles.input}
              placeholder="1 tablet, 1 kapsül, 5ml..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.dosage}
              onChangeText={(text) => setFormData({ ...formData, dosage: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Alınma Zamanı:</Text>
            <View style={styles.timeButtons}>
              {[
                { key: 'morning', label: 'Sabah' },
                { key: 'noon', label: 'Öğlen' },
                { key: 'evening', label: 'Akşam' }
              ].map((time) => (
                <TouchableOpacity
                  key={time.key}
                  style={[
                    styles.timeButton,
                    { backgroundColor: getTimeColor(time.key) + '20' },
                    formData.time === time.key && { backgroundColor: getTimeColor(time.key) }
                  ]}
                  onPress={() => setFormData({ ...formData, time: time.key as any })}
                >
                  <Text style={[
                    styles.timeButtonText,
                    TEXT_STYLES.caption,
                    formData.time === time.key && { color: COLORS.text.inverse }
                  ]}>
                    {time.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, TEXT_STYLES.body]}>Notlar (Opsiyonel):</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Özel notlar, yan etkiler, aç/tok karnına..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.cancelButtonText, TEXT_STYLES.button]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleAddMedication}
              >
                <Text style={[styles.saveButtonText, TEXT_STYLES.button]}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Medication Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              İlacı Düzenle
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>İlaç Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="İlaç adı..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Dozaj:</Text>
            <TextInput
              style={styles.input}
              placeholder="1 tablet, 1 kapsül, 5ml..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.dosage}
              onChangeText={(text) => setFormData({ ...formData, dosage: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Alınma Zamanı:</Text>
            <View style={styles.timeButtons}>
              {[
                { key: 'morning', label: 'Sabah' },
                { key: 'noon', label: 'Öğlen' },
                { key: 'evening', label: 'Akşam' }
              ].map((time) => (
                <TouchableOpacity
                  key={time.key}
                  style={[
                    styles.timeButton,
                    { backgroundColor: getTimeColor(time.key) + '20' },
                    formData.time === time.key && { backgroundColor: getTimeColor(time.key) }
                  ]}
                  onPress={() => setFormData({ ...formData, time: time.key as any })}
                >
                  <Text style={[
                    styles.timeButtonText,
                    TEXT_STYLES.caption,
                    formData.time === time.key && { color: COLORS.text.inverse }
                  ]}>
                    {time.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, TEXT_STYLES.body]}>Notlar (Opsiyonel):</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Özel notlar, yan etkiler, aç/tok karnına..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.cancelButtonText, TEXT_STYLES.button]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveEdit}
              >
                <Text style={[styles.saveButtonText, TEXT_STYLES.button]}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
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
  medicationsList: {
    gap: SPACING.sm,
  },
  medicationCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  medicationName: {
    color: COLORS.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  timeTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  timeText: {
    fontWeight: '600',
  },
  dosageText: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  notesText: {
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
  medicationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral[100],
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  label: {
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TEXT_STYLES.body,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background.primary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TEXT_STYLES.body,
    marginBottom: SPACING.lg,
    height: 80,
    backgroundColor: COLORS.background.primary,
  },
  timeButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  timeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  timeButtonText: {
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral[200],
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
  },
  saveButton: {
    flex: 1,
    padding: SPACING.md,
    marginLeft: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.status.error,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text.inverse,
  },
});

export default MedicationsListScreen; 