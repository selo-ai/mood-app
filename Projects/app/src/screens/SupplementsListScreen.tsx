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

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  time: 'morning' | 'noon' | 'evening';
  notes: string;
  createdAt: Date;
}

type SupplementsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SupplementsList'>;

const SupplementsListScreen: React.FC = () => {
  const navigation = useNavigation<SupplementsListScreenNavigationProp>();
  const { supplements, addSupplement, updateSupplement, deleteSupplement } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: 'morning' as 'morning' | 'noon' | 'evening',
    notes: '',
  });

  const handleAddSupplement = () => {
    if (!formData.name.trim() || !formData.dosage.trim()) {
      setToastMessage('Lütfen takviye adı ve dozaj girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const newSupplement: Supplement = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };

    addSupplement(newSupplement);
    setFormData({ name: '', dosage: '', time: 'morning', notes: '' });
    setShowAddModal(false);
    setToastMessage('Takviye başarıyla eklendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleEditSupplement = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setFormData({
      name: supplement.name,
      dosage: supplement.dosage,
      time: supplement.time,
      notes: supplement.notes,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedSupplement || !formData.name.trim() || !formData.dosage.trim()) {
      setToastMessage('Lütfen takviye adı ve dozaj girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    updateSupplement(selectedSupplement.id, {
      name: formData.name.trim(),
      dosage: formData.dosage.trim(),
      time: formData.time,
      notes: formData.notes.trim() || undefined,
    });

    setFormData({ name: '', dosage: '', time: 'morning', notes: '' });
    setShowEditModal(false);
    setSelectedSupplement(null);
    setToastMessage('Takviye başarıyla güncellendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteSupplement = (supplement: Supplement) => {
    Alert.alert(
      'Takviyeyi Sil',
      `"${supplement.name}" takviyesini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteSupplement(supplement.id);
            setToastMessage('Takviye başarıyla silindi!');
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
            <Heart width={32} height={32} color={COLORS.status.success} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>TAKVİYELERİM</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Supplements List */}
        {supplements.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Heart width={64} height={64} color={COLORS.neutral[400]} />
            </View>
            <Text style={[styles.emptyTitle, TEXT_STYLES.h3]}>
              Henüz Takviye Eklenmemiş
            </Text>
            <Text style={[styles.emptyText, TEXT_STYLES.body]}>
              İlk takviyeni ekleyerek başla
            </Text>
          </View>
        ) : (
          <View style={styles.supplementsList}>
            {supplements.map((supplement) => (
              <View key={supplement.id} style={styles.supplementCard}>
                <View style={styles.supplementHeader}>
                  <Text style={[styles.supplementName, TEXT_STYLES.body]}>
                    {supplement.name}
                  </Text>
                  <View style={[
                    styles.timeTag,
                    { backgroundColor: getTimeColor(supplement.time) + '20' }
                  ]}>
                    <Text style={[
                      styles.timeText,
                      TEXT_STYLES.caption,
                      { color: getTimeColor(supplement.time) }
                    ]}>
                      {getTimeLabel(supplement.time)}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.dosageText, TEXT_STYLES.body]}>
                  Dozaj: {supplement.dosage}
                </Text>
                
                {supplement.notes && (
                  <Text style={[styles.notesText, TEXT_STYLES.caption]}>
                    Not: {supplement.notes}
                  </Text>
                )}

                <View style={styles.supplementActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditSupplement(supplement)}
                  >
                    <Edit3 width={16} height={16} color={COLORS.neutral[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteSupplement(supplement)}
                  >
                    <Trash2 width={16} height={16} color={COLORS.status.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Supplement Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus width={24} height={24} color={COLORS.text.inverse} />
        <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
          Takviye Ekle
        </Text>
      </TouchableOpacity>

      {/* Add Supplement Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              Yeni Takviye Ekle
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Takviye Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Vitamin, mineral, omega-3..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Dozaj:</Text>
            <TextInput
              style={styles.input}
              placeholder="1 kapsül, 1 tablet, 1 kaşık..."
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
                onPress={handleAddSupplement}
              >
                <Text style={[styles.saveButtonText, TEXT_STYLES.button]}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Supplement Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              Takviyeyi Düzenle
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Takviye Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Takviye adı..."
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
  supplementsList: {
    gap: SPACING.sm,
  },
  supplementCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  supplementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  supplementName: {
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
  supplementActions: {
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
    backgroundColor: COLORS.status.success,
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
    backgroundColor: COLORS.status.success,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text.inverse,
  },
});

export default SupplementsListScreen; 