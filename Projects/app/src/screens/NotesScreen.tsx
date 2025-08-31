import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  FileText, 
  Plus, 
  ArrowLeft,
  Mic,
  Play,
  Square,
  Check,
  Trash2,
  Edit3
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { Note, TextNote, AudioNote } from '../types';
import { Audio } from 'expo-av';
import Toast from '../components/Toast';
import { useAppStore } from '../store/useAppStore';

type NotesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Notes'>;

const NotesScreen: React.FC = () => {
  const navigation = useNavigation<NotesScreenNavigationProp>();
  
  // Zustand store'dan verileri al
  const { notes, addNote, updateNote, deleteNote } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    type: 'text' as 'text' | 'audio',
    title: '',
    content: '',
  });
  
     // Modal açılırken state'leri sıfırla
   const resetModalStates = () => {
     console.log('Modal state\'leri sıfırlanıyor');
     setAudioUri('');
     setAudioDuration(0);
     setIsRecording(false);
     setRecording(null);
     setIsPlaying(false);
     setRecordingTime(0);
     if (recordingTimer) {
       clearInterval(recordingTimer);
       setRecordingTimer(null);
     }
     if (currentSound) {
       console.log('Modal açılırken ses durduruluyor');
       currentSound.unloadAsync();
       setCurrentSound(null);
     }
   };

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Debug için console.log ekleyelim
  console.log('isRecording:', isRecording, 'recording:', recording);

     // Sayfa ayrılınca ses oynatmayı durdur
   useEffect(() => {
     return () => {
       if (currentSound && isPlaying) {
         console.log('Sayfa kapatılıyor, ses durduruluyor');
         currentSound.unloadAsync();
       }
     };
   }, []);

   // Sayfa focus'u kaybettiğinde ses oynatmayı durdur
   useFocusEffect(
     React.useCallback(() => {
       return () => {
         if (currentSound && isPlaying) {
           console.log('Sayfa focus kaybetti, ses durduruluyor');
           currentSound.unloadAsync();
           setCurrentSound(null);
           setIsPlaying(false);
         }
       };
     }, [currentSound, isPlaying])
   );

   // Modal kapatıldığında ses oynatmayı durdur
   useEffect(() => {
     if (!showAddModal && currentSound && isPlaying) {
       console.log('Modal kapatıldı, ses durduruluyor');
       currentSound.unloadAsync();
       setCurrentSound(null);
       setIsPlaying(false);
     }
   }, [showAddModal]);

  const handleAddNote = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Hata', 'Lütfen not başlığını girin');
      return;
    }

    if (formData.type === 'text' && !formData.content.trim()) {
      Alert.alert('Hata', 'Lütfen not içeriğini girin');
      return;
    }

    if (formData.type === 'audio' && !audioUri) {
      Alert.alert('Hata', 'Lütfen ses kaydı yapın');
      return;
    }

    const now = new Date();
    let newNote: Note;

    if (formData.type === 'text') {
      newNote = {
        id: editingNote?.id || Date.now().toString(),
        type: 'text',
        title: formData.title.trim(),
        content: formData.content.trim(),
        createdAt: editingNote?.createdAt || now,
        updatedAt: now,
      } as TextNote;
    } else {
      newNote = {
        id: editingNote?.id || Date.now().toString(),
        type: 'audio',
        title: formData.title.trim(),
        audioUri,
        duration: audioDuration,
        createdAt: editingNote?.createdAt || now,
        updatedAt: now,
      } as AudioNote;
    }

    if (editingNote) {
      updateNote(editingNote.id, newNote);
    } else {
      addNote(newNote);
    }

    setFormData({ type: 'text', title: '', content: '' });
    setAudioUri('');
    setAudioDuration(0);
    setShowAddModal(false);
    setEditingNote(null);
    showToast(editingNote ? 'Not güncellendi!' : 'Not eklendi!', 'success');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setFormData({
      type: note.type,
      title: note.title,
      content: note.type === 'text' ? (note as TextNote).content : '',
    });
    if (note.type === 'audio') {
      setAudioUri((note as AudioNote).audioUri);
      setAudioDuration((note as AudioNote).duration);
    }
    setShowAddModal(true);
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Notu Sil',
      'Bu notu silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteNote(noteId);
            showToast('Not silindi!', 'success');
          },
        },
      ]
    );
  };

    const startRecording = async () => {
    try {
      console.log('startRecording çağrıldı');
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Ses kaydı için mikrofon izni gereklidir.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      console.log('Recording başlatıldı:', recording);
      setRecording(recording);
      setIsRecording(true);
      setRecordingTime(0);
      
             // Tek timer ile hem sayaç hem sınır kontrolü
       const timer = setInterval(() => {
         setRecordingTime(prev => {
           const newTime = prev + 1;
           console.log(`Timer: ${newTime}/20`);
           
           if (newTime >= 20) {
             console.log('20 saniyeye ulaşıldı, kayıt durduruluyor');
             clearInterval(timer);
             setRecordingTimer(null);
             // Recording objesini doğrudan kullan
             forceStopRecording(recording);
             return 20;
           }
           return newTime;
         });
       }, 1000);
      
      setRecordingTimer(timer);
      
    } catch (err) {
      console.error('Recording hatası:', err);
      Alert.alert('Hata', 'Ses kaydı başlatılamadı.');
    }
  };

     const forceStopRecording = async (recordingObj: Audio.Recording | null) => {
     console.log('forceStopRecording çağrıldı, recordingObj:', recordingObj);
     
     // Timer'ı durdur
     if (recordingTimer) {
       console.log('Timer durduruluyor');
       clearInterval(recordingTimer);
       setRecordingTimer(null);
     }
     
     setIsRecording(false);
     setRecordingTime(0);
     
     if (!recordingObj) {
       console.log('Recording objesi yok, durdurma iptal');
       return;
     }

     try {
       console.log('Recording durduruluyor...');
       await recordingObj.stopAndUnloadAsync();
       const uri = recordingObj.getURI();
       if (uri) {
         setAudioUri(uri);
         const status = await recordingObj.getStatusAsync();
         setAudioDuration(Math.floor(status.durationMillis! / 1000));
         console.log('Kayıt tamamlandı, süre:', Math.floor(status.durationMillis! / 1000));
       }
     } catch (err) {
       console.error('Recording durdurma hatası:', err);
     } finally {
       setRecording(null);
     }
   };

   const stopRecording = async () => {
     console.log('stopRecording çağrıldı, recording:', recording);
     await forceStopRecording(recording);
   };

  const playAudio = async () => {
    if (!audioUri) return;

    try {
      if (isPlaying && currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setIsPlaying(false);
        setCurrentSound(null);
        return;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setCurrentSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentSound(null);
        }
      });
    } catch (err) {
      Alert.alert('Hata', 'Ses dosyası oynatılamadı.');
    }
  };

  const playAudioFromNote = async (note: AudioNote) => {
    try {
      if (isPlaying && currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setIsPlaying(false);
        setCurrentSound(null);
        return;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: note.audioUri });
      setCurrentSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentSound(null);
        }
      });
    } catch (err) {
      Alert.alert('Hata', 'Ses dosyası oynatılamadı.');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

    return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          nestedScrollEnabled={true}
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
              <FileText width={32} height={32} color={COLORS.status.info} />
            </View>
            <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>NOTLAR</Text>
            <Text style={[styles.dateText, TEXT_STYLES.body]}>
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Notes List */}
          {notes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <FileText width={64} height={64} color={COLORS.neutral[400]} />
              </View>
              <Text style={[styles.emptyTitle, TEXT_STYLES.h3]}>
                Henüz Not Eklenmemiş
              </Text>
              <Text style={[styles.emptyText, TEXT_STYLES.body]}>
                İlk notunu ekleyerek başla
              </Text>
            </View>
          ) : (
            <View style={styles.notesList}>
              {notes.map((note) => (
                <TouchableOpacity 
                  key={note.id} 
                  style={[
                    styles.noteCard,
                    note.type === 'text' 
                      ? { backgroundColor: COLORS.status.info + '10' }
                      : { backgroundColor: COLORS.status.warning + '10' }
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleEditNote(note)}
                >
                  <View style={styles.noteHeader}>
                    <Text style={[styles.noteTitle, TEXT_STYLES.body]}>
                      {note.title}
                    </Text>
                    <View style={styles.noteTypeContainer}>
                      {note.type === 'text' ? (
                        <View style={styles.typeTag}>
                          <FileText width={16} height={16} color={COLORS.status.info} />
                          <Text style={[styles.typeText, TEXT_STYLES.caption, { color: COLORS.status.info }]}>
                            Yazılı Not
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.typeTag}>
                          <Mic width={16} height={16} color={COLORS.status.warning} />
                          <Text style={[styles.typeText, TEXT_STYLES.caption, { color: COLORS.status.warning }]}>
                            Sesli Not
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                
                  {note.type === 'text' ? (
                    <Text style={[styles.noteContent, TEXT_STYLES.body]} numberOfLines={3}>
                      {(note as TextNote).content}
                    </Text>
                  ) : (
                    <View style={styles.audioContainer}>
                      <TouchableOpacity style={styles.playButton} onPress={() => playAudioFromNote(note as AudioNote)}>
                        {isPlaying ? (
                          <Square width={20} height={20} color={COLORS.status.error} />
                        ) : (
                          <Play width={20} height={20} color={COLORS.primary[500]} />
                        )}
                      </TouchableOpacity>
                      <Text style={[styles.audioDuration, TEXT_STYLES.caption]}>
                        {formatDuration((note as AudioNote).duration)}
                      </Text>
                    </View>
                  )}
                
                  <View style={styles.noteFooter}>
                    <Text style={[styles.noteDate, TEXT_STYLES.caption]}>
                      {formatDate(note.createdAt)}
                    </Text>
                    <View style={styles.noteActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditNote(note)}
                      >
                        <Edit3 width={16} height={16} color={COLORS.status.info} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 width={16} height={16} color={COLORS.status.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

                     {/* Bottom Spacer for Fixed Button */}
           <View style={styles.bottomSpacer} />
         </ScrollView>
 
         {/* Fixed Add Note Button */}
         <View style={styles.fixedButtonContainer}>
           <TouchableOpacity
             style={styles.addButton}
             onPress={() => {
               setEditingNote(null);
               setFormData({ type: 'audio', title: '', content: '' }); // Sesli not varsayılan olsun
               resetModalStates();
               setShowAddModal(true);
             }}
           >
             <Plus width={24} height={24} color={COLORS.text.inverse} />
             <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
               Not Ekle
             </Text>
           </TouchableOpacity>
         </View>

      {/* Add Note Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setEditingNote(null);
        }}
      >
                 <TouchableOpacity 
           style={styles.modalOverlay} 
           activeOpacity={1} 
           onPress={() => {
             setShowAddModal(false);
             setEditingNote(null);
           }}
         >
           <TouchableOpacity 
             style={styles.modal} 
             activeOpacity={1}
             onPress={() => {}} // Modal içine tıklandığında hiçbir şey yapma
           >
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              {editingNote ? 'Notu Düzenle' : 'Yeni Not Ekle'}
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Not Tipi:</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { backgroundColor: COLORS.status.info + '20' },
                  formData.type === 'text' && { backgroundColor: COLORS.status.info }
                ]}
                                 onPress={() => {
                   setFormData({ ...formData, type: 'text' });
                   resetModalStates();
                 }}
              >
                <FileText width={16} height={16} color={formData.type === 'text' ? COLORS.text.inverse : COLORS.status.info} />
                <Text style={[
                  styles.typeButtonText,
                  TEXT_STYLES.caption,
                  { color: formData.type === 'text' ? COLORS.text.inverse : COLORS.status.info }
                ]}>
                  Yazılı Not
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                                 style={[
                   styles.typeButton,
                   { backgroundColor: COLORS.status.info + '20' },
                   formData.type === 'audio' && { backgroundColor: COLORS.status.info }
                 ]}
                                 onPress={() => {
                   setFormData({ ...formData, type: 'audio' });
                   resetModalStates();
                 }}
              >
                                 <Mic width={16} height={16} color={formData.type === 'audio' ? COLORS.text.inverse : COLORS.status.info} />
                 <Text style={[
                   styles.typeButtonText,
                   TEXT_STYLES.caption,
                   { color: formData.type === 'audio' ? COLORS.text.inverse : COLORS.status.info }
                 ]}>
                  Sesli Not
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, TEXT_STYLES.body]}>Başlık:</Text>
            <TextInput
              style={styles.input}
              placeholder="Not başlığını girin..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            {formData.type === 'text' ? (
              <>
                <Text style={[styles.label, TEXT_STYLES.body]}>İçerik:</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Not içeriğini girin..."
                  placeholderTextColor={COLORS.text.tertiary}
                  value={formData.content}
                  onChangeText={(text) => setFormData({ ...formData, content: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </>
            ) : (
              <>
                                 <Text style={[styles.label, TEXT_STYLES.body]}>Ses Kaydı:</Text>
                 {!audioUri ? (
                   <View style={styles.recordingContainer}>
                     <TouchableOpacity
                       style={[styles.recordButton, isRecording && { backgroundColor: COLORS.status.error }]}
                       onPress={isRecording ? stopRecording : startRecording}
                     >
                       {isRecording ? (
                         <Square width={24} height={24} color={COLORS.text.inverse} />
                       ) : (
                         <Mic width={24} height={24} color={COLORS.text.inverse} />
                       )}
                     </TouchableOpacity>
                                           <Text style={[styles.recordingText, TEXT_STYLES.caption]}>
                        {isRecording ? `Kaydı durdurmak için tıklayın` : 'Kayıt başlatmak için tıklayın'}
                      </Text>
                                             {!isRecording && (
                         <Text style={[styles.timerText, TEXT_STYLES.caption]}>
                           En fazla 20 sn. kayıt yapabilirsiniz
                         </Text>
                       )}
                      {isRecording && (
                        <Text style={[styles.timerText, TEXT_STYLES.caption]}>
                          {recordingTime}/20 sn
                        </Text>
                      )}
                   </View>
                ) : (
                                     <View style={styles.audioPlayer}>
                     <TouchableOpacity style={styles.playButton} onPress={playAudio}>
                       {isPlaying ? (
                         <Square width={20} height={20} color={COLORS.status.error} />
                       ) : (
                                                   <Play width={20} height={20} color={COLORS.primary[500]} />
                       )}
                     </TouchableOpacity>
                     <Text style={[styles.audioDuration, TEXT_STYLES.body]}>
                       {formatDuration(audioDuration)}
                     </Text>
                     <TouchableOpacity
                       style={styles.retryButton}
                       onPress={() => {
                         setAudioUri('');
                         setAudioDuration(0);
                       }}
                     >
                       <Text style={[styles.retryButtonText, TEXT_STYLES.caption]}>Yeniden Kaydet</Text>
                     </TouchableOpacity>
                   </View>
                )}
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setShowAddModal(false);
                  setEditingNote(null);
                }}
              >
                <Text style={[styles.cancelButtonText, TEXT_STYLES.button]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleAddNote}
              >
                <Text style={[styles.saveButtonText, TEXT_STYLES.button]}>
                  {editingNote ? 'Güncelle' : 'Ekle'}
                </Text>
              </TouchableOpacity>
                         </View>
           </TouchableOpacity>
         </TouchableOpacity>
       </Modal>
       
       {/* Toast Notification */}
       <Toast
         visible={toastVisible}
         message={toastMessage}
         type={toastType}
         onHide={() => setToastVisible(false)}
               />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
     scrollContent: {
     padding: SPACING.md,
     flexGrow: 1,
     paddingBottom: 100, // Reduced padding since KeyboardAvoidingView handles it
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
  notesList: {
    gap: SPACING.sm,
  },
  noteCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  noteTitle: {
    color: COLORS.text.primary,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.sm,
  },
  editButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.status.info + '20',
    borderWidth: 1,
    borderColor: COLORS.status.info + '30',
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  deleteButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.status.error + '20',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.status.error + '30',
  },
  noteTypeContainer: {
    marginBottom: SPACING.sm,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    alignSelf: 'flex-start',
  },
  typeText: {
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  noteContent: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  playButton: {
    backgroundColor: COLORS.primary[100],
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary[300],
  },
  audioDuration: {
    color: COLORS.text.secondary,
    fontWeight: '500',
    fontSize: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  noteDate: {
    color: COLORS.text.tertiary,
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
  typeButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  typeButtonText: {
    marginLeft: SPACING.xs,
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
    height: 100,
    backgroundColor: COLORS.background.primary,
    textAlignVertical: 'top',
  },
  recordingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  recordButton: {
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.full,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  recordingText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  timerText: {
    color: COLORS.status.warning,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.status.warning + '20',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  retryButtonText: {
    color: COLORS.status.warning,
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
           bottomSpacer: {
      height: 100, // Reduced height since KeyboardAvoidingView handles it
    },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default NotesScreen; 