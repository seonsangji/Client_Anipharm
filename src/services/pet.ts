/**
 * Pet Service
 * 반려동물 관련 API 호출 함수들
 */

import apiClient from './api';
import { API_CONFIG } from '../config/api';
import {
  CreatePetRequest,
  UpdatePetRequest,
  PetResponse,
  PetsResponse,
  DeletePetResponse,
} from '../types/pet';

/**
 * 반려동물 목록 조회
 */
export const getPets = async (): Promise<PetsResponse> => {
  const response = await apiClient.get<PetsResponse>(
    API_CONFIG.ENDPOINTS.PETS.LIST
  );
  return response.data;
};

/**
 * 반려동물 상세 조회
 */
export const getPet = async (petId: number): Promise<PetResponse> => {
  const response = await apiClient.get<PetResponse>(
    API_CONFIG.ENDPOINTS.PETS.DETAIL(petId)
  );
  return response.data;
};

/**
 * 반려동물 등록
 */
export const createPet = async (data: CreatePetRequest): Promise<PetResponse> => {
  const response = await apiClient.post<PetResponse>(
    API_CONFIG.ENDPOINTS.PETS.CREATE,
    data
  );
  return response.data;
};

/**
 * 반려동물 정보 수정
 */
export const updatePet = async (
  petId: number,
  data: UpdatePetRequest
): Promise<PetResponse> => {
  const response = await apiClient.put<PetResponse>(
    API_CONFIG.ENDPOINTS.PETS.UPDATE(petId),
    data
  );
  return response.data;
};

/**
 * 반려동물 삭제
 */
export const deletePet = async (petId: number): Promise<DeletePetResponse> => {
  const response = await apiClient.delete<DeletePetResponse>(
    API_CONFIG.ENDPOINTS.PETS.DELETE(petId)
  );
  return response.data;
};

/**
 * 대표 반려동물 설정
 */
export const setPrimaryPet = async (petId: number): Promise<PetResponse> => {
  const response = await apiClient.patch<PetResponse>(
    API_CONFIG.ENDPOINTS.PETS.SET_PRIMARY(petId)
  );
  return response.data;
};
