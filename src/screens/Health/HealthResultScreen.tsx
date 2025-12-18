/**
 * HealthResultScreen
 * 트리아지 결과 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { endConversation } from '../../services/healthChatbot';

interface HealthResultScreenProps {
  petId: number;
  healthCheckId: number;
  assessment: {
    triage_level: 'BLUE' | 'GREEN' | 'AMBER' | 'RED';
    recommended_actions: string[];
    health_check_summary: string;
  };
  onNavigateBack: () => void;
  onSaveReport?: () => void;
}

const TRIAGE_CONFIG = {
  BLUE: {
    label: '양호',
    color: '#4A90E2',
    backgroundColor: '#E8F4FD',
    icon: 'checkmark-circle',
    description: '현재 상태는 양호합니다.',
  },
  GREEN: {
    label: '주의',
    color: '#50C878',
    backgroundColor: '#E8F8F0',
    icon: 'alert-circle',
    description: '주의가 필요합니다.',
  },
  AMBER: {
    label: '상담 권고',
    color: '#FFA500',
    backgroundColor: '#FFF8E1',
    icon: 'warning',
    description: '동물병원 상담을 권고합니다.',
  },
  RED: {
    label: '즉시 내원',
    color: '#FF4444',
    backgroundColor: '#FFEBEE',
    icon: 'alert',
    description: '즉시 동물병원에 내원하세요.',
  },
};

const HealthResultScreen = ({
  petId,
  healthCheckId,
  assessment,
  onNavigateBack,
  onSaveReport,
}: HealthResultScreenProps) => {
  const [saving, setSaving] = useState(false);
  const config = TRIAGE_CONFIG[assessment.triage_level];

  const handleSaveReport = async () => {
    try {
      setSaving(true);
      const response = await endConversation({
        petId,
        conversationType: 'health_status',
        healthCheckId,
        saveReport: true,
      });

      if (response.success) {
        Alert.alert('알림', '리포트가 저장되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              if (onSaveReport) {
                onSaveReport();
              }
              onNavigateBack();
            },
          },
        ]);
      } else {
        throw new Error(response.message || '리포트 저장에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('리포트 저장 실패:', error);
      Alert.alert(
        '오류',
        error.response?.data?.message || error.message || '리포트 저장에 실패했습니다.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>건강 평가 결과</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 트리아지 카드 */}
        <View style={[styles.triageCard, { backgroundColor: config.backgroundColor }]}>
          <View style={styles.triageIconContainer}>
            <Ionicons name={config.icon as any} size={48} color={config.color} />
          </View>
          <Text style={[styles.triageLevel, { color: config.color }]}>
            {config.label}
          </Text>
          <Text style={styles.triageDescription}>{config.description}</Text>
        </View>

        {/* 건강 체크 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>건강 체크 요약</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{assessment.health_check_summary}</Text>
          </View>
        </View>

        {/* 권장 조치사항 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>권장 조치사항</Text>
          {assessment.recommended_actions.map((action, index) => (
            <View key={index} style={styles.actionCard}>
              <View style={styles.actionNumber}>
                <Text style={styles.actionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </View>

        {/* 면책 문구 */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.disclaimerText}>
            본 서비스는 정보 제공이며, 진단·처방·향량 안내를 하지 않습니다.{'\n'}
            반려동물의 건강에 이상이 있다면 반드시 동물병원을 방문하세요.
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveReport}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>리포트 저장</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onNavigateBack}
          disabled={saving}
        >
          <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  triageCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  triageIconContainer: {
    marginBottom: 12,
  },
  triageLevel: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  triageDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'flex-start',
  },
  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF8A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  actionNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
    gap: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#FF8A3D',
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#FFD4B8',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HealthResultScreen;

