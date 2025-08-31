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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  BookOpen, 
  Plus, 
  ArrowLeft,
  CheckCircle
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { Book } from '../types';
import Toast from '../components/Toast';
import { useAppStore } from '../store/useAppStore';

type BooksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Books'>;

const BooksScreen: React.FC = () => {
  const navigation = useNavigation<BooksScreenNavigationProp>();
  
  // Zustand store'dan verileri al
  const { books, addBook, updateBook, deleteBook, updateBookProgress, completeBook } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '',
    todayPages: '',
  });

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleAddBook = () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.totalPages.trim()) {
      Alert.alert('Hata', 'Lütfen kitap adı, yazar ve toplam sayfa girin');
      return;
    }

    const totalPagesNum = Number(formData.totalPages);
    const currentPageNum = editingBook ? Number(formData.currentPage) : 0; // İlk kayıtta default 0
    const todayPagesNum = Number(formData.todayPages) || 0;

    if (currentPageNum > totalPagesNum) {
      Alert.alert('Hata', 'Kaldığımız sayfa sayısı toplam sayfa sayısından büyük olamaz.');
      return;
    }

    const newCurrentPage = currentPageNum + todayPagesNum;
    const isCompleted = newCurrentPage >= totalPagesNum;
    
    // Kitap tamamlandı mı kontrol et
    const wasCompleted = editingBook ? editingBook.isCompleted : false;
    const justCompleted = isCompleted && !wasCompleted;

    const now = new Date();
    const newBook: Book = {
      id: editingBook?.id || Date.now().toString(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      totalPages: totalPagesNum,
      currentPage: newCurrentPage,
      isCompleted,
      startedAt: editingBook?.startedAt || now,
      completedAt: isCompleted ? now : undefined,
      createdAt: editingBook?.createdAt || now,
      updatedAt: now,
    };

    if (editingBook) {
      updateBook(editingBook.id, newBook);
    } else {
      addBook(newBook);
    }

    setFormData({ title: '', author: '', totalPages: '', currentPage: '', todayPages: '' });
    setShowAddModal(false);
    setEditingBook(null);
    
    if (justCompleted) {
      showToast(`Tebrikler! "${formData.title.trim()}" kitabını bitirdiniz!`, 'success');
    } else {
      showToast(editingBook ? 'Kitap güncellendi!' : 'Kitap eklendi!', 'success');
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      totalPages: book.totalPages.toString(),
      currentPage: book.currentPage.toString(),
      todayPages: '', // Boş bırak, placeholder olarak 0 gösterilsin
    });
    setShowAddModal(true);
  };

  const handleDeleteBook = (bookId: string) => {
    Alert.alert(
      'Kitabı Sil',
      'Bu kitabı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteBook(bookId);
            showToast('Kitap silindi!', 'success');
          },
        },
      ]
    );
  };

  const getProgressPercentage = (book: Book) => {
    return Math.round((book.currentPage / book.totalPages) * 100);
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date in formatDate:', date);
        return '01/01/2024';
      }
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dateObj);
    } catch (error) {
      console.warn('Date formatting error:', error);
      return '01/01/2024';
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const currentBooks = books.filter(book => !book.isCompleted);
  const completedBooks = books.filter(book => book.isCompleted);

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
              <BookOpen width={32} height={32} color={COLORS.status.success} />
            </View>
            <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>KİTAP OKU</Text>
            <Text style={[styles.dateText, TEXT_STYLES.body]}>
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Books List */}
          {books.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <BookOpen width={64} height={64} color={COLORS.neutral[400]} />
              </View>
              <Text style={[styles.emptyTitle, TEXT_STYLES.h3]}>
                Henüz Kitap Eklenmemiş
              </Text>
              <Text style={[styles.emptyText, TEXT_STYLES.body]}>
                İlk kitabını ekleyerek başla
              </Text>
            </View>
          ) : (
            <View style={styles.booksList}>
              {/* Devam Eden Kitaplar */}
              {currentBooks.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Devam Eden Kitaplar</Text>
                  {currentBooks.map((book) => (
                    <View key={book.id} style={styles.bookCard}>
                      <View style={styles.bookHeader}>
                        <Text style={[styles.bookTitle, TEXT_STYLES.body]}>
                          {book.title}
                        </Text>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditBook(book)}
                        >
                          <Text style={[styles.editButtonText, TEXT_STYLES.caption]}>Düzenle</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <Text style={[styles.authorText, TEXT_STYLES.body]}>
                        Yazar: {book.author}
                      </Text>
                      
                      <View style={styles.progressContainer}>
                        <Text style={[styles.progressText, TEXT_STYLES.body]}>
                          {book.currentPage} / {book.totalPages} sayfa (%{getProgressPercentage(book)})
                        </Text>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { width: `${getProgressPercentage(book)}%` }
                            ]} 
                          />
                        </View>
                      </View>
                      
                      <Text style={[styles.dateText, TEXT_STYLES.caption]}>
                        Başlangıç: {formatDate(book.startedAt)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Tamamlanan Kitaplar */}
              {completedBooks.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Tamamlanan Kitaplar</Text>
                  {completedBooks.map((book) => (
                    <View key={book.id} style={styles.bookCard}>
                      <View style={styles.bookHeader}>
                        <Text style={[styles.bookTitle, TEXT_STYLES.body]}>
                          {book.title}
                        </Text>
                        <View style={styles.completedBadge}>
                          <CheckCircle width={16} height={16} color={COLORS.status.success} />
                          <Text style={[styles.completedText, TEXT_STYLES.caption]}>Tamamlandı</Text>
                        </View>
                      </View>
                      
                      <Text style={[styles.authorText, TEXT_STYLES.body]}>
                        Yazar: {book.author}
                      </Text>
                      
                      <Text style={[styles.dateText, TEXT_STYLES.caption]}>
                        Tamamlanma: {book.completedAt ? formatDate(book.completedAt) : 'Bilinmiyor'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

                     {/* Bottom Spacer for Fixed Button */}
           <View style={styles.bottomSpacer} />
         </ScrollView>
 
         {/* Fixed Add Book Button */}
         <View style={styles.fixedButtonContainer}>
           <TouchableOpacity
             style={styles.addButton}
             onPress={() => {
               setEditingBook(null);
               setFormData({ title: '', author: '', totalPages: '', currentPage: '', todayPages: '' });
               setShowAddModal(true);
             }}
           >
             <Plus width={24} height={24} color={COLORS.text.inverse} />
             <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
               Kitap Ekle
             </Text>
           </TouchableOpacity>
         </View>

      {/* Add Book Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setEditingBook(null);
        }}
      >
                 <TouchableOpacity 
           style={styles.modalOverlay} 
           activeOpacity={1} 
           onPress={() => {
             setShowAddModal(false);
             setEditingBook(null);
           }}
         >
           <TouchableOpacity 
             style={styles.modal} 
             activeOpacity={1}
             onPress={() => {}} // Modal içine tıklandığında hiçbir şey yapma
           >
            <Text style={[styles.modalTitle, TEXT_STYLES.h3]}>
              {editingBook ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}
            </Text>
            
            <Text style={[styles.label, TEXT_STYLES.body]}>Kitap Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Kitap adını girin..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Yazar:</Text>
            <TextInput
              style={styles.input}
              placeholder="Yazar adını girin..."
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
            />

            <Text style={[styles.label, TEXT_STYLES.body]}>Toplam Sayfa Sayısı:</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Sayfa"
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.totalPages}
              onChangeText={(text) => setFormData({ ...formData, totalPages: text })}
              keyboardType="numeric"
            />

            {editingBook && (
              <>
                <Text style={[styles.label, TEXT_STYLES.body]}>Kaldığımız Sayfa:</Text>
                <TextInput
                  style={styles.smallInput}
                  placeholder="Sayfa"
                  placeholderTextColor={COLORS.text.tertiary}
                  value={formData.currentPage}
                  onChangeText={(text) => setFormData({ ...formData, currentPage: text })}
                  keyboardType="numeric"
                />
              </>
            )}

            <Text style={[styles.label, TEXT_STYLES.body]}>Bugün Okunan Sayfa:</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Sayfa"
              placeholderTextColor={COLORS.text.tertiary}
              value={formData.todayPages}
              onChangeText={(text) => setFormData({ ...formData, todayPages: text })}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setShowAddModal(false);
                  setEditingBook(null);
                }}
              >
                <Text style={[styles.cancelButtonText, TEXT_STYLES.button]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleAddBook}
              >
                <Text style={[styles.saveButtonText, TEXT_STYLES.button]}>
                  {editingBook ? 'Güncelle' : 'Ekle'}
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
  booksList: {
    gap: SPACING.lg,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  bookCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bookTitle: {
    color: COLORS.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.status.info + '20',
  },
  editButtonText: {
    color: COLORS.status.info,
    fontWeight: '600',
  },
  authorText: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  progressContainer: {
    marginBottom: SPACING.sm,
  },
  progressText: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.status.success,
    borderRadius: BORDER_RADIUS.full,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.status.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  completedText: {
    color: COLORS.status.success,
    fontWeight: '600',
    marginLeft: SPACING.xs,
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
  smallInput: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TEXT_STYLES.body,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background.primary,
    width: 80, // 4 karakter sığacak kadar küçük
    textAlign: 'center',
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

export default BooksScreen; 