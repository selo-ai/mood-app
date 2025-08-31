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
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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

interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  notes: string;
  createdAt: Date;
}

type AppointmentsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AppointmentsList'>;

const AppointmentsListScreen: React.FC = () => {
  const navigation = useNavigation<AppointmentsListScreenNavigationProp>();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editSelectedDate, setEditSelectedDate] = useState(new Date());
  const [editSelectedTime, setEditSelectedTime] = useState(new Date());
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleAddAppointment = () => {
    if (!formData.doctorName.trim() || !formData.date.trim() || !formData.time.trim()) {
      setToastMessage('Lütfen doktor adı, tarih ve saat girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const newAppointment: DoctorAppointment = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };

    addAppointment(newAppointment);
    setFormData({ doctorName: '', specialty: '', date: '', time: '', notes: '' });
    setShowAddModal(false);
    setToastMessage('Randevu başarıyla eklendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleEditAppointment = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    
    // Parse date and time from appointment
    const appointmentDate = new Date();
    const appointmentTime = new Date();
    
    try {
      // Try to parse the date string (assuming format like "01.01.2024")
      const [day, month, year] = appointment.date.split('.');
      if (day && month && year) {
        appointmentDate.setDate(parseInt(day));
        appointmentDate.setMonth(parseInt(month) - 1);
        appointmentDate.setFullYear(parseInt(year));
      }
      
      // Try to parse the time string (assuming format like "14:30")
      const [hour, minute] = appointment.time.split(':');
      if (hour && minute) {
        appointmentTime.setHours(parseInt(hour));
        appointmentTime.setMinutes(parseInt(minute));
      }
    } catch (error) {
      console.log('Error parsing date/time:', error);
    }
    
    setEditSelectedDate(appointmentDate);
    setEditSelectedTime(appointmentTime);
    
    setFormData({
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedAppointment || !formData.doctorName.trim() || !formData.date.trim() || !formData.time.trim()) {
      setToastMessage('Lütfen doktor adı, tarih ve saat girin');
      setToastType('error');
      setShowToast(true);
      return;
    }

    updateAppointment(selectedAppointment.id, {
      doctorName: formData.doctorName.trim(),
      specialty: formData.specialty.trim(),
      date: formData.date.trim(),
      time: formData.time.trim(),
      notes: formData.notes.trim() || undefined,
    });

    setFormData({ doctorName: '', specialty: '', date: '', time: '', notes: '' });
    setShowEditModal(false);
    setSelectedAppointment(null);
    setToastMessage('Randevu başarıyla güncellendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteAppointment = (appointment: DoctorAppointment) => {
    Alert.alert(
      'Randevuyu Sil',
      `"${appointment.doctorName}" randevusunu silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteAppointment(appointment.id);
            setToastMessage('Randevu başarıyla silindi!');
            setToastType('success');
            setShowToast(true);
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
      setShowEditDatePicker(false);
      setShowEditTimePicker(false);
    }

    if (selectedDate) {
      if (isEditingDate) {
        setEditSelectedDate(selectedDate);
        setFormData({ ...formData, date: formatDate(selectedDate) });
      } else {
        setSelectedDate(selectedDate);
        setFormData({ ...formData, date: formatDate(selectedDate) });
      }
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
      setShowEditDatePicker(false);
      setShowEditTimePicker(false);
    }

    if (selectedTime) {
      if (isEditingTime) {
        setEditSelectedTime(selectedTime);
        setFormData({ ...formData, time: formatTime(selectedTime) });
      } else {
        setSelectedTime(selectedTime);
        setFormData({ ...formData, time: formatTime(selectedTime) });
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

  const showTimePickerModal = (isEdit: boolean = false) => {
    setIsEditingTime(isEdit);
    if (Platform.OS === 'ios') {
      if (isEdit) {
        setShowEditTimePicker(true);
      } else {
        setShowTimePicker(true);
      }
    } else {
      if (isEdit) {
        setShowEditTimePicker(true);
      } else {
        setShowTimePicker(true);
      }
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
            <CalendarIcon width={32} height={32} color={COLORS.status.info} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>DOKTOR RANDEVULARIM</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <CalendarIcon width={64} height={64} color={COLORS.neutral[400]} />
            </View>
            <Text style={[styles.emptyTitle, TEXT_STYLES.h3]}>
              Henüz Randevu Eklenmemiş
            </Text>
            <Text style={[styles.emptyText, TEXT_STYLES.body]}>
              İlk doktor randevunu ekleyerek başla
            </Text>
          </View>
        ) : (
          <View style={styles.appointmentsList}>
            {appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={[styles.doctorName, TEXT_STYLES.body]}>
                    Dr. {appointment.doctorName}
                  </Text>
                  <View style={[styles.dateTag, { backgroundColor: COLORS.status.info + '20' }]}>
                    <Text style={[styles.dateText, TEXT_STYLES.caption, { color: COLORS.status.info }]}>
                      {appointment.date}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.specialtyText, TEXT_STYLES.body]}>
                  {appointment.specialty}
                </Text>
                
                <Text style={[styles.timeText, TEXT_STYLES.body]}>
                  Saat: {appointment.time}
                </Text>
                
                {appointment.notes && (
                  <Text style={[styles.notesText, TEXT_STYLES.caption]}>
                    Not: {appointment.notes}
                  </Text>
                )}

                <View style={styles.appointmentActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditAppointment(appointment)}
                  >
                    <Edit3 width={16} height={16} color={COLORS.neutral[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteAppointment(appointment)}
                  >
                    <Trash2 width={16} height={16} color={COLORS.status.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Appointment Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus width={24} height={24} color={COLORS.text.inverse} />
        <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
          Randevu Ekle
        </Text>
      </TouchableOpacity>

      {/* Add Appointment Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              Yeni Doktor Randevusu Ekle
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Doktor Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Dr. Ad Soyad..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.doctorName}
              onChangeText={(text) => setFormData({ ...formData, doctorName: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Uzmanlık Alanı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Kardiyoloji, Nöroloji, Psikiyatri..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.specialty}
              onChangeText={(text) => setFormData({ ...formData, specialty: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Tarih:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => showDatePickerModal(false)}
            >
              <Calendar width={20} height={20} color={COLORS.primary[600]} />
              <Text style={[styles.pickerButtonText, TEXT_STYLES.body]}>
                {formData.date || 'Tarih seçin'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, TEXT_STYLES.body]}>Saat:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => showTimePickerModal(false)}
            >
              <Clock width={20} height={20} color={COLORS.primary[600]} />
              <Text style={[styles.pickerButtonText, TEXT_STYLES.body]}>
                {formData.time || 'Saat seçin'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, TEXT_STYLES.body]}>Notlar (Opsiyonel):</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Randevu notları, hazırlanacak belgeler..."
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
                onPress={handleAddAppointment}
              >
                <Text style={[styles.saveButtonText, TEXT_STYLES.button]}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              Randevuyu Düzenle
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Doktor Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Dr. Ad Soyad..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.doctorName}
              onChangeText={(text) => setFormData({ ...formData, doctorName: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Uzmanlık Alanı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Kardiyoloji, Nöroloji, Psikiyatri..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.specialty}
              onChangeText={(text) => setFormData({ ...formData, specialty: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Tarih:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => showDatePickerModal(true)}
            >
              <Calendar width={20} height={20} color={COLORS.primary[600]} />
              <Text style={[styles.pickerButtonText, TEXT_STYLES.body]}>
                {formData.date || 'Tarih seçin'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, TEXT_STYLES.body]}>Saat:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => showTimePickerModal(true)}
            >
              <Clock width={20} height={20} color={COLORS.primary[600]} />
              <Text style={[styles.pickerButtonText, TEXT_STYLES.body]}>
                {formData.time || 'Saat seçin'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, TEXT_STYLES.body]}>Notlar (Opsiyonel):</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Özel notlar, şikayetler, sorular..."
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

      {/* Date Picker for Add Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date(2100, 11, 31)}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      {/* Time Picker for Add Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      {/* Date Picker for Edit Modal */}
      {showEditDatePicker && (
        <DateTimePicker
          value={editSelectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date(2100, 11, 31)}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      {/* Time Picker for Edit Modal */}
      {showEditTimePicker && (
        <DateTimePicker
          value={editSelectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
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
  appointmentsList: {
    gap: SPACING.sm,
  },
  appointmentCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  doctorName: {
    color: COLORS.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  dateTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  specialtyText: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  timeText: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  notesText: {
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
  appointmentActions: {
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
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background.primary,
    gap: SPACING.sm,
  },
  pickerButtonText: {
    color: COLORS.text.primary,
    flex: 1,
  },
  addButton: {
    backgroundColor: COLORS.status.info,
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
    backgroundColor: COLORS.status.info,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text.inverse,
  },
});

export default AppointmentsListScreen; 