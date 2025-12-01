import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import HomeScreen from './src/screens/Main/HomeScreen';
import PetProfileCreationScreen from './src/screens/Pet/PetProfileCreationScreen';
import PetSuccessScreen from './src/screens/Pet/PetSuccessScreen';
import { User } from './src/types/auth.types';

type Screen = 'login' | 'signup' | 'home' | 'petProfile' | 'petSuccess';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userData, setUserData] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setUserData(user);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
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
