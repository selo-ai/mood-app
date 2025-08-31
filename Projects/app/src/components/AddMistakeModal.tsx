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
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { HelpCircle } from 'react-native-feather';
import Slider from '@react-native-community/slider';

interface AddMistakeModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMistake: (mistake: { type: string; description: string; severity: number }) => void;
}

const AddMistakeModal: React.FC<AddMistakeModalProps> = ({ visible, onClose, onAddMistake }) => {
  const [type, setType] = useState('forgetfulness');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(3); // Default 3 puan
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfoType, setSelectedInfoType] = useState('');

  const handleAddMistake = () => {
    if (description.trim() === '') {
      Alert.alert('Hata', 'Lütfen hata açıklamasını girin');
      return;
    }

    onAddMistake({
      type,
      description: description.trim(),
      severity,
    });

    setDescription('');
    setType('forgetfulness');
    setSeverity(3);
    onClose();
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

  const getMistakeTypeInfo = (type: string) => {
    switch (type) {
      case 'forgetfulness':
        return {
          title: 'Unutkanlık',
          description: 'Hatırlanması gereken şeyleri unutma durumu.',
          examples: [
            'Önemli randevuları unutma',
            'Eşyaları nereye koyduğunu hatırlamama',
            'Yapılacaklar listesini unutma',
            'İlaç almayı unutma'
          ]
        };
      case 'distraction':
        return {
          title: 'Dikkat Dağınıklığı',
          description: 'Odaklanmaya çalışırken başka şeylere yönelme.',
          examples: [
            'Çalışırken telefonla oyalanma',
            'Konuşurken başka şeyler düşünme',
            'Okurken satırları atlama',
            'Ders çalışırken hayal kurma'
          ]
        };
      case 'impulsivity':
        return {
          title: 'Dürtü',
          description: 'Düşünmeden, anında hareket etme eğilimi.',
          examples: [
            'Söz kesme',
            'Acele karar verme',
            'Anlık alışveriş yapma',
            'Risk alma davranışları'
          ]
        };
      case 'other':
        return {
          title: 'Diğer',
          description: 'Yukarıdaki kategorilere girmeyen hatalar.',
          examples: [
            'Organizasyon sorunları',
            'Zaman yönetimi hataları',
            'Sosyal beceri eksiklikleri',
            'Duygu düzenleme zorlukları'
          ]
        };
      default:
        return {
          title: 'Unutkanlık',
          description: 'Hatırlanması gereken şeyleri unutma durumu.',
          examples: [
            'Önemli randevuları unutma',
            'Eşyaları nereye koyduğunu hatırlamama',
            'Yapılacaklar listesini unutma',
            'İlaç almayı unutma'
          ]
        };
    }
  };

  const handleInfoPress = (infoType: string) => {
    setSelectedInfoType(infoType);
    setShowInfoModal(true);
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
          <Text style={styles.modalTitle}>❌ Hata Kaydet</Text>
          
          <Text style={styles.label}>Hata Türü:</Text>
          <View style={styles.typeButtons}>
            <View style={styles.typeButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { backgroundColor: COLORS.status.error + '20' },
                  type === 'forgetfulness' && { backgroundColor: COLORS.status.error }
                ]}
                onPress={() => setType('forgetfulness')}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'forgetfulness' && { color: COLORS.text.inverse }
                ]}>Unutkanlık</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleInfoPress('forgetfulness')}
              >
                <HelpCircle width={16} height={16} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.typeButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { backgroundColor: COLORS.status.warning + '20' },
                  type === 'distraction' && { backgroundColor: COLORS.status.warning }
                ]}
                onPress={() => setType('distraction')}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'distraction' && { color: COLORS.text.inverse }
                ]}>Dikkat Dağınıklığı</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleInfoPress('distraction')}
              >
                <HelpCircle width={16} height={16} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.typeButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { backgroundColor: COLORS.status.info + '20' },
                  type === 'impulsivity' && { backgroundColor: COLORS.status.info }
                ]}
                onPress={() => setType('impulsivity')}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'impulsivity' && { color: COLORS.text.inverse }
                ]}>Dürtü</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleInfoPress('impulsivity')}
              >
                <HelpCircle width={16} height={16} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.typeButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { backgroundColor: COLORS.neutral[200] },
                  type === 'other' && { backgroundColor: COLORS.neutral[600] }
                ]}
                onPress={() => setType('other')}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'other' && { color: COLORS.text.inverse }
                ]}>Diğer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleInfoPress('other')}
              >
                <HelpCircle width={16} height={16} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Açıklama:</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ne oldu? Hata hakkında kısa bir açıklama..."
            placeholderTextColor={COLORS.text.tertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Hata Puanı: {severity}/5</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={severity}
              onValueChange={setSeverity}
              minimumTrackTintColor={COLORS.status.error}
              maximumTrackTintColor={COLORS.neutral[300]}
              thumbStyle={styles.sliderThumb}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Hafif</Text>
              <Text style={styles.sliderLabel}>Ağır</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddMistake}>
              <Text style={styles.addButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bilgilendirme Modalı */}
      <Modal
        visible={showInfoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.infoModal}>
            <Text style={styles.infoModalTitle}>
              {getMistakeTypeInfo(selectedInfoType).title}
            </Text>
            
            <Text style={styles.infoDescription}>
              {getMistakeTypeInfo(selectedInfoType).description}
            </Text>
            
            <Text style={styles.infoExamplesTitle}>Örnekler:</Text>
            {getMistakeTypeInfo(selectedInfoType).examples.map((example, index) => (
              <Text key={index} style={styles.infoExample}>
                • {example}
              </Text>
            ))}
            
            <TouchableOpacity 
              style={styles.infoCloseButton} 
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.infoCloseButtonText}>Anladım</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  typeButtonContainer: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  typeButton: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  infoButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtonText: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TEXT_STYLES.body,
    marginBottom: SPACING.xl,
    height: 100,
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
    backgroundColor: COLORS.status.error,
    alignItems: 'center',
  },
  addButtonText: {
    ...TEXT_STYLES.button,
    color: COLORS.text.inverse,
  },
  // Bilgilendirme Modal Stilleri
  infoModal: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  infoModalTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  infoDescription: {
    ...TEXT_STYLES.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  infoExamplesTitle: {
    ...TEXT_STYLES.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  infoExample: {
    ...TEXT_STYLES.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
  },
  infoCloseButton: {
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  infoCloseButtonText: {
    ...TEXT_STYLES.button,
    color: COLORS.text.inverse,
  },
  // Slider Stilleri
  sliderContainer: {
    marginBottom: SPACING.xl,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: COLORS.status.error,
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  sliderLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.secondary,
  },
});

export default AddMistakeModal; 