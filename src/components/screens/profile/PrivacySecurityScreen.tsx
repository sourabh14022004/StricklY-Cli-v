import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';

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

interface NavigationProp {
  navigate: (screen: ProfileScreenName) => void;
  goBack: () => void;
}

interface PrivacySecurityScreenProps {
  navigation: NavigationProp;
}

const SettingRow: React.FC<{
  label: string;
  helper?: string;
  actionLabel: string;
  onPress: () => void;
  isDestructive?: boolean;
}> = ({ label, helper, actionLabel, onPress, isDestructive }) => (
  <View style={styles.settingRow}>
    <View style={styles.settingTextWrapper}>
      <Text style={styles.settingLabel}>{label}</Text>
      {helper && <Text style={styles.settingHelper}>{helper}</Text>}
    </View>
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.settingButton,
        isDestructive && styles.settingButtonDestructive,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.settingButtonText,
          isDestructive && styles.settingButtonTextDestructive,
        ]}
      >
        {actionLabel}
      </Text>
    </TouchableOpacity>
  </View>
);

const PrivacySecurityScreen: React.FC<PrivacySecurityScreenProps> = ({ navigation }) => {

  const handleDeleteNotifications = () => {
    Alert.alert(
      'Delete All Captured Notifications',
      'This will permanently delete all captured notifications. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All captured notifications have been deleted.');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data & Cache',
      'This will clear all app data and cache. You will need to sign in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'App data and cache have been cleared.');
          },
        },
      ]
    );
  };

  const handlePlaceholderAction = (label: string) => {
    Alert.alert(label, 'This feature will be available soon.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={false} />
      <LinearGradient
        colors={['#1A0B2E', '#2D1B4E', '#3D2B5E']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Privacy & Security</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.contentContainer,
              { paddingTop: Platform.OS === 'ios' ? 10 : 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
          <View style={styles.sectionCard}>
            <SettingRow
              label="Delete all captured notifications"
              actionLabel="Delete"
              onPress={handleDeleteNotifications}
              isDestructive
            />
            <SettingRow
              label="Export notifications"
              helper="Download your captured notifications as a file."
              actionLabel="Export"
              onPress={() => handlePlaceholderAction('Export Notifications')}
            />
            <SettingRow
              label="Clear app data & cache"
              helper="Remove all stored data and cached files."
              actionLabel="Clear"
              onPress={handleClearData}
              isDestructive
            />
            <SettingRow
              label="Manage local storage"
              helper="View and manage storage usage."
              actionLabel="Manage"
              onPress={() => handlePlaceholderAction('Manage Local Storage')}
            />
            <SettingRow
              label="Permission Explanations"
              helper="Learn why we need each permission."
              actionLabel="View"
              onPress={() => handlePlaceholderAction('Permission Explanations')}
            />
            <SettingRow
              label="Privacy Policy"
              actionLabel="View"
              onPress={() => handlePlaceholderAction('Privacy Policy')}
            />
            <SettingRow
              label="Terms of Service"
              actionLabel="View"
              onPress={() => handlePlaceholderAction('Terms of Service')}
            />
          </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  contentContainer: {
    padding: 20,
  },
  sectionCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2D2D2D',
  },
  settingTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingHelper: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },
  settingButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  settingButtonDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  settingButtonTextDestructive: {
    color: '#FF6B6B',
  },
});

export default PrivacySecurityScreen;

