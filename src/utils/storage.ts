/**
 * Storage Utility
 * AsyncStorage를 사용한 토큰 및 사용자 정보 저장/로드
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
};

/**
 * 토큰 저장
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
    throw error;
  }
};

/**
 * 토큰 로드
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('토큰 로드 실패:', error);
    return null;
  }
};

/**
 * 토큰 삭제
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
};

/**
 * 사용자 정보 저장
 */
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('사용자 정보 저장 실패:', error);
    throw error;
  }
};

/**
 * 사용자 정보 로드
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);
    return null;
  }
};

/**
 * 사용자 정보 삭제
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('사용자 정보 삭제 실패:', error);
  }
};

/**
 * 모든 인증 정보 삭제 (로그아웃)
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
  } catch (error) {
    console.error('인증 정보 삭제 실패:', error);
  }
};

