/**
 * CareInboxScreen
 * 케어 관리 모드 대화 정리함 화면
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInboxList, deleteConversation, InboxItem } from '../../services/healthChatbot';

interface CareInboxScreenProps {
  petId: number;
  onNavigateBack: () => void;
  onNavigateToDetail?: (conversationId: number) => void;
}

const CareInboxScreen = ({
  petId,
  onNavigateBack,
  onNavigateToDetail,
}: CareInboxScreenProps) => {
  const [inboxList, setInboxList] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadInboxList();
  }, [petId]);

  const loadInboxList = async () => {
    try {
      setLoading(true);
      const response = await getInboxList(petId, 'care_management');

      if (response.success && response.data?.conversations) {
        setInboxList(response.data.conversations);
      } else {
        setInboxList([]);
      }
    } catch (error: any) {
      console.error('정리함 불러오기 실패:', error);
      Alert.alert(
        '오류',
        error.response?.data?.message || error.message || '정리함을 불러오는데 실패했습니다.'
      );
      setInboxList([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return '오늘';
    } else if (days === 1) {
      return '어제';
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  // 삭제 모드 토글
  const handleToggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedItems(new Set());
  };

  // 체크박스 토글
  const handleToggleSelect = (conversationId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(conversationId)) {
      newSelected.delete(conversationId);
    } else {
      newSelected.add(conversationId);
    }
    setSelectedItems(newSelected);
  };

  // 삭제 확인 모달 열기
  const handleDeletePress = () => {
    if (selectedItems.size === 0) {
      Alert.alert('알림', '삭제할 대화를 선택해주세요.');
      return;
    }
    setShowDeleteModal(true);
  };

  // 대화 삭제
  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    
    try {
      setDeleting(true);
      const deletePromises = Array.from(selectedItems).map((conversationId) =>
        deleteConversation(conversationId)
      );
      
      await Promise.all(deletePromises);
      
      // 삭제 성공 후 목록 새로고침
      await loadInboxList();
      setIsDeleteMode(false);
      setSelectedItems(new Set());
      
      Alert.alert('완료', '선택한 대화가 삭제되었습니다.');
    } catch (error: any) {
      console.error('대화 삭제 실패:', error);
      Alert.alert(
        '오류',
        error.response?.data?.message || error.message || '대화 삭제에 실패했습니다.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화 정리함</Text>
        <TouchableOpacity
          onPress={handleToggleDeleteMode}
          style={styles.deleteModeButton}
        >
          <Text style={styles.deleteModeButtonText}>
            {isDeleteMode ? '취소' : '🗑️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF8A3D" />
          </View>
        ) : inboxList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>아직 나눈 대화가 없어요!</Text>
          </View>
        ) : (
          <>
            {inboxList.map((item) => (
              <TouchableOpacity
                key={item.conversationId}
                style={[
                  styles.card,
                  isDeleteMode && selectedItems.has(item.conversationId) && styles.cardSelected,
                ]}
                onPress={() => {
                  if (isDeleteMode) {
                    handleToggleSelect(item.conversationId);
                  } else {
                    if (onNavigateToDetail) {
                      onNavigateToDetail(item.conversationId);
                    }
                  }
                }}
                activeOpacity={0.7}
              >
                {isDeleteMode && (
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        selectedItems.has(item.conversationId) && styles.checkboxChecked,
                      ]}
                    >
                      {selectedItems.has(item.conversationId) && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                  </View>
                )}
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardIcon}>
                      <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FF8A3D" />
                    </View>
                    <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.cardSummary} numberOfLines={3}>
                    {item.summary || '요약 정보가 없습니다.'}
                  </Text>
                  {!isDeleteMode && (
                    <View style={styles.cardFooter}>
                      <Ionicons name="chevron-forward" size={16} color="#999" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {isDeleteMode && (
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  selectedItems.size === 0 && styles.deleteButtonDisabled,
                ]}
                onPress={handleDeletePress}
                disabled={selectedItems.size === 0 || deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteButtonText}>삭제하기</Text>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* 삭제 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FF8A3D" />
            </View>
            <Text style={styles.modalTitle}>대화를 삭제하시겠습니까?</Text>
            <Text style={styles.modalMessage}>
              선택한 {selectedItems.size}개의 대화가 삭제됩니다.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmText}>삭제</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#FF8A3D',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteModeButton: {
    padding: 4,
    minWidth: 32,
    alignItems: 'flex-end',
  },
  deleteModeButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#FF8A3D',
    borderWidth: 2,
    backgroundColor: '#FFF5EF',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#FF8A3D',
    borderColor: '#FF8A3D',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardSummary: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  deleteButton: {
    backgroundColor: '#FF8A3D',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  deleteButtonDisabled: {
    backgroundColor: '#FFD4B8',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FF8A3D',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CareInboxScreen;

