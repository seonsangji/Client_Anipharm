# 회원가입 기능 구현 완료

## 구현된 기능

### 1. 이메일/비밀번호 기반 일반 회원가입

회원가입 화면(`SignUpScreen.tsx`)에서 다음 기능을 제공합니다:

- 이메일 입력 및 유효성 검증
- 비밀번호 입력 및 강도 검증 (8자 이상, 영문+숫자+특수문자)
- 비밀번호 확인
- 닉네임 입력 및 유효성 검증 (2-20자, 한글/영문/숫자/언더스코어)
- 실시간 에러 메시지 표시
- 로딩 상태 처리

## 파일 구조

```
Client_Anipharm/
├── src/
│   ├── config/
│   │   └── api.config.ts          # API 엔드포인트 설정
│   ├── types/
│   │   └── auth.types.ts          # 인증 관련 타입 정의
│   ├── services/
│   │   ├── api.service.ts         # Axios 인스턴스 및 인터셉터
│   │   └── auth.service.ts        # 인증 API 호출 함수
│   └── screens/
│       └── Auth/
│           └── SignUpScreen.tsx   # 회원가입 화면
└── App.tsx                        # 메인 앱 (현재 SignUpScreen 표시)
```

## API 엔드포인트

백엔드 서버(`Server_Anipharm`)와 연동되는 엔드포인트:

- `POST /api/auth/register` - 회원가입
  - 요청: `{ email, password, passwordConfirm, nickname }`
  - 응답: `{ success, message, data: { user } }`

## 백엔드 연동 정보

### 서버 주소 설정

`src/config/api.config.ts`에서 백엔드 서버 주소를 설정합니다:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'  // 개발 환경
  : 'https://your-production-api.com/api';  // 프로덕션 환경
```

### 필드명 매핑

백엔드 User 모델의 필드명과 일치하도록 설정되어 있습니다:
- `email` → `email`
- `password` → `passwordHash` (백엔드에서 암호화 처리)
- `nickname` → `nickname`
- `userId` → `user_id` (응답)

## 실행 방법

1. 백엔드 서버 실행:
```bash
cd Server_Anipharm
npm run dev
```

2. 프론트엔드 실행:
```bash
cd Client_Anipharm
npm start
```

3. iOS 시뮬레이터 또는 Android 에뮬레이터에서 앱 실행

## 유효성 검증 규칙

### 이메일
- 이메일 형식 검증 (정규표현식)

### 비밀번호
- 최소 8자 이상
- 영문, 숫자, 특수문자 각 1개 이상 포함

### 닉네임
- 2-20자
- 한글, 영문, 숫자, 언더스코어(_)만 사용 가능

## 에러 처리

### 클라이언트 측 에러
- 입력값 유효성 검증 실패 시 실시간 에러 메시지 표시

### 서버 측 에러
- 409: 이메일 또는 닉네임 중복
- 400: 입력값 검증 실패
- 500: 서버 오류

## 향후 구현 예정

1. **이메일 중복 확인** (실시간)
   - `checkEmailAvailability()` 함수 활용

2. **닉네임 중복 확인** (실시간)
   - `checkNicknameAvailability()` 함수 활용

3. **네이버 OAuth2 인증**
   - `naverLogin()` 함수 구현 필요

4. **카카오 OAuth2 인증**
   - `kakaoLogin()` 함수 구현 필요

5. **토큰 저장 및 관리**
   - AsyncStorage를 이용한 JWT 토큰 저장
   - API 요청 시 자동으로 토큰 헤더 추가

6. **네비게이션 연동**
   - React Navigation 설치 및 설정
   - 회원가입 성공 시 로그인 화면으로 이동

## 주의사항

### iOS 시뮬레이터에서 localhost 접속
iOS 시뮬레이터에서는 `localhost`로 접속 가능하지만, 실제 iOS 기기에서는 컴퓨터의 로컬 IP 주소를 사용해야 합니다.

예: `http://192.168.0.10:3000/api`

### Android 에뮬레이터에서 localhost 접속
Android 에뮬레이터에서는 `10.0.2.2`를 사용하여 호스트 머신의 localhost에 접속합니다.

예: `http://10.0.2.2:3000/api`

필요시 `api.config.ts`를 수정하여 플랫폼별로 다른 URL을 사용할 수 있습니다.
