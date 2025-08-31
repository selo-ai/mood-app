import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  ArrowLeft,
  Edit3,
  Trash2,
  Clock,
  Calendar,
  Flag,
  Target
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';
import AddTaskModal from '../components/AddTaskModal';
import { Task } from '../types';

type TasksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tasks'>;

const TasksScreen: React.FC = () => {
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const { 
    getCurrentDailyRecord, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion 
  } = useAppStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as 'work' | 'school' | 'personal' | 'health',
    priority: 'medium' as 'high' | 'medium' | 'low',
    duration: 'daily' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  const currentRecord = getCurrentDailyRecord();
  const tasks = currentRecord.tasks;

  const handleAddTask = (taskData: { title: string; description: string; category: string; priority: string; duration: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || undefined,
      category: taskData.category as 'work' | 'school' | 'personal' | 'health',
      priority: taskData.priority as 'high' | 'medium' | 'low',
      duration: taskData.duration as 'daily' | 'weekly' | 'monthly' | 'yearly',
      completed: false,
      createdAt: new Date(),
    };

    addTask(newTask);
    setShowAddModal(false);
    setToastMessage('Görev başarıyla eklendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleEditTask = () => {
    if (!editingTask) return;

    updateTask(editingTask.id, {
      title: editFormData.title,
      description: editFormData.description || undefined,
      category: editFormData.category,
      priority: editFormData.priority,
      duration: editFormData.duration,
    });

    setShowEditModal(false);
    setEditingTask(null);
    setEditFormData({ title: '', description: '', category: 'personal', priority: 'medium', duration: 'daily' });
    setToastMessage('Görev başarıyla güncellendi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setToastMessage('Görev başarıyla silindi!');
    setToastType('success');
    setShowToast(true);
  };

  const handleToggleComplete = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  const handleEditPress = (task: Task) => {
    setEditingTask(task);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      duration: task.duration,
    });
    setShowEditModal(true);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'work': return 'İş';
      case 'school': return 'Okul';
      case 'personal': return 'Kişisel';
      case 'health': return 'Sağlık';
      default: return 'Kişisel';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return COLORS.status.warning;
      case 'school': return COLORS.status.info;
      case 'personal': return COLORS.primary[500];
      case 'health': return COLORS.status.error;
      default: return COLORS.primary[500];
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Orta';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.status.error;
      case 'medium': return COLORS.status.warning;
      case 'low': return COLORS.status.success;
      default: return COLORS.status.warning;
    }
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'daily': return 'Günlük';
      case 'weekly': return 'Haftalık';
      case 'monthly': return 'Aylık';
      case 'yearly': return 'Yıllık';
      default: return 'Günlük';
    }
  };

  const getDurationColor = (duration: string) => {
    switch (duration) {
      case 'daily': return COLORS.status.success;
      case 'weekly': return COLORS.status.info;
      case 'monthly': return COLORS.status.warning;
      case 'yearly': return COLORS.status.error;
      default: return COLORS.status.success;
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

      return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets={true}
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
              <Target width={32} height={32} color={COLORS.primary[500]} />
            </View>
            <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>GÖREVLERİM</Text>
            <Text style={[styles.dateText, TEXT_STYLES.body]}>
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, TEXT_STYLES.subtitle]}>Bugünkü İlerleme</Text>
              <Text style={[styles.progressValue, TEXT_STYLES.score]}>
                {completedCount}/{totalCount}
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }
                ]} 
              />
            </View>
            
            <Text style={[styles.progressText, TEXT_STYLES.body]}>
              {completedCount === totalCount && totalCount > 0
                ? 'Harika! Tüm görevlerini tamamladın! 🎉' 
                : totalCount === 0
                ? 'Henüz görev eklenmemiş'
                : `${totalCount - completedCount} görev kaldı`
              }
            </Text>
          </View>

          {/* Tasks List */}
          <View style={styles.tasksSection}>
            <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Görevler</Text>

            {tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Target width={64} height={64} color={COLORS.neutral[400]} />
                </View>
                <Text style={[styles.emptyTitle, TEXT_STYLES.h3]}>
                  Henüz Görev Eklenmemiş
                </Text>
                <Text style={[styles.emptyText, TEXT_STYLES.body]}>
                  İlk görevini ekleyerek başla
                </Text>
              </View>
            ) : (
              <View style={styles.tasksList}>
                {tasks.map((task) => (
                  <View key={task.id} style={styles.taskCard}>
                    <TouchableOpacity
                      style={styles.taskContent}
                      onPress={() => handleToggleComplete(task.id)}
                    >
                      <View style={styles.taskCheckbox}>
                        {task.completed ? (
                          <CheckSquare width={24} height={24} color={COLORS.status.success} />
                        ) : (
                          <Square width={24} height={24} color={COLORS.neutral[400]} />
                        )}
                      </View>
                      
                      <View style={styles.taskInfo}>
                        <Text style={[
                          styles.taskTitle,
                          TEXT_STYLES.body,
                          task.completed && styles.completedText
                        ]}>
                          {task.title}
                        </Text>
                        
                        {task.description && (
                          <Text style={[
                            styles.taskDescription,
                            TEXT_STYLES.caption,
                            task.completed && styles.completedText
                          ]}>
                            {task.description}
                          </Text>
                        )}
                        
                        <View style={styles.taskMeta}>
                          <View style={styles.metaRow}>
                            <View style={[
                              styles.categoryTag,
                              { backgroundColor: getCategoryColor(task.category) + '20' }
                            ]}>
                              <Text style={[
                                styles.categoryText,
                                TEXT_STYLES.caption,
                                { color: getCategoryColor(task.category) }
                              ]}>
                                {getCategoryLabel(task.category)}
                              </Text>
                            </View>
                            
                            <View style={[
                              styles.priorityTag,
                              { backgroundColor: getPriorityColor(task.priority) + '20' }
                            ]}>
                              <Flag width={12} height={12} color={getPriorityColor(task.priority)} />
                              <Text style={[
                                styles.priorityText,
                                TEXT_STYLES.caption,
                                { color: getPriorityColor(task.priority) }
                              ]}>
                                {getPriorityLabel(task.priority)}
                              </Text>
                            </View>

                            <View style={[
                              styles.durationTag,
                              { backgroundColor: getDurationColor(task.duration) + '20' }
                            ]}>
                              <Calendar width={12} height={12} color={getDurationColor(task.duration)} />
                              <Text style={[
                                styles.durationText,
                                TEXT_STYLES.caption,
                                { color: getDurationColor(task.duration) }
                              ]}>
                                {getDurationLabel(task.duration)}
                              </Text>
                            </View>
                          </View>
                        
                          <View style={styles.timeContainer}>
                            <Clock width={16} height={16} color={COLORS.text.secondary} />
                            <Text style={[styles.timeText, TEXT_STYLES.caption]}>
                              {(() => {
                                const createdAt = task.createdAt instanceof Date 
                                  ? task.createdAt 
                                  : new Date(task.createdAt);
                                return createdAt.toLocaleTimeString('tr-TR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                });
                              })()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditPress(task)}
                      >
                        <Edit3 width={16} height={16} color={COLORS.text.secondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 width={16} height={16} color={COLORS.status.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

                     {/* Bottom Spacer for Fixed Button */}
           <View style={styles.bottomSpacer} />
         </ScrollView>
 
         {/* Fixed Add Task Button */}
         <View style={styles.fixedButtonContainer}>
           <TouchableOpacity
             style={styles.addTaskButton}
             onPress={() => setShowAddModal(true)}
           >
             <Plus width={24} height={24} color={COLORS.text.inverse} />
             <Text style={[styles.addTaskButtonText, TEXT_STYLES.button]}>
               Görev Ekle
             </Text>
           </TouchableOpacity>
         </View>

      {/* Add Task Modal */}
      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={handleAddTask}
      />

      {/* Edit Task Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
                 <TouchableOpacity 
           style={styles.modalOverlay} 
           activeOpacity={1} 
           onPress={() => setShowEditModal(false)}
         >
           <TouchableOpacity 
             style={styles.modal} 
             activeOpacity={1}
             onPress={() => {}} // Modal içine tıklandığında hiçbir şey yapma
           >
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              Görev Düzenle
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Görev Başlığı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Görev başlığı..."
              placeholderTextColor={COLORS.text.tertiary}
              value={editFormData.title}
              onChangeText={(text) => setEditFormData({ ...editFormData, title: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Açıklama (Opsiyonel):</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Görev hakkında detaylar, notlar..."
              placeholderTextColor={COLORS.text.tertiary}
              value={editFormData.description}
              onChangeText={(text) => setEditFormData({ ...editFormData, description: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Kategori:</Text>
            <View style={styles.categoryButtons}>
              {[
                { key: 'personal', label: 'Kişisel' },
                { key: 'work', label: 'İş' },
                { key: 'school', label: 'Okul' },
                { key: 'health', label: 'Sağlık' }
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: getCategoryColor(cat.key) + '20' },
                    editFormData.category === cat.key && { backgroundColor: getCategoryColor(cat.key) }
                  ]}
                  onPress={() => setEditFormData({ ...editFormData, category: cat.key as any })}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    TEXT_STYLES.caption,
                    editFormData.category === cat.key && { color: COLORS.text.inverse }
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, TEXT_STYLES.body]}>Öncelik:</Text>
            <View style={styles.priorityButtons}>
              {[
                { key: 'low', label: 'Düşük' },
                { key: 'medium', label: 'Orta' },
                { key: 'high', label: 'Yüksek' }
              ].map((pri) => (
                <TouchableOpacity
                  key={pri.key}
                  style={[
                    styles.priorityButton,
                    { backgroundColor: getPriorityColor(pri.key) + '20' },
                    editFormData.priority === pri.key && { backgroundColor: getPriorityColor(pri.key) }
                  ]}
                  onPress={() => setEditFormData({ ...editFormData, priority: pri.key as any })}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    TEXT_STYLES.caption,
                    editFormData.priority === pri.key && { color: COLORS.text.inverse }
                  ]}>
                    {pri.label}
                  </Text>
                </TouchableOpacity>
              ))}
                         </View>

             <Text style={[styles.label, TEXT_STYLES.body]}>Süre:</Text>
             <View style={styles.durationButtons}>
               {[
                 { key: 'daily', label: 'Günlük' },
                 { key: 'weekly', label: 'Haftalık' },
                 { key: 'monthly', label: 'Aylık' },
                 { key: 'yearly', label: 'Yıllık' }
               ].map((dur) => (
                 <TouchableOpacity
                   key={dur.key}
                   style={[
                     styles.durationButton,
                     { backgroundColor: getDurationColor(dur.key) + '20' },
                     editFormData.duration === dur.key && { backgroundColor: getDurationColor(dur.key) }
                   ]}
                   onPress={() => setEditFormData({ ...editFormData, duration: dur.key as any })}
                 >
                   <Text style={[
                     styles.durationButtonText,
                     TEXT_STYLES.caption,
                     editFormData.duration === dur.key && { color: COLORS.text.inverse }
                   ]}>
                     {dur.label}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>

             <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.cancelButtonText, TEXT_STYLES.button]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleEditTask}
              >
                <Text style={[styles.saveButtonText, TEXT_STYLES.button]}>Güncelle</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
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
  },
     scrollContent: {
     padding: SPACING.md,
     flexGrow: 1,
     paddingBottom: 200, // Extra padding for keyboard and fixed button
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
  progressCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    color: COLORS.text.primary,
  },
  progressValue: {
    color: COLORS.primary[500],
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  tasksSection: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
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
  tasksList: {
    gap: SPACING.sm,
  },
  taskCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCheckbox: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  taskDescription: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  categoryTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    fontWeight: '600',
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
  },
  priorityText: {
    fontWeight: '600',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
  },
  durationText: {
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
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
    marginBottom: SPACING.md,
    height: 80,
    backgroundColor: COLORS.background.primary,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  categoryButtonText: {
    fontWeight: '600',
  },
  priorityButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontWeight: '600',
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  durationButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  durationButtonText: {
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
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text.inverse,
  },
  addTaskButton: {
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  addTaskButtonText: {
    color: COLORS.text.inverse,
    marginLeft: SPACING.sm,
  },
                       bottomSpacer: {
      height: 200, // Extra height for keyboard and fixed button
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

export default TasksScreen; 