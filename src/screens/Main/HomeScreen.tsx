/**
 * HomeScreen
 * 로그인 후 메인 화면 (지도 기반)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../types/auth.types';

type TabType = 'home' | 'community' | 'chatbot' | 'journal' | 'profile';

interface HomeScreenProps {
  userData: User | null;
  onLogout: () => void;
  onNavigateToPetProfile?: () => void;
}

const HomeScreen = ({ userData, onLogout, onNavigateToPetProfile }: HomeScreenProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // 탭 변경 핸들러
  const handleTabChange = (tab: TabType) => {
    if (tab === 'profile' && onNavigateToPetProfile) {
      // 프로필 탭을 누르면 반려동물 프로필 등록 화면으로 이동
      onNavigateToPetProfile();
    } else {
      setActiveTab(tab);
    }
  };

  // 홈 탭 컨텐츠 렌더링
  const renderHomeContent = () => (
    <>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anipharm</Text>
      </View>

      {/* 검색 바 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={20} color="#999" />
        </View>
      </View>

      {/* 필터 버튼들 */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>영업중</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>심야 운영</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>주차가능</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 지도 영역 (임시) */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={60} color="#FF8A3D" />
        <Text style={styles.mapPlaceholderText}>지도 영역</Text>
        <Text style={styles.mapSubText}>지도 기능은 준비 중입니다</Text>
      </View>

      {/* 하단 정보 카드 */}
      <View style={styles.infoCard}>
        <View style={styles.infoCardHeader}>
          <Text style={styles.infoCardTitle}>행복동물약국</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>영업중</Text>
          </View>
        </View>
        <Text style={styles.infoCardAddress}>서울시 강남구 테헤란로 123</Text>
        <View style={styles.infoCardDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>09:00 - 12:00</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.detailText}>010-1234-1234</Text>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>700m</Text>
          <Text style={styles.distanceText}>1400mm</Text>
        </View>
        <TouchableOpacity style={styles.reserveButton}>
          <Text style={styles.reserveButtonText}>예약하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // 다른 탭 컨텐츠 렌더링
  const renderOtherTabContent = (tabName: string) => (
    <View style={styles.tabPlaceholder}>
      <Ionicons name="construct-outline" size={60} color="#FF8A3D" />
      <Text style={styles.tabPlaceholderText}>{tabName} 기능</Text>
      <Text style={styles.tabPlaceholderSubText}>준비 중입니다</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 컨텐츠 영역 */}
      <View style={styles.content}>
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'community' && renderOtherTabContent('커뮤니티')}
        {activeTab === 'chatbot' && renderOtherTabContent('챗봇')}
        {activeTab === 'journal' && renderOtherTabContent('일지')}
      </View>

      {/* 하단 네비게이션 바 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'home' ? '#FF8A3D' : '#999'}
          />
          <Text style={[
            styles.navText,
            activeTab === 'home' && styles.navTextActive
          ]}>
            홈
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange('community')}
        >
          <Ionicons
            name={activeTab === 'community' ? 'document-text' : 'document-text-outline'}
            size={24}
            color={activeTab === 'community' ? '#FF8A3D' : '#999'}
          />
          <Text style={[
            styles.navText,
            activeTab === 'community' && styles.navTextActive
          ]}>
            커뮤니티
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange('chatbot')}
        >
          <Ionicons
            name={activeTab === 'chatbot' ? 'chatbubbles' : 'chatbubbles-outline'}
            size={24}
            color={activeTab === 'chatbot' ? '#FF8A3D' : '#999'}
          />
          <Text style={[
            styles.navText,
            activeTab === 'chatbot' && styles.navTextActive
          ]}>
            챗봇
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange('journal')}
        >
          <Ionicons
            name={activeTab === 'journal' ? 'calendar' : 'calendar-outline'}
            size={24}
            color={activeTab === 'journal' ? '#FF8A3D' : '#999'}
          />
          <Text style={[
            styles.navText,
            activeTab === 'journal' && styles.navTextActive
          ]}>
            일지
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? '#FF8A3D' : '#999'}
          />
          <Text style={[
            styles.navText,
            activeTab === 'profile' && styles.navTextActive
          ]}>
            프로필
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FF8A3D',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    backgroundColor: '#FF8A3D',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#FFF5EF',
    borderColor: '#FF8A3D',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#FF8A3D',
    fontWeight: '600',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  mapSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  infoCardAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  infoCardDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  distanceContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  distanceText: {
    fontSize: 14,
    color: '#999',
  },
  reserveButton: {
    backgroundColor: '#FF8A3D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tabPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  tabPlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  tabPlaceholderSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#FF8A3D',
    fontWeight: '600',
  },
});

export default HomeScreen;
