/**
 * Pharmacy Types
 * 동물약국 관련 타입 정의
 */

export interface VeterinaryPharmacy {
  pharmacyId: number;
  name: string;
  phone?: string;
  address: string;
  addressDetail?: string;
  latitude: number;
  longitude: number;
  isLateNight: boolean;
  ratingAverage?: number;
  reviewCount?: number;
  distance?: number; // km 단위 (주변 검색 시 포함)
  createdAt?: string;
  updatedAt?: string;
}

export interface PharmacyMarker {
  id: number;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  address: string;
  phone?: string;
  isLateNight: boolean;
}

export interface NearbyPharmaciesResponse {
  success: boolean;
  data: VeterinaryPharmacy[];
}

export interface PharmacyMarkersResponse {
  success: boolean;
  data: PharmacyMarker[];
}

