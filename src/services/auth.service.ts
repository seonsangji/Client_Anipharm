/**
 * Auth Service
 * 인증 관련 API 호출 함수들
 */

import apiClient from './api.service';
import { API_CONFIG } from '../config/api.config';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  CheckAvailabilityResponse,
  User,
} from '../types/auth.types';
import { saveToken, saveUserData, clearAuthData } from '../utils/storage';

/**
 * 회원가입
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    data
  );
  console.log('회원가입 데이터 :', response)
  return response.data;
};

/**
 * 로그인
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    data
  );
  console.log('로그인 데이터 확인:',response.data)
  
  // 로그인 성공 시 토큰과 사용자 정보 저장
  if (response.data.success && response.data.data) {
    await saveToken(response.data.data.token);
    await saveUserData(response.data.data.user);
  }
  
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
  } finally {
    // API 호출 성공 여부와 관계없이 로컬 저장소 정리
    await clearAuthData();
  }
};

/**
 * 저장된 토큰으로 사용자 정보 확인
 */
export const checkAuth = async (): Promise<{ token: string | null; user: User | null }> => {
  const { getToken, getUserData } = await import('../utils/storage');
  const token = await getToken();
  const user = await getUserData();
  return { token, user };
};

/**
 * 이메일 중복 확인
 */
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<CheckAvailabilityResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH.CHECK_EMAIL}?email=${email}`
    );
    return response.data.available;
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error);
    return false;
  }
};

/**
 * 닉네임 중복 확인
 */
export const checkNicknameAvailability = async (nickname: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<CheckAvailabilityResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH.CHECK_NICKNAME}?nickname=${nickname}`
    );
    return response.data.available;
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error);
    return false;
  }
};

// 소셜 로그인은 추후 구현
export const kakaoLogin = async (): Promise<LoginResponse> => {
  // TODO: 카카오 OAuth 로그인 구현
  throw new Error('Not implemented');
};

export const naverLogin = async (): Promise<LoginResponse> => {
  // TODO: 네이버 OAuth 로그인 구현
  throw new Error('Not implemented');
};
