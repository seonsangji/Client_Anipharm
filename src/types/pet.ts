/**
 * Pet 관련 타입 정의
 */

// 반려동물 종
export type PetSpecies = '강아지' | '고양이';

// 반려동물 성별
export type PetGender = 'male' | 'female' | 'neutered_male' | 'neutered_female';

// 건강 고민 타입
export type HealthConcern =
  | 'dental'      // 치아/구강
  | 'joint'       // 뼈 관절
  | 'skin'        // 피부/미모
  | 'eye'         // 눈
  | 'kidney'      // 신장/요로
  | 'vomit'       // 구토
  | 'aging'       // 노화
  | 'nutrition'   // 영양
  | 'heart'       // 심장
  | 'obesity'     // 비만
  | 'constipation' // 변비
  | 'immunity';   // 면역력

// 건강 고민 라벨
export const HEALTH_CONCERN_LABELS: Record<HealthConcern, string> = {
  dental: '치아/구강',
  joint: '뼈 관절',
  skin: '피부/미모',
  eye: '눈',
  kidney: '신장/요로',
  vomit: '구토',
  aging: '노화',
  nutrition: '영양',
  heart: '심장',
  obesity: '비만',
  constipation: '변비',
  immunity: '면역력',
};

// 반려동물 정보
export interface Pet {
  petId: number;
  userId: number;
  name: string;
  species: PetSpecies;
  breed?: string;
  gender?: PetGender;
  birthDate: string; // YYYY-MM-DD
  weight?: number;
  profileImageUrl?: string;
  isPrimary: boolean;
  displayOrder: number;
  healthConcerns: HealthConcern[];
  createdAt: string;
  updatedAt: string;
}

// 반려동물 등록 요청
export interface CreatePetRequest {
  name: string;
  species: PetSpecies;
  birthDate: string; // YYYY-MM-DD
  breed?: string;
  gender?: PetGender;
  weight?: number;
  profileImageUrl?: string;
  healthConcerns?: HealthConcern[];
}

// 반려동물 수정 요청
export interface UpdatePetRequest {
  name?: string;
  species?: PetSpecies;
  birthDate?: string;
  breed?: string;
  gender?: PetGender;
  weight?: number;
  profileImageUrl?: string;
  healthConcerns?: HealthConcern[];
}

// 반려동물 등록/수정 응답
export interface PetResponse {
  success: boolean;
  message: string;
  data: Pet;
}

// 반려동물 목록 응답
export interface PetsResponse {
  success: boolean;
  data: Pet[];
}

// 반려동물 삭제 응답
export interface DeletePetResponse {
  success: boolean;
  message: string;
}
