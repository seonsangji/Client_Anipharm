import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import HomeScreen from './src/screens/Main/HomeScreen';
import PetProfileCreationScreen from './src/screens/Pet/PetProfileCreationScreen';
import PetSuccessScreen from './src/screens/Pet/PetSuccessScreen';
import { User } from './src/types/auth.types';
import { checkAuth } from './src/services/auth.service';

type Screen = 'login' | 'signup' | 'home' | 'petProfile' | 'petSuccess';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoginSuccess = (user: User) => {
    setUserData(user);
    setCurrentScreen('home');
  };

  // 앱 시작 시 저장된 토큰 확인
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token, user } = await checkAuth();
        if (token && user) {
          // 토큰과 사용자 정보가 있으면 자동 로그인
          setUserData(user);
          setCurrentScreen('home');
        } else {
          // 없으면 로그인 화면
          setCurrentScreen('login');
        }
      } catch (error) {
        console.error('인증 확인 실패:', error);
        setCurrentScreen('login');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // 로그아웃 이벤트 리스너 (401 에러 시 자동 로그아웃)
    const handleLogoutEvent = () => {
      setUserData(null);
      setCurrentScreen('login');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', handleLogoutEvent);
      return () => {
        window.removeEventListener('auth:logout', handleLogoutEvent);
      };
    }
  }, []);

  const handleLogout = async () => {
    const { logout } = await import('./src/services/auth.service');
    await logout();
    setUserData(null);
    setCurrentScreen('login');
  };

  const handleNavigateToPetProfile = () => {
    setCurrentScreen('petProfile');
  };

  const handlePetProfileBack = () => {
    setCurrentScreen('home');
  };

  const handlePetProfileSuccess = () => {
    setCurrentScreen('petSuccess');
  };

  const handlePetSuccessComplete = () => {
    setCurrentScreen('home');
  };

  // 로딩 중일 때 스플래시 화면 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8A3D" />
      </View>
    );
  }

  return (
    <>
      {currentScreen === 'login' ? (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentScreen('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : currentScreen === 'signup' ? (
        <SignUpScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      ) : currentScreen === 'petProfile' ? (
        <PetProfileCreationScreen
          onNavigateBack={handlePetProfileBack}
          onNavigateToSuccess={handlePetProfileSuccess}
        />
      ) : currentScreen === 'petSuccess' ? (
        <PetSuccessScreen
          onNavigateToHome={handlePetSuccessComplete}
        />
      ) : (
        <HomeScreen
          userData={userData}
          onLogout={handleLogout}
          onNavigateToPetProfile={handleNavigateToPetProfile}
        />
      )}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
