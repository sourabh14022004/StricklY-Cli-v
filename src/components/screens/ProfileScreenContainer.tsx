import React, { useState } from 'react';
import ProfileScreen from './ProfileScreen';
import AccountScreen from './profile/AccountScreen';
import PermissionsScreen from './profile/PermissionsScreen';
import FocusPreferencesScreen from './profile/FocusPreferencesScreen';
import NotificationRulesScreen from './profile/NotificationRulesScreen';
import AppearanceScreen from './profile/AppearanceScreen';
import StreakProductivityScreen from './profile/StreakProductivityScreen';
import PrivacySecurityScreen from './profile/PrivacySecurityScreen';
import AboutScreen from './profile/AboutScreen';

type ProfileScreenName = 
  | 'ProfileMain'
  | 'Account'
  | 'Permissions'
  | 'FocusPreferences'
  | 'NotificationRules'
  | 'Appearance'
  | 'StreakProductivity'
  | 'PrivacySecurity'
  | 'About';

const ProfileScreenContainer: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ProfileScreenName>('ProfileMain');

  const navigate = (screen: ProfileScreenName) => {
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setCurrentScreen('ProfileMain');
  };

  // Create navigation object for ProfileScreen
  const navigation = {
    navigate,
    goBack,
  };

  switch (currentScreen) {
    case 'Account':
      return <AccountScreen navigation={navigation} />;
    case 'Permissions':
      return <PermissionsScreen navigation={navigation} />;
    case 'FocusPreferences':
      return <FocusPreferencesScreen navigation={navigation} />;
    case 'NotificationRules':
      return <NotificationRulesScreen navigation={navigation} />;
    case 'Appearance':
      return <AppearanceScreen navigation={navigation} />;
    case 'StreakProductivity':
      return <StreakProductivityScreen navigation={navigation} />;
    case 'PrivacySecurity':
      return <PrivacySecurityScreen navigation={navigation} />;
    case 'About':
      return <AboutScreen navigation={navigation} />;
    default:
      return <ProfileScreen navigation={navigation} />;
  }
};

export default ProfileScreenContainer;

