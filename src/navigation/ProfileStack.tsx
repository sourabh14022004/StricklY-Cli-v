import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../components/screens/ProfileScreen';
import AccountScreen from '../components/screens/profile/AccountScreen';
import PermissionsScreen from '../components/screens/profile/PermissionsScreen';
import FocusPreferencesScreen from '../components/screens/profile/FocusPreferencesScreen';
import NotificationRulesScreen from '../components/screens/profile/NotificationRulesScreen';
import AppearanceScreen from '../components/screens/profile/AppearanceScreen';
import StreakProductivityScreen from '../components/screens/profile/StreakProductivityScreen';
import PrivacySecurityScreen from '../components/screens/profile/PrivacySecurityScreen';
import AboutScreen from '../components/screens/profile/AboutScreen';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Account: undefined;
  Permissions: undefined;
  FocusPreferences: undefined;
  NotificationRules: undefined;
  Appearance: undefined;
  StreakProductivity: undefined;
  PrivacySecurity: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
      />
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
      />
      <Stack.Screen 
        name="Permissions" 
        component={PermissionsScreen}
      />
      <Stack.Screen 
        name="FocusPreferences" 
        component={FocusPreferencesScreen}
      />
      <Stack.Screen 
        name="NotificationRules" 
        component={NotificationRulesScreen}
      />
      <Stack.Screen 
        name="Appearance" 
        component={AppearanceScreen}
      />
      <Stack.Screen 
        name="StreakProductivity" 
        component={StreakProductivityScreen}
      />
      <Stack.Screen 
        name="PrivacySecurity" 
        component={PrivacySecurityScreen}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
export { ProfileStackNavigator };

