/**
 * Auth 관련 타입 정의
 */

// 회원가입 요청 타입
export interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 사용자 정보 타입
export interface User {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  profileShape: 'circle' | 'square';
  isEmailVerified: boolean;
  bio?: string;
  locationCity?: string;
  locationDistrict?: string;
}

// 회원가입 응답 타입
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

// 로그인 응답 타입
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// API 에러 응답 타입
export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// 이메일/닉네임 중복 확인 응답 타입
export interface CheckAvailabilityResponse {
  success: boolean;
  available: boolean;
  message: string;
}
