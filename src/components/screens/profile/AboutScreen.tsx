import React from 'react';
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

interface AboutScreenProps {
  navigation: NavigationProp;
}

const SettingRow: React.FC<{
  label: string;
  helper?: string;
  actionLabel?: string;
  onPress?: () => void;
}> = ({ label, helper, actionLabel, onPress }) => (
  <View style={styles.settingRow}>
    <View style={styles.settingTextWrapper}>
      <Text style={styles.settingLabel}>{label}</Text>
      {helper && <Text style={styles.settingHelper}>{helper}</Text>}
    </View>
    {actionLabel && (
      <TouchableOpacity
        onPress={onPress}
        style={styles.settingButton}
        activeOpacity={0.7}
      >
        <Text style={styles.settingButtonText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your interest! Rating will be available soon.');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@streakly.com').catch(() => {
      Alert.alert('Error', 'Unable to open email client.');
    });
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
            <Text style={styles.headerTitle}>About Streakly</Text>
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
            <SettingRow label="App Version" helper="v1.0.0" />
            <SettingRow
              label="Rate App"
              helper="Love Streakly? Leave us a review!"
              actionLabel="Rate"
              onPress={handleRateApp}
            />
            <SettingRow
              label="Contact Support"
              helper="Get help or report an issue."
              actionLabel="Email"
              onPress={handleContactSupport}
            />
            <SettingRow
              label="Developer Info"
              helper="Built by the Streakly team."
              actionLabel="View"
              onPress={() => handlePlaceholderAction('Developer Info')}
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
    backgroundColor: '#1A1A1A',
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
  settingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default AboutScreen;

