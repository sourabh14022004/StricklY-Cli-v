import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
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

interface PermissionsScreenProps {
  navigation: NavigationProp;
}

const SettingRow: React.FC<{
  label: string;
  status: 'On' | 'Off' | 'Allowed' | 'Restricted';
  onPress: () => void;
}> = ({ label, status, onPress }) => {
  const isAllowed = status === 'On' || status === 'Allowed';
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingTextWrapper}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={[styles.settingStatus, !isAllowed && styles.settingStatusError]}>
          {status}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPress}
        style={styles.settingButton}
        activeOpacity={0.7}
      >
        <Text style={styles.settingButtonText}>Open Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ navigation }) => {
  const [permissions, setPermissions] = useState({
    notification: 'On' as 'On' | 'Off',
    dnd: 'Off' as 'On' | 'Off',
    battery: 'Allowed' as 'Allowed' | 'Restricted',
  });

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      Alert.alert('Error', 'Unable to open settings.');
    }
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
            <Text style={styles.headerTitle}>Permissions</Text>
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
                label="Notification Access"
                status={permissions.notification}
                onPress={handleOpenSettings}
              />
              <SettingRow
                label="Do Not Disturb Access"
                status={permissions.dnd}
                onPress={handleOpenSettings}
              />
              <SettingRow
                label="Battery Optimization"
                status={permissions.battery}
                onPress={handleOpenSettings}
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
  settingStatus: {
    marginTop: 6,
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  settingStatusError: {
    color: '#FF6B6B',
  },
  settingButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default PermissionsScreen;
