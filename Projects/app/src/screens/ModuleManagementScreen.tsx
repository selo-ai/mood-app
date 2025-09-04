import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  ArrowLeft, 
  Settings,
  Info,
  CheckCircle, 
  XCircle,
  Clock,
  RefreshCw
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';
import { Module } from '../types';
import { DEFAULT_MODULES } from '../constants/modules';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ModuleManagementScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModuleManagement'>;

const ModuleManagementScreen: React.FC = () => {
  const navigation = useNavigation<ModuleManagementScreenNavigationProp>();
  const { 
    modules, 
    moduleSettings, 
    toggleModule, 
    getEnabledModules, 
    getAvailableModules 
  } = useAppStore();
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [availableModules, setAvailableModules] = useState<Module[]>([]);

  useEffect(() => {
    // İlk yüklemede default modülleri ayarla
    if (modules.length === 0) {
      const defaultModules = DEFAULT_MODULES.map(module => ({
        ...module,
        isEnabled: module.isDefault
      }));
      
      // Store'u güncelle (bu kısım store'da yapılacak)
      setAvailableModules(defaultModules);
    } else {
      setAvailableModules(getAvailableModules());
    }
  }, [modules]);

  const handleToggleModule = (moduleId: string) => {
    const module = availableModules.find(m => m.id === moduleId);
    if (!module) return;

    // En az 1 modül aktif olmalı kontrolü
    const enabledModules = getEnabledModules();
    if (module.isEnabled && enabledModules.length <= 1) {
      setToastMessage('En az 1 modül aktif olmalıdır!');
      setToastType('error');
      setShowToast(true);
      return;
    }

    toggleModule(moduleId);
    setToastMessage(`${module.displayName} ${module.isEnabled ? 'kapatıldı' : 'açıldı'}!`);
    setToastType('success');
    setShowToast(true);
  };

  const handleResetModules = async () => {
    Alert.alert(
      'Modülleri Sıfırla',
      'Tüm modül ayarları sıfırlanacak. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            try {
              // AsyncStorage'ı temizle
              await AsyncStorage.removeItem('my-mood-storage');
              
              // Uygulamayı yeniden başlat
              Alert.alert(
                'Tamamlandı',
                'Modüller sıfırlandı. Lütfen uygulamayı kapatıp yeniden açın.',
                [{ text: 'Tamam' }]
              );
            } catch (error) {
              console.error('Reset error:', error);
            }
          }
        }
      ]
    );
  };

  const getIconComponent = (iconName: string) => {
    // Bu kısım daha sonra dinamik icon yönetimi için geliştirilebilir
    switch (iconName) {
      case 'Home': return <Settings width={24} height={24} />;
      case 'List': return <Settings width={24} height={24} />;
      case 'AlertTriangle': return <Settings width={24} height={24} />;
      case 'Heart': return <Settings width={24} height={24} />;
      case 'FileText': return <Settings width={24} height={24} />;
      case 'Coffee': return <Settings width={24} height={24} />;
      case 'BookOpen': return <Settings width={24} height={24} />;
      case 'Moon': return <Settings width={24} height={24} />;
      case 'ShoppingBag': return <Settings width={24} height={24} />;
      case 'Calendar': return <Settings width={24} height={24} />;
      case 'Clock': return <Clock width={24} height={24} />;
      default: return <Settings width={24} height={24} />;
    }
  };

  const defaultModules = availableModules.filter(module => module.isDefault);
  const optionalModules = availableModules.filter(module => !module.isDefault);
  
  // Debug için console.log
  console.log('Available Modules:', availableModules);
  console.log('Default Modules:', defaultModules);
  console.log('Optional Modules:', optionalModules);
  console.log('Store Modules:', modules);
  console.log('DEFAULT_MODULES:', DEFAULT_MODULES);

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
            <Settings width={32} height={32} color={COLORS.primary[500]} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>MODÜL YÖNETİMİ</Text>
          <Text style={[styles.headerSubtitle, TEXT_STYLES.body]}>
            Hangi modülleri kullanmak istediğinizi seçin
          </Text>
        </View>

        {/* Default Modules Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>
            Varsayılan Modüller
          </Text>
          <Text style={[styles.sectionDescription, TEXT_STYLES.body]}>
            Bu modüller uygulamanın temel özellikleridir
          </Text>
          
          <View style={styles.modulesList}>
            {defaultModules.map((module) => (
              <View key={module.id} style={styles.moduleCard}>
                <View style={styles.moduleInfo}>
                  <View style={[
                    styles.moduleIconContainer,
                    { backgroundColor: module.color + '20' }
                  ]}>
                    {getIconComponent(module.icon)}
                  </View>
                  <View style={styles.moduleDetails}>
                    <Text style={[styles.moduleName, TEXT_STYLES.body]}>
                      {module.displayName}
                    </Text>
                    <Text style={[styles.moduleDescription, TEXT_STYLES.caption]}>
                      {module.description}
                    </Text>
                    {module.isDefault && (
                      <View style={styles.defaultBadge}>
                        <CheckCircle width={12} height={12} color={COLORS.status.success} />
                        <Text style={[styles.defaultText, TEXT_STYLES.caption]}>
                          Varsayılan
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <Switch
                  value={module.isEnabled}
                  onValueChange={() => handleToggleModule(module.id)}
                  trackColor={{ 
                    false: COLORS.neutral[300], 
                    true: module.color + '40' 
                  }}
                  thumbColor={module.isEnabled ? module.color : COLORS.neutral[400]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Optional Modules Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>
            İsteğe Bağlı Modüller
          </Text>
          <Text style={[styles.sectionDescription, TEXT_STYLES.body]}>
            Bu modülleri ihtiyacınıza göre açıp kapatabilirsiniz
          </Text>
          
          <View style={styles.modulesList}>
            {optionalModules.map((module) => (
              <View key={module.id} style={styles.moduleCard}>
                <View style={styles.moduleInfo}>
                  <View style={[
                    styles.moduleIconContainer,
                    { backgroundColor: module.color + '20' }
                  ]}>
                    {getIconComponent(module.icon)}
                  </View>
                  <View style={styles.moduleDetails}>
                    <Text style={[styles.moduleName, TEXT_STYLES.body]}>
                      {module.displayName}
                    </Text>
                    <Text style={[styles.moduleDescription, TEXT_STYLES.caption]}>
                      {module.description}
                    </Text>
                  </View>
                </View>
                
                <Switch
                  value={module.isEnabled}
                  onValueChange={() => handleToggleModule(module.id)}
                  trackColor={{ 
                    false: COLORS.neutral[300], 
                    true: module.color + '40' 
                  }}
                  thumbColor={module.isEnabled ? module.color : COLORS.neutral[400]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Info width={24} height={24} color={COLORS.status.info} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, TEXT_STYLES.subtitle]}>
              Modül Yönetimi
            </Text>
            <Text style={[styles.infoText, TEXT_STYLES.body]}>
              • En az 1 modül aktif olmalıdır{'\n'}
              • Varsayılan modüller uygulamanın temel özellikleridir{'\n'}
              • Modülleri kapatmak verilerinizi silmez{'\n'}
              • Değişiklikler anında uygulanır
            </Text>
          </View>
        </View>

        {/* Debug Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetModules}
        >
          <RefreshCw width={20} height={20} color={COLORS.status.error} />
          <Text style={[styles.resetButtonText, TEXT_STYLES.body]}>
            Modülleri Sıfırla (Debug)
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
  headerSubtitle: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  sectionDescription: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  modulesList: {
    gap: SPACING.sm,
  },
  moduleCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  moduleDetails: {
    flex: 1,
  },
  moduleName: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  moduleDescription: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  defaultText: {
    color: COLORS.status.success,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.status.info + '10',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.info,
  },
  infoIconContainer: {
    marginRight: SPACING.md,
    marginTop: SPACING.xs,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  infoText: {
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.status.error + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  resetButtonText: {
    color: COLORS.status.error,
    fontWeight: '600',
  },
});

export default ModuleManagementScreen;
