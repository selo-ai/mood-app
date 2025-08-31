import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  ArrowLeft, 
  Plus,
  ShoppingBag,
  Trash2,
  Edit3
} from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';
import { useAppStore } from '../store/useAppStore';
import Toast from '../components/Toast';
import { ShoppingList } from '../types';

type ShoppingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Shopping'>;

const ShoppingScreen: React.FC = () => {
  const navigation = useNavigation<ShoppingScreenNavigationProp>();
  const { shoppingLists, addShoppingList, deleteShoppingList, addShoppingItem, toggleShoppingItem, updateShoppingList, deleteShoppingItem, replaceShoppingListItems } = useAppStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newItemsText, setNewItemsText] = useState('');
  const [newListNotes, setNewListNotes] = useState('');
  const [editListName, setEditListName] = useState('');
  const [editItemsText, setEditItemsText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleAddList = () => {
    if (!newListName.trim()) {
      Alert.alert('Hata', 'Lütfen liste adı girin');
      return;
    }

    if (!newItemsText.trim()) {
      Alert.alert('Hata', 'Lütfen en az bir ürün girin');
      return;
    }

    // Listeyi oluştur ve ID'sini al
    const listId = addShoppingList(newListName.trim());
    
    // Ürünleri satır satır ayır ve ekle
    const items = newItemsText.trim().split('\n').filter(item => item.trim());
    items.forEach(item => {
      addShoppingItem(listId, item.trim());
    });

    setShowAddModal(false);
    setNewListName('');
    setNewItemsText('');
    setNewListNotes('');
    
    setToastMessage('Alışveriş listesi oluşturuldu!');
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteList = (list: ShoppingList) => {
    Alert.alert(
      'Listeyi Sil',
      `"${list.name}" listesini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteShoppingList(list.id);
            setToastMessage('Liste silindi!');
            setToastType('success');
            setShowToast(true);
          },
        },
      ]
    );
  };

  const handleShowItems = (list: ShoppingList) => {
    setSelectedList(list);
    setShowItemsModal(true);
  };

  // Güncel listeyi al
  const getCurrentList = () => {
    if (!selectedList) return undefined;
    return shoppingLists.find(list => list.id === selectedList.id) || selectedList;
  };

  const handleToggleItem = (listId: string, itemId: string) => {
    toggleShoppingItem(listId, itemId);
  };

  const handleEditList = (list: ShoppingList) => {
    setSelectedList(list);
    setEditListName(list.name);
    setEditItemsText(list.items.map(item => item.name).join('\n'));
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedList || !editListName.trim()) {
      Alert.alert('Hata', 'Lütfen liste adı girin');
      return;
    }

    // Liste adını güncelle
    updateShoppingList(selectedList.id, { name: editListName.trim() });

    // Yeni ürünleri ekle
    const newItems = editItemsText.trim().split('\n').filter(item => item.trim());
    replaceShoppingListItems(selectedList.id, newItems);

    setShowEditModal(false);
    setEditListName('');
    setEditItemsText('');
    
    setToastMessage('Liste güncellendi!');
    setToastType('success');
    setShowToast(true);
  };

  const getCompletedItemsCount = (list: ShoppingList) => {
    return list.items.filter(item => item.isCompleted).length;
  };

  const getTotalItemsCount = (list: ShoppingList) => {
    return list.items.length;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Tarih yok';
    
    try {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.warn('Invalid date:', date);
      return 'Geçersiz tarih';
    }
  };

  const renderItemsModal = () => {
    const currentList = getCurrentList();
    if (!currentList) {
      return (
        <View>
          <Text style={styles.modalTitle}>🛒 Liste Yükleniyor...</Text>
          <View style={styles.itemsList}>
            <Text style={[styles.emptyItemsText, TEXT_STYLES.body]}>
              Liste yükleniyor...
            </Text>
          </View>
        </View>
      );
    }
    
    return (
      <View>
        <Text style={styles.modalTitle}>🛒 {currentList.name}</Text>
        
        <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
          {currentList.items.length === 0 ? (
            <Text style={[styles.emptyItemsText, TEXT_STYLES.body]}>
              Henüz ürün eklenmemiş
            </Text>
          ) : (
            currentList.items.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemRow}
                onPress={() => handleToggleItem(currentList.id, item.id)}
              >
                <Text style={[
                  styles.itemText,
                  TEXT_STYLES.body,
                  item.isCompleted && styles.itemTextCompleted
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
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
            <ShoppingBag width={32} height={32} color={COLORS.neutral[600]} />
          </View>
          <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>ALIŞVERİŞ</Text>
          <Text style={[styles.dateText, TEXT_STYLES.body]}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Lists Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.h3]}>Alışveriş Listeleri</Text>
          
          {shoppingLists.length === 0 ? (
            <View style={styles.emptyState}>
              <ShoppingBag width={64} height={64} color={COLORS.neutral[400]} />
              <Text style={[styles.emptyStateText, TEXT_STYLES.body]}>
                Henüz alışveriş listesi yok
              </Text>
              <Text style={[styles.emptyStateSubtext, TEXT_STYLES.caption]}>
                İlk listenizi oluşturmak için aşağıdaki butona tıklayın
              </Text>
            </View>
          ) : (
            <View style={styles.listsContainer}>
              {shoppingLists.map((list) => (
                <TouchableOpacity
                  key={list.id}
                  style={styles.listCard}
                  onPress={() => handleShowItems(list)}
                >
                  <View style={styles.listInfo}>
                    <Text style={[styles.listName, TEXT_STYLES.body]}>
                      {list.name}
                    </Text>
                    <Text style={[styles.listStats, TEXT_STYLES.caption]}>
                      {getCompletedItemsCount(list)}/{getTotalItemsCount(list)} tamamlandı
                    </Text>
                    <Text style={[styles.listDate, TEXT_STYLES.caption]}>
                      {formatDate(list.createdAt)}
                    </Text>
                  </View>
                  
                  <View style={styles.listActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditList(list)}
                    >
                      <Edit3 width={16} height={16} color={COLORS.neutral[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteList(list)}
                    >
                      <Trash2 width={16} height={16} color={COLORS.status.error} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Add List Button */}
      <TouchableOpacity
        style={styles.fixedAddButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus width={24} height={24} color={COLORS.text.inverse} />
        <Text style={[styles.addButtonText, TEXT_STYLES.button]}>
          Liste Ekle
        </Text>
      </TouchableOpacity>

      {/* Add List Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setShowAddModal(false)}
        >
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>🛒 Yeni Alışveriş Listesi</Text>
            
            <Text style={styles.label}>Liste Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Haftalık Alışveriş"
              placeholderTextColor={COLORS.text.tertiary}
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
            />

            <Text style={styles.label}>Ürünler (Her satıra bir ürün):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Süt\nEkmek\nElma\nDomates"
              placeholderTextColor={COLORS.text.tertiary}
              value={newItemsText}
              onChangeText={setNewItemsText}
              multiline
              numberOfLines={6}
            />

            <Text style={styles.label}>Notlar (İsteğe bağlı):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Örn: Organik ürünler tercih et"
              placeholderTextColor={COLORS.text.tertiary}
              value={newListNotes}
              onChangeText={setNewListNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.secondary }]}>
                  İptal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddList}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.inverse }]}>
                  Oluştur
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Items Modal */}
      <Modal
        visible={showItemsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowItemsModal(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setShowItemsModal(false)}
        >
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => {}}
          >
            {renderItemsModal()}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowItemsModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.secondary }]}>
                  Kapat
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Edit List Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setShowEditModal(false)}
        >
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>✏️ Liste Düzenle</Text>
            
            <Text style={styles.label}>Liste Adı:</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Haftalık Alışveriş"
              placeholderTextColor={COLORS.text.tertiary}
              value={editListName}
              onChangeText={setEditListName}
              autoFocus
            />

            <Text style={styles.label}>Ürünler (Her satıra bir ürün):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Süt\nEkmek\nElma\nDomates"
              placeholderTextColor={COLORS.text.tertiary}
              value={editItemsText}
              onChangeText={setEditItemsText}
              multiline
              numberOfLines={6}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.secondary }]}>
                  İptal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.text.inverse }]}>
                  Kaydet
                </Text>
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
  scrollViewContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2,
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
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl * 2,
  },
  emptyStateText: {
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  listsContainer: {
    gap: SPACING.sm,
  },
  listCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  listStats: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  listDate: {
    color: COLORS.text.tertiary,
  },
  listActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral[100],
  },
  addButton: {
    backgroundColor: COLORS.neutral[600],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  fixedAddButton: {
    backgroundColor: COLORS.neutral[600],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
    right: SPACING.md,
  },
  addButtonText: {
    color: COLORS.text.inverse,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    margin: SPACING.md,
    width: '90%',
    maxWidth: 400,
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
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
    marginBottom: SPACING.lg,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.neutral[200],
  },
  saveButton: {
    backgroundColor: COLORS.neutral[600],
  },
  modalButtonText: {
    ...TEXT_STYLES.button,
    fontWeight: '600',
  },
  itemsList: {
    maxHeight: 300,
    marginBottom: SPACING.lg,
  },
  itemRow: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  itemText: {
    color: COLORS.text.primary,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.text.secondary,
  },
  emptyItemsText: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ShoppingScreen;
