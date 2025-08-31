import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { ChevronDown, Calendar } from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: { title: string; description: string; category: string; priority: string; duration: string }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [duration, setDuration] = useState('daily');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'daily': return 'Günlük';
      case 'weekly': return 'Haftalık';
      case 'monthly': return 'Aylık';
      case 'yearly': return 'Yıllık';
      default: return 'Günlük';
    }
  };

  const handleAddTask = () => {
    if (title.trim() === '') {
      Alert.alert('Hata', 'Lütfen görev başlığını girin');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      duration,
    });

    setTitle('');
    setDescription('');
    setCategory('personal');
    setPriority('medium');
    setDuration('daily');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modal} 
          activeOpacity={1}
          onPress={() => {}} // Modal içine tıklandığında hiçbir şey yapma
        >
          <Text style={styles.modalTitle}>📝 Yeni Görev Ekle</Text>
          
          <Text style={styles.label}>Görev Başlığı:</Text>
          <TextInput
            style={styles.input}
            placeholder="Görev başlığı..."
            placeholderTextColor={COLORS.text.tertiary}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Text style={styles.label}>Açıklama (Opsiyonel):</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Görev hakkında detaylar, notlar..."
            placeholderTextColor={COLORS.text.tertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Kategori:</Text>
          <View style={styles.categoryButtons}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: COLORS.primary[100] },
                category === 'personal' && { backgroundColor: COLORS.primary[500] }
              ]}
              onPress={() => setCategory('personal')}
            >
              <Text style={[
                styles.categoryButtonText,
                category === 'personal' && { color: COLORS.text.inverse }
              ]}>Kişisel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: COLORS.status.warning + '20' },
                category === 'work' && { backgroundColor: COLORS.status.warning }
              ]}
              onPress={() => setCategory('work')}
            >
              <Text style={[
                styles.categoryButtonText,
                category === 'work' && { color: COLORS.text.inverse }
              ]}>İş</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: COLORS.status.info + '20' },
                category === 'school' && { backgroundColor: COLORS.status.info }
              ]}
              onPress={() => setCategory('school')}
            >
              <Text style={[
                styles.categoryButtonText,
                category === 'school' && { color: COLORS.text.inverse }
              ]}>Okul</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Öncelik:</Text>
          <View style={styles.priorityButtons}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                { backgroundColor: COLORS.status.success + '20' },
                priority === 'low' && { backgroundColor: COLORS.status.success }
              ]}
              onPress={() => setPriority('low')}
            >
              <Text style={[
                styles.priorityButtonText,
                priority === 'low' && { color: COLORS.text.inverse }
              ]}>Düşük</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                { backgroundColor: COLORS.status.warning + '20' },
                priority === 'medium' && { backgroundColor: COLORS.status.warning }
              ]}
              onPress={() => setPriority('medium')}
            >
              <Text style={[
                styles.priorityButtonText,
                priority === 'medium' && { color: COLORS.text.inverse }
              ]}>Orta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                { backgroundColor: COLORS.status.error + '20' },
                priority === 'high' && { backgroundColor: COLORS.status.error }
              ]}
              onPress={() => setPriority('high')}
            >
              <Text style={[
                styles.priorityButtonText,
                priority === 'high' && { color: COLORS.text.inverse }
              ]}>Yüksek</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Süre:</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDurationDropdown(!showDurationDropdown)}
          >
            <View style={styles.dropdownContent}>
              <Calendar width={20} height={20} color={COLORS.text.secondary} />
              <Text style={styles.dropdownText}>{getDurationLabel(duration)}</Text>
            </View>
            <ChevronDown 
              width={20} height={20} 
              color={COLORS.text.secondary}
              style={[
                styles.dropdownIcon,
                showDurationDropdown && styles.dropdownIconRotated
              ]}
            />
          </TouchableOpacity>

          {showDurationDropdown && (
            <View style={styles.dropdownMenu}>
              {[
                { key: 'daily', label: 'Günlük' },
                { key: 'weekly', label: 'Haftalık' },
                { key: 'monthly', label: 'Aylık' },
                { key: 'yearly', label: 'Yıllık' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.dropdownItem,
                    duration === item.key && styles.dropdownItemSelected
                  ]}
                  onPress={() => {
                    setDuration(item.key);
                    setShowDurationDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    duration === item.key && styles.dropdownItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Text style={styles.addButtonText}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
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
    marginBottom: SPACING.md,
    height: 80,
    backgroundColor: COLORS.background.primary,
  },
  categoryButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  categoryButton: {
    flex: 1,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  categoryButtonText: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  priorityButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  priorityButton: {
    flex: 1,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  priorityButtonText: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonRow: {
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
    ...TEXT_STYLES.button,
    color: COLORS.text.secondary,
  },
  addButton: {
    flex: 1,
    padding: SPACING.md,
    marginLeft: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
  },
  addButtonText: {
    ...TEXT_STYLES.button,
    color: COLORS.text.inverse,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    ...TEXT_STYLES.body,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  dropdownIcon: {
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.primary,
    marginTop: -SPACING.md,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.primary[100],
  },
  dropdownItemText: {
    ...TEXT_STYLES.body,
    color: COLORS.text.primary,
  },
  dropdownItemTextSelected: {
    color: COLORS.primary[500],
    fontWeight: '600',
  },
});

export default AddTaskModal; 