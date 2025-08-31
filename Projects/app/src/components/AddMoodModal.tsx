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
import Slider from '@react-native-community/slider';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';

interface AddMoodModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMood: (mood: { score: number; note: string }) => void;
}

const AddMoodModal: React.FC<AddMoodModalProps> = ({ visible, onClose, onAddMood }) => {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');

  const handleAddMood = () => {
    onAddMood({
      score,
      note: note.trim(),
    });

    setScore(5);
    setNote('');
    onClose();
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 9) return '😄';
    if (score >= 7) return '🙂';
    if (score >= 5) return '😐';
    if (score >= 3) return '😔';
    return '😢';
  };

  const getMoodLabel = (score: number) => {
    if (score >= 9) return 'Mükemmel';
    if (score >= 7) return 'İyi';
    if (score >= 5) return 'Orta';
    if (score >= 3) return 'Kötü';
    return 'Çok Kötü';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>😊 Mood Gir</Text>
          
          <Text style={styles.label}>Bugünkü Ruh Halin:</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreEmoji}>{getMoodEmoji(score)}</Text>
            <Text style={styles.scoreValue}>{score}/10</Text>
            <Text style={styles.scoreLabel}>{getMoodLabel(score)}</Text>
          </View>

          <Text style={styles.label}>Puan Seç:</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={score}
              onValueChange={setScore}
              minimumTrackTintColor={COLORS.primary[500]}
              maximumTrackTintColor={COLORS.neutral[300]}
              thumbStyle={styles.sliderThumb}
              trackStyle={styles.sliderTrack}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0</Text>
              <Text style={styles.sliderLabel}>5</Text>
              <Text style={styles.sliderLabel}>10</Text>
            </View>
          </View>

          <Text style={styles.label}>Not (Opsiyonel):</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Bugün nasıl hissediyorsun? Neden böyle hissediyorsun?"
            placeholderTextColor={COLORS.text.tertiary}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddMood}>
              <Text style={styles.addButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  scoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  scoreEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  scoreValue: {
    ...TEXT_STYLES.h2,
    color: COLORS.primary[500],
    marginBottom: SPACING.xs,
  },
  scoreLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.text.secondary,
  },
  sliderContainer: {
    marginBottom: SPACING.lg,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: COLORS.primary[500],
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  sliderLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.secondary,
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
    backgroundColor: COLORS.status.success,
    alignItems: 'center',
  },
  addButtonText: {
    ...TEXT_STYLES.button,
    color: COLORS.text.inverse,
  },
});

export default AddMoodModal; 