import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import WelcomeScreen from './src/components/WelcomeScreen';
import LoginScreen from './src/components/LoginScreen';
import SignUpScreen from './src/components/SignUpScreen';
import MainAppScreen from './src/components/MainAppScreen';
import LoadingModal from './src/modals/LoadingModal';

type Screen = 'welcome' | 'login' | 'signup';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();

  // Reset to welcome screen when user signs out
  useEffect(() => {
    if (!user && !loading) {
      setCurrentScreen('welcome');
    }
  }, [user, loading]);

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const navigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const isAuthScreen = !user && (currentScreen === 'welcome' || currentScreen === 'login' || currentScreen === 'signup');

  // Show loading modal while checking authentication or during auth operations
  if (isAuthScreen) {
    // Use SafeAreaView for auth screens (welcome, login, signup)
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
        <NavigationContainer>
          <StatusBar barStyle="default" />
          <LoadingModal visible={loading} message="Please wait..." />
          {!loading && (
            <>
              {currentScreen === 'welcome' ? (
                <WelcomeScreen navigation={{ navigate: (screen: string) => {
                  if (screen === 'login') navigateToLogin();
                }}} />
              ) : currentScreen === 'login' ? (
                <LoginScreen navigation={{ navigate: (screen: string) => {
                  if (screen === 'welcome') navigateToWelcome();
                  else if (screen === 'signup') navigateToSignUp();
                }}} />
              ) : (
                <SignUpScreen navigation={{ navigate: (screen: string) => {
                  if (screen === 'login') navigateToLogin();
                  else if (screen === 'welcome') navigateToWelcome();
                }}} />
              )}
            </>
          )}
        </NavigationContainer>
      </SafeAreaView>
    );
  }

  // Use SafeAreaView for main app with proper safe area handling
  return (
    <View style={{ flex: 1, backgroundColor: '#1A0B2E' }}>
      {/* Top safe area */}
      <View style={{ height: insets.top, backgroundColor: '#1A0B2E' }} />
      
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Left safe area */}
        <View style={{ width: insets.left, backgroundColor: '#1A0B2E' }} />
        
        {/* Main content */}
        <View style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar barStyle="light-content" />
            <LoadingModal visible={loading} message="Please wait..." />
            {!loading && (
              <>
                {/* If user is authenticated, show main app */}
                {user && <MainAppScreen />}
              </>
            )}
          </NavigationContainer>
        </View>
        
        {/* Right safe area */}
        <View style={{ width: insets.right, backgroundColor: '#1A0B2E' }} />
      </View>
      
      {/* Bottom safe area */}
      <View style={{ height: insets.bottom, backgroundColor: '#000000' }} />
    </View>
  );

}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
