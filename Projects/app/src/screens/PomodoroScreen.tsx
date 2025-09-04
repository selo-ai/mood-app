import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  Clock,
  Coffee,
  Target
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';

type PomodoroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Pomodoro'>;

const PomodoroScreen: React.FC = () => {
  const navigation = useNavigation<PomodoroScreenNavigationProp>();
  const {
    activePomodoroSession,
    pomodoroSettings,
    getCurrentPomodoroData,
    startPomodoroSession,
    pausePomodoroSession,
    resumePomodoroSession,
    completePomodoroSession,
    skipPomodoroSession,
    updatePomodoroSettings,
  } = useAppStore();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentData = getCurrentPomodoroData();

  // Ses ve titreşim fonksiyonu
  const playNotification = (type: 'start' | 'end') => {
    try {
      // Titreşim ver
      if (type === 'start') {
        Vibration.vibrate(200); // Kısa titreşim
      } else {
        Vibration.vibrate([0, 200, 100, 200]); // Uzun titreşim
      }
      
      // Ses çalmaya çalış (opsiyonel)
      if (pomodoroSettings.soundEnabled) {
        playSound(type);
      }
    } catch (error) {
      console.log('Bildirim hatası:', error);
    }
  };

  // Ses çalma fonksiyonu
  const playSound = async (type: 'start' | 'end') => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Basit bir bip sesi için sistem sesi kullan
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
        { shouldPlay: true, volume: 0.5 }
      );
      
      soundRef.current = sound;
      
      // Ses bittiğinde temizle
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Ses çalma hatası:', error);
    }
  };

    useEffect(() => {
    if (activePomodoroSession && activePomodoroSession.startTime && !activePomodoroSession.endTime) {
      // Aktif seans varsa ve duraklatılmamışsa
      const startTime = new Date(activePomodoroSession.startTime).getTime();
      const now = new Date().getTime();
      const elapsed = (now - startTime) / 1000 / 60; // dakika cinsinden (ondalıklı)
      const remaining = Math.max(0, activePomodoroSession.duration - elapsed);

      setTimeLeft(remaining);
      setIsRunning(true);
    } else if (activePomodoroSession && activePomodoroSession.endTime) {
      // Duraklatılmış seans
      const startTime = new Date(activePomodoroSession.startTime).getTime();
      const endTime = new Date(activePomodoroSession.endTime).getTime();
      const elapsed = (endTime - startTime) / 1000 / 60; // dakika cinsinden (ondalıklı)
      const remaining = Math.max(0, activePomodoroSession.duration - elapsed);

      setTimeLeft(remaining);
      setIsRunning(false);
    } else {
      setTimeLeft(0);
      setIsRunning(false);
    }
  }, [activePomodoroSession]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1/60) { // 1 saniye = 1/60 dakika
            // Süre bitti
            handleSessionComplete();
            return 0;
          }
          return prev - 1/60; // 1 saniye azalt
        });
      }, 1000); // 1 saniye
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

         return () => {
       if (intervalRef.current) {
         clearInterval(intervalRef.current);
       }
       if (soundRef.current) {
         soundRef.current.unloadAsync();
       }
     };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    if (activePomodoroSession) {
      completePomodoroSession();
      playNotification('end');
      setToastMessage(`${activePomodoroSession.type === 'work' ? 'Çalışma' : 'Mola'} seansı tamamlandı!`);
      setToastType('success');
      setShowToast(true);
    }
  };

  const handleStartWork = () => {
    startPomodoroSession('work');
    playNotification('start');
    setToastMessage('Çalışma seansı başladı!');
    setToastType('success');
    setShowToast(true);
  };

  const handleStartShortBreak = () => {
    startPomodoroSession('shortBreak');
    playNotification('start');
    setToastMessage('Kısa mola başladı!');
    setToastType('success');
    setShowToast(true);
  };

  const handleStartLongBreak = () => {
    startPomodoroSession('longBreak');
    playNotification('start');
    setToastMessage('Uzun mola başladı!');
    setToastType('success');
    setShowToast(true);
  };

  const handlePause = () => {
    pausePomodoroSession();
    setIsRunning(false);
    setToastMessage('Seans duraklatıldı');
    setToastType('success');
    setShowToast(true);
  };

  const handleResume = () => {
    resumePomodoroSession();
    setIsRunning(true);
    setToastMessage('Seans devam ediyor');
    setToastType('success');
    setShowToast(true);
  };

  const handleSkip = () => {
    Alert.alert(
      'Seansı Atla',
      'Bu seansı atlamak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Atla', 
          style: 'destructive',
          onPress: () => {
            skipPomodoroSession();
            setToastMessage('Seans atlandı');
            setToastType('success');
            setShowToast(true);
          }
        }
      ]
    );
  };

  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeText = (): string => {
    if (!activePomodoroSession) return 'Seans Yok';
    switch (activePomodoroSession.type) {
      case 'work': return 'Çalışma';
      case 'shortBreak': return 'Kısa Mola';
      case 'longBreak': return 'Uzun Mola';
      default: return 'Seans';
    }
  };

  const getSessionTypeColor = (): string => {
    if (!activePomodoroSession) return COLORS.neutral[400];
    switch (activePomodoroSession.type) {
      case 'work': return COLORS.status.error;
      case 'shortBreak': return COLORS.status.success;
      case 'longBreak': return COLORS.status.info;
      default: return COLORS.neutral[400];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft width={24} height={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerIconContainer}>
            <Clock width={32} height={32} color={COLORS.status.error} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>POMODORO</Text>
          <Text style={[styles.headerSubtitle, TEXT_STYLES.body]}>
            Odaklanma seanslarınızı yönetin
          </Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <View style={[styles.timerCard, { borderColor: getSessionTypeColor() }]}>
            <Text style={[styles.sessionType, TEXT_STYLES.h3, { color: getSessionTypeColor() }]}>
              {getSessionTypeText()}
            </Text>
            <Text style={[styles.timerText, TEXT_STYLES.score]}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={[styles.timerSubtext, TEXT_STYLES.body]}>
              {activePomodoroSession ? `${activePomodoroSession.duration} dakika` : 'Seans seçin'}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
                     {!activePomodoroSession ? (
             // Session Selection with Duration Controls
             <View style={styles.sessionButtons}>
               {/* Work Session */}
               <View style={[styles.sessionButton, { backgroundColor: COLORS.status.error + '20' }]}>
                 <View style={styles.sessionButtonHeader}>
                   <Target width={24} height={24} color={COLORS.status.error} />
                   <Text style={[styles.sessionButtonText, { color: COLORS.status.error }]}>
                     Çalışma
                   </Text>
                 </View>
                 <View style={styles.durationControls}>
                   <TouchableOpacity
                     style={[styles.durationButton, { backgroundColor: COLORS.status.error + '30' }]}
                     onPress={() => updatePomodoroSettings({ workDuration: Math.max(1, pomodoroSettings.workDuration - 5) })}
                   >
                     <Text style={[styles.durationButtonText, { color: COLORS.status.error }]}>-</Text>
                   </TouchableOpacity>
                   <Text style={[styles.durationText, { color: COLORS.status.error }]}>
                     {pomodoroSettings.workDuration}dk
                   </Text>
                   <TouchableOpacity
                     style={[styles.durationButton, { backgroundColor: COLORS.status.error + '30' }]}
                     onPress={() => updatePomodoroSettings({ workDuration: pomodoroSettings.workDuration + 5 })}
                   >
                     <Text style={[styles.durationButtonText, { color: COLORS.status.error }]}>+</Text>
                   </TouchableOpacity>
                 </View>
                 <TouchableOpacity 
                   style={styles.startButton}
                   onPress={handleStartWork}
                 >
                   <Text style={[styles.startButtonText, { color: COLORS.status.error }]}>Başlat</Text>
                 </TouchableOpacity>
               </View>
               
               {/* Short Break */}
               <View style={[styles.sessionButton, { backgroundColor: COLORS.status.success + '20' }]}>
                 <View style={styles.sessionButtonHeader}>
                   <Coffee width={24} height={24} color={COLORS.status.success} />
                   <Text style={[styles.sessionButtonText, { color: COLORS.status.success }]}>
                     Kısa Mola
                   </Text>
                 </View>
                 <View style={styles.durationControls}>
                   <TouchableOpacity
                     style={[styles.durationButton, { backgroundColor: COLORS.status.success + '30' }]}
                     onPress={() => updatePomodoroSettings({ shortBreakDuration: Math.max(1, pomodoroSettings.shortBreakDuration - 1) })}
                   >
                     <Text style={[styles.durationButtonText, { color: COLORS.status.success }]}>-</Text>
                   </TouchableOpacity>
                   <Text style={[styles.durationText, { color: COLORS.status.success }]}>
                     {pomodoroSettings.shortBreakDuration}dk
                   </Text>
                   <TouchableOpacity
                     style={[styles.durationButton, { backgroundColor: COLORS.status.success + '30' }]}
                     onPress={() => updatePomodoroSettings({ shortBreakDuration: pomodoroSettings.shortBreakDuration + 1 })}
                   >
                     <Text style={[styles.durationButtonText, { color: COLORS.status.success }]}>+</Text>
                   </TouchableOpacity>
                 </View>
                 <TouchableOpacity 
                   style={styles.startButton}
                   onPress={handleStartShortBreak}
                 >
                   <Text style={[styles.startButtonText, { color: COLORS.status.success }]}>Başlat</Text>
                 </TouchableOpacity>
               </View>
               
               {/* Long Break */}
               <View style={[styles.sessionButton, { backgroundColor: COLORS.status.info + '20' }]}>
                 <View style={styles.sessionButtonHeader}>
                   <Coffee width={24} height={24} color={COLORS.status.info} />
                   <Text style={[styles.sessionButtonText, { color: COLORS.status.info }]}>
                     Uzun Mola
                   </Text>
                 </View>
                 <View style={styles.durationControls}>
                   <TouchableOpacity
                     style={[styles.durationButton, { backgroundColor: COLORS.status.info + '30' }]}
                     onPress={() => updatePomodoroSettings({ longBreakDuration: Math.max(1, pomodoroSettings.longBreakDuration - 5) })}
                   >
                     <Text style={[styles.durationButtonText, { color: COLORS.status.info }]}>-</Text>
                   </TouchableOpacity>
                   <Text style={[styles.durationText, { color: COLORS.status.info }]}>
                     {pomodoroSettings.longBreakDuration}dk
                   </Text>
                   <TouchableOpacity
                     style={[styles.durationButton, { backgroundColor: COLORS.status.info + '30' }]}
                     onPress={() => updatePomodoroSettings({ longBreakDuration: pomodoroSettings.longBreakDuration + 5 })}
                   >
                     <Text style={[styles.durationButtonText, { color: COLORS.status.info }]}>+</Text>
                   </TouchableOpacity>
                 </View>
                 <TouchableOpacity 
                   style={styles.startButton}
                   onPress={handleStartLongBreak}
                 >
                   <Text style={[styles.startButtonText, { color: COLORS.status.info }]}>Başlat</Text>
                 </TouchableOpacity>
               </View>
             </View>
          ) : (
            // Active Session Controls
            <View style={styles.activeControls}>
              {isRunning ? (
                <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
                  <Pause width={24} height={24} color={COLORS.text.primary} />
                  <Text style={styles.controlButtonText}>Duraklat</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.controlButton} onPress={handleResume}>
                  <Play width={24} height={24} color={COLORS.text.primary} />
                  <Text style={styles.controlButtonText}>Devam Et</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={[styles.controlButton, styles.skipButton]} onPress={handleSkip}>
                <SkipForward width={24} height={24} color={COLORS.status.error} />
                <Text style={[styles.controlButtonText, { color: COLORS.status.error }]}>Atla</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

                 {/* Today's Stats */}
         <View style={styles.statsContainer}>
           <Text style={[styles.statsTitle, TEXT_STYLES.h3]}>Bugünkü İstatistikler</Text>
           <View style={styles.statsRow}>
             <View style={styles.statCard}>
               <Text style={[styles.statValue, TEXT_STYLES.h2]}>{currentData.completedPomodoros}</Text>
               <Text style={[styles.statLabel, TEXT_STYLES.body]}>Tamamlanan Pomodoro</Text>
             </View>
             <View style={styles.statCard}>
               <Text style={[styles.statValue, TEXT_STYLES.h2]}>{currentData.totalWorkTime}</Text>
               <Text style={[styles.statLabel, TEXT_STYLES.body]}>Toplam Çalışma (dk)</Text>
             </View>
             <View style={styles.statCard}>
               <Text style={[styles.statValue, TEXT_STYLES.h2]}>{currentData.totalBreakTime}</Text>
               <Text style={[styles.statLabel, TEXT_STYLES.body]}>Toplam Mola (dk)</Text>
             </View>
           </View>
         </View>

         {/* Sound Settings */}
         <View style={styles.soundSettingsContainer}>
           <View style={styles.soundSettingRow}>
             <Text style={[styles.soundSettingLabel, TEXT_STYLES.body]}>Ses Bildirimleri</Text>
             <Switch
               value={pomodoroSettings.soundEnabled}
               onValueChange={(value) => updatePomodoroSettings({ soundEnabled: value })}
               trackColor={{ false: COLORS.neutral[300], true: COLORS.primary[400] }}
               thumbColor={pomodoroSettings.soundEnabled ? COLORS.primary[500] : COLORS.neutral[400]}
             />
           </View>
         </View>

                        

        
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
  timerContainer: {
    marginBottom: SPACING.xl,
  },
  timerCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  sessionType: {
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  timerText: {
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  timerSubtext: {
    color: COLORS.text.secondary,
  },
  controlsContainer: {
    marginBottom: SPACING.xl,
  },
  sessionButtons: {
    gap: SPACING.md,
  },
     sessionButton: {
     padding: SPACING.lg,
     borderRadius: BORDER_RADIUS.lg,
     gap: SPACING.md,
   },
   sessionButtonHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: SPACING.md,
     marginBottom: SPACING.sm,
   },
   durationControls: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: SPACING.sm,
     marginBottom: SPACING.md,
   },
   durationButton: {
     width: 32,
     height: 32,
     borderRadius: BORDER_RADIUS.sm,
     alignItems: 'center',
     justifyContent: 'center',
   },
   durationButtonText: {
     fontWeight: 'bold',
     fontSize: 16,
   },
   durationText: {
     fontWeight: '600',
     fontSize: 16,
     minWidth: 40,
     textAlign: 'center',
   },
   startButton: {
     backgroundColor: 'rgba(255, 255, 255, 0.3)',
     paddingVertical: SPACING.sm,
     paddingHorizontal: SPACING.md,
     borderRadius: BORDER_RADIUS.md,
     alignItems: 'center',
   },
   startButtonText: {
     fontWeight: '600',
     fontSize: 14,
   },
  sessionButtonText: {
    fontWeight: '600',
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.md,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.card,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  skipButton: {
    backgroundColor: COLORS.status.error + '10',
  },
  controlButtonText: {
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: SPACING.xl,
  },
  statsTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    color: COLORS.primary[500],
    marginBottom: SPACING.xs,
  },
     statLabel: {
     color: COLORS.text.secondary,
     textAlign: 'center',
     fontSize: 12,
   },
   soundSettingsContainer: {
     backgroundColor: COLORS.background.card,
     borderRadius: BORDER_RADIUS.lg,
     padding: SPACING.lg,
     marginBottom: SPACING.lg,
     shadowColor: COLORS.shadow.light,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 1,
     shadowRadius: 4,
     elevation: 2,
   },
   soundSettingRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
   },
   soundSettingLabel: {
     color: COLORS.text.primary,
     fontWeight: '500',
   },
  
});

export default PomodoroScreen;
