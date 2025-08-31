import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { 
  Coffee, 
  Plus, 
  Minus,
  ArrowLeft,
  Home,
  Heart,
  Target,
  Settings,
  Check
} from 'react-native-feather';
import Toast from '../components/Toast';
import { useAppStore } from '../store/useAppStore';

type NutritionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Nutrition'>;

const NutritionScreen: React.FC = () => {
  const navigation = useNavigation<NutritionScreenNavigationProp>();
  
  // Zustand store'dan verileri al
  const {
    getCurrentNutritionData,
    addWater,
    removeWater,
    setWaterTarget,
    addCalories,
    toggleMeal,
  } = useAppStore();
  
  // Local state'ler
  const [calorieInput, setCalorieInput] = useState('');
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Store'dan güncel veriyi al
  const nutritionData = getCurrentNutritionData();

  // Su içme fonksiyonları
  const handleAddWater = (amount: number) => {
    addWater(amount);
    
    // Hedef tamamlandığında toast göster
    const newWaterIntake = nutritionData.waterIntake + amount;
    if (newWaterIntake >= nutritionData.waterTarget && nutritionData.waterIntake < nutritionData.waterTarget) {
      showToast('🎉 Su hedefin tamamlandı! Harika iş!', 'success');
    }
  };

  const handleRemoveWater = () => {
    removeWater(250);
  };

  // Toast gösterme fonksiyonu
  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Hedef değiştirme
  const updateWaterTarget = () => {
    const newTarget = parseInt(targetInput);
    if (!isNaN(newTarget) && newTarget > 0) {
      setWaterTarget(newTarget);
      setTargetInput('');
      setShowTargetModal(false);
      showToast('Su hedefi güncellendi!', 'success');
    }
  };

  // Öğün tamamlama
  const handleToggleMeal = (mealId: string) => {
    toggleMeal(mealId);
  };

  // Kalori ekleme
  const handleAddCalories = () => {
    const calories = parseInt(calorieInput);
    if (!isNaN(calories) && calories > 0) {
      addCalories(calories);
      setCalorieInput('');
      showToast(`${calories} kalori eklendi!`, 'success');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft width={24} height={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beslenme</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Su Takibi */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart width={24} height={24} color={COLORS.primary[500]} />
            <Text style={styles.sectionTitle}>Su Takibi</Text>
            <TouchableOpacity 
              style={styles.targetButton}
              onPress={() => setShowTargetModal(true)}
            >
              <Settings width={20} height={20} color={COLORS.primary[500]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.waterContainer}>
            <View style={styles.waterInfo}>
              <Text style={styles.waterAmount}>{nutritionData.waterIntake}ml</Text>
              <Text style={styles.waterTarget}>Hedef: {nutritionData.waterTarget}ml</Text>
            </View>
            
            <View style={styles.waterProgress}>
              <View 
                style={[
                  styles.waterProgressBar, 
                  { width: `${Math.min((nutritionData.waterIntake / nutritionData.waterTarget) * 100, 100)}%` }
                ]} 
              />
            </View>
            
            <View style={styles.waterButtons}>
              <TouchableOpacity 
                style={styles.waterButton} 
                onPress={() => handleAddWater(250)}
              >
                <Text style={styles.waterButtonText}>250ml</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.waterButton} 
                onPress={() => handleAddWater(500)}
              >
                <Text style={styles.waterButtonText}>500ml</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.waterButton} 
                onPress={() => handleAddWater(1000)}
              >
                <Text style={styles.waterButtonText}>1000ml</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.removeWaterButton}
              onPress={handleRemoveWater}
            >
              <Minus width={16} height={16} color={COLORS.error[500]} />
              <Text style={styles.removeWaterText}>250ml Çıkar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Öğün Takibi */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Coffee width={24} height={24} color={COLORS.warning[500]} />
            <Text style={styles.sectionTitle}>Günlük Öğünler</Text>
          </View>
          
          <View style={styles.mealsContainer}>
            {nutritionData.meals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                style={[
                  styles.mealItem,
                  meal.isCompleted && styles.mealItemCompleted
                ]}
                onPress={() => handleToggleMeal(meal.id)}
              >
                <View style={styles.mealInfo}>
                  <Text style={[
                    styles.mealName,
                    meal.isCompleted && styles.mealNameCompleted
                  ]}>
                    {meal.name}
                  </Text>
                </View>
                
                <View style={[
                  styles.mealCheckbox,
                  meal.isCompleted && styles.mealCheckboxCompleted
                ]}>
                  {meal.isCompleted && (
                    <Check width={16} height={16} color={COLORS.text.inverse} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Kalori Takibi */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target width={24} height={24} color={COLORS.success[500]} />
            <Text style={styles.sectionTitle}>Kalori Takibi</Text>
          </View>
          
          <View style={styles.calorieContainer}>
            <View style={styles.calorieInfo}>
              <Text style={styles.calorieAmount}>{nutritionData.dailyCalories} kcal</Text>
              <Text style={styles.calorieTarget}>Bugün</Text>
            </View>
            
            <View style={styles.calorieInputContainer}>
              <TextInput
                style={styles.calorieInput}
                placeholder="Kalori ekle..."
                value={calorieInput}
                onChangeText={setCalorieInput}
                keyboardType="numeric"
                onSubmitEditing={handleAddCalories}
              />
              <TouchableOpacity 
                style={styles.addCalorieButton}
                onPress={handleAddCalories}
              >
                <Plus width={20} height={20} color={COLORS.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Hedef Değiştirme Modal */}
      {showTargetModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Su Hedefini Değiştir</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Hedef ml girin..."
              value={targetInput}
              onChangeText={setTargetInput}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowTargetModal(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={updateWaterTarget}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  targetButton: {
    padding: SPACING.xs,
  },
  waterContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  waterInfo: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  waterAmount: {
    ...TEXT_STYLES.score,
    color: COLORS.primary[500],
    fontSize: 32,
  },
  waterTarget: {
    ...TEXT_STYLES.body,
    color: COLORS.text.secondary,
  },
  waterProgress: {
    height: 8,
    backgroundColor: COLORS.neutral[200],
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  waterProgressBar: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.sm,
  },
  waterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  waterButton: {
    backgroundColor: COLORS.primary[100],
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary[300],
    flex: 1,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterButtonText: {
    ...TEXT_STYLES.button,
    color: COLORS.primary[600],
    textAlign: 'center',
  },
  removeWaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.error[300],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.error[50],
  },
  removeWaterText: {
    ...TEXT_STYLES.button,
    color: COLORS.error[600],
    marginLeft: SPACING.xs,
  },
  mealsContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  mealItemCompleted: {
    backgroundColor: COLORS.success[50],
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    ...TEXT_STYLES.body,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  mealNameCompleted: {
    color: COLORS.success[600],
    textDecorationLine: 'line-through',
  },
  mealTime: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  mealTimeCompleted: {
    color: COLORS.success[400],
  },
  mealCheckbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCheckboxCompleted: {
    backgroundColor: COLORS.success[500],
    borderColor: COLORS.success[500],
  },
  calorieContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  calorieInfo: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  calorieAmount: {
    ...TEXT_STYLES.score,
    color: COLORS.success[500],
    fontSize: 32,
  },
  calorieTarget: {
    ...TEXT_STYLES.body,
    color: COLORS.text.secondary,
  },
  calorieInputContainer: {
    flexDirection: 'row',
  },
  calorieInput: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    marginRight: SPACING.sm,
    ...TEXT_STYLES.body,
  },
  addCalorieButton: {
    backgroundColor: COLORS.success[500],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    marginBottom: SPACING.lg,
    ...TEXT_STYLES.body,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.primary[500],
    borderColor: COLORS.primary[500],
  },
  modalButtonText: {
    ...TEXT_STYLES.button,
    color: COLORS.text.primary,
  },
  modalButtonTextPrimary: {
    color: COLORS.text.inverse,
  },
});

export default NutritionScreen; 