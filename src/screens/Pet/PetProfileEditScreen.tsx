/**
 * PetProfileEditScreen
 * 반려동물 프로필 수정 화면
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getPet, updatePet } from '../../services/pet.service';
import {
  Pet,
  UpdatePetRequest,
  PetSpecies,
  HealthConcern,
  HEALTH_CONCERN_LABELS,
} from '../../types/pet.types';

interface PetProfileEditScreenProps {
  petId: number;
  onNavigateBack: () => void;
  onNavigateToSuccess: () => void;
}

const PetProfileEditScreen = ({
  petId,
  onNavigateBack,
  onNavigateToSuccess,
}: PetProfileEditScreenProps) => {
  // 기존 데이터
  const [originalPet, setOriginalPet] = useState<Pet | null>(null);

  // 입력 필드 상태
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [species, setSpecies] = useState<PetSpecies | ''>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [healthConcerns, setHealthConcerns] = useState<HealthConcern[]>([]);

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 에러 상태
  const [nameError, setNameError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');

  // 건강 고민 목록
  const healthConcernOptions: HealthConcern[] = [
    'dental',
    'joint',
    'skin',
    'eye',
    'kidney',
    'vomit',
    'aging',
    'nutrition',
    'heart',
    'obesity',
    'constipation',
    'immunity',
  ];

  /**
   * 반려동물 정보 불러오기
   */
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await getPet(petId);
        if (response.success) {
          const pet = response.data;
          setOriginalPet(pet);
          setName(pet.name);
          setBirthDate(pet.birthDate);
          setDate(new Date(pet.birthDate));
          setSpecies(pet.species);
          setProfileImage(pet.profileImageUrl || null);
          setHealthConcerns(pet.healthConcerns || []);
        }
      } catch (error: any) {
        console.error('반려동물 정보 조회 에러:', error);
        Alert.alert('오류', '반려동물 정보를 불러오는데 실패했습니다.', [
          {
            text: '확인',
            onPress: onNavigateBack,
          },
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  /**
   * 이름 유효성 검사
   */
  const validateName = (value: string): boolean => {
    if (!value || value.trim() === '') {
      setNameError('반려동물 이름을 입력해주세요.');
      return false;
    } else if (value.length > 10) {
      setNameError('이름은 최대 10자까지 입력 가능합니다.');
      return false;
    }
    setNameError('');
    return true;
  };

  /**
   * 생년월일 유효성 검사
   */
  const validateBirthDate = (value: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!value) {
      setBirthDateError('생년월일을 입력해주세요.');
      return false;
    } else if (!dateRegex.test(value)) {
      setBirthDateError('올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)');
      return false;
    }

    const birthDateObj = new Date(value);
    const today = new Date();
    if (birthDateObj > today) {
      setBirthDateError('생년월일은 오늘 이전 날짜여야 합니다.');
      return false;
    }

    setBirthDateError('');
    return true;
  };

  /**
   * 프로필 사진 선택
   */
  const handleImagePicker = () => {
    // TODO: 이미지 피커 구현 (expo-image-picker)
    Alert.alert('알림', '이미지 업로드 기능은 준비중입니다.');
  };

  /**
   * 종 선택
   */
  const handleSpeciesSelect = (selectedSpecies: PetSpecies) => {
    setSpecies(selectedSpecies);
  };

  /**
   * 건강 고민 토글
   */
  const toggleHealthConcern = (concern: HealthConcern) => {
    if (healthConcerns.includes(concern)) {
      setHealthConcerns(healthConcerns.filter((c) => c !== concern));
    } else {
      if (healthConcerns.length >= 5) {
        Alert.alert('알림', '건강 고민은 최대 5개까지 선택 가능합니다.');
        return;
      }
      setHealthConcerns([...healthConcerns, concern]);
    }
  };

  /**
   * 날짜 선택 처리
   */
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setBirthDate(formattedDate);
      setBirthDateError('');
    }
  };

  /**
   * 날짜 선택기 열기
   */
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  /**
   * 반려동물 정보 수정 처리
   */
  const handleUpdatePet = async () => {
    // 유효성 검사
    const isNameValid = validateName(name);
    const isBirthDateValid = validateBirthDate(birthDate);

    if (!species) {
      Alert.alert('알림', '반려동물 종을 선택해주세요.');
      return;
    }

    if (!isNameValid || !isBirthDateValid) {
      return;
    }

    setLoading(true);

    try {
      const requestData: UpdatePetRequest = {
        name: name.trim(),
        species,
        birthDate,
        profileImageUrl: profileImage || undefined,
        healthConcerns,
      };

      const response = await updatePet(petId, requestData);

      if (response.success) {
        Alert.alert('수정 완료', '반려동물 정보가 수정되었습니다.', [
          {
            text: '확인',
            onPress: onNavigateBack,
          },
        ]);
      }
    } catch (error: any) {
      console.error('반려동물 수정 에러:', error);

      let errorMessage = '반려동물 정보 수정에 실패했습니다.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('수정 실패', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 버튼 활성화 여부
   */
  const isButtonEnabled = (): boolean => {
    return name.length > 0 && birthDate.length > 0 && species !== '';
  };

  // 로딩 중
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8A3D" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>반려동물 수정</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* 사진 업로드 */}
          <View style={styles.section}>
            <Text style={styles.label}>사진</Text>
            <TouchableOpacity
              style={styles.imagePickerContainer}
              onPress={handleImagePicker}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultImageContainer}>
                  <Ionicons name="paw" size={40} color="#999" />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 이름 */}
          <View style={styles.section}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="10자 이내로 입력해주세요."
              placeholderTextColor="#999"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) validateName(text);
              }}
              maxLength={10}
              editable={!loading}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* 생년월일 */}
          <View style={styles.section}>
            <Text style={styles.label}>생년월일</Text>
            <TouchableOpacity
              style={[styles.dateInput, birthDateError ? styles.inputError : null]}
              onPress={openDatePicker}
              disabled={loading}
            >
              <Text style={[styles.dateText, !birthDate && styles.placeholder]}>
                {birthDate || 'YYYY-MM-DD'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#999" />
            </TouchableOpacity>
            {birthDateError ? <Text style={styles.errorText}>{birthDateError}</Text> : null}

            {/* DateTimePicker */}
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* 종류 */}
          <View style={styles.section}>
            <Text style={styles.label}>종류</Text>
            <View style={styles.speciesContainer}>
              <TouchableOpacity
                style={[
                  styles.speciesButton,
                  species === '강아지' && styles.speciesButtonActive,
                ]}
                onPress={() => handleSpeciesSelect('강아지')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.speciesButtonText,
                    species === '강아지' && styles.speciesButtonTextActive,
                  ]}
                >
                  강아지
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.speciesButton,
                  species === '고양이' && styles.speciesButtonActive,
                ]}
                onPress={() => handleSpeciesSelect('고양이')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.speciesButtonText,
                    species === '고양이' && styles.speciesButtonTextActive,
                  ]}
                >
                  고양이
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 건강 고민 */}
          <View style={styles.section}>
            <Text style={styles.label}>건강고민(최대 5가지까지 가능)</Text>
            <View style={styles.healthConcernsContainer}>
              {healthConcernOptions.map((concern) => (
                <TouchableOpacity
                  key={concern}
                  style={[
                    styles.healthConcernChip,
                    healthConcerns.includes(concern) && styles.healthConcernChipActive,
                  ]}
                  onPress={() => toggleHealthConcern(concern)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.healthConcernChipText,
                      healthConcerns.includes(concern) &&
                        styles.healthConcernChipTextActive,
                    ]}
                  >
                    {HEALTH_CONCERN_LABELS[concern]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isButtonEnabled() || loading ? styles.submitButtonDisabled : null,
          ]}
          onPress={handleUpdatePet}
          disabled={!isButtonEnabled() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>저장하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  imagePickerContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    position: 'relative',
  },
  defaultImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF8A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  dateInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 6,
  },
  speciesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  speciesButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  speciesButtonActive: {
    borderColor: '#FF8A3D',
    borderWidth: 2,
    backgroundColor: '#FFF5EF',
  },
  speciesButtonText: {
    fontSize: 16,
    color: '#666',
  },
  speciesButtonTextActive: {
    fontSize: 16,
    color: '#FF8A3D',
    fontWeight: '600',
  },
  healthConcernsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  healthConcernChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  healthConcernChipActive: {
    borderColor: '#FF8A3D',
    borderWidth: 1.5,
    backgroundColor: '#FFF5EF',
  },
  healthConcernChipText: {
    fontSize: 14,
    color: '#666',
  },
  healthConcernChipTextActive: {
    fontSize: 14,
    color: '#FF8A3D',
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#FF8A3D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#FFD4B8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PetProfileEditScreen;
