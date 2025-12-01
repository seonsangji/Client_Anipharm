/**
 * PetSuccessScreen
 * 반려동물 등록 완료 화면
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PetSuccessScreenProps {
  onNavigateToHome: () => void;
}

const PetSuccessScreen = ({
  onNavigateToHome,
}: PetSuccessScreenProps) => {
  return (
    <View style={styles.container}>
      {/* 컨텐츠 */}
      <View style={styles.content}>
        {/* 성공 아이콘 */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>

        {/* 메시지 */}
        <Text style={styles.message}>등록이 완료되었습니다.</Text>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNavigateToHome}
        >
          <Text style={styles.nextButtonText}>홈으로 이동</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF8A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  nextButton: {
    height: 56,
    backgroundColor: '#FF8A3D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PetSuccessScreen;
