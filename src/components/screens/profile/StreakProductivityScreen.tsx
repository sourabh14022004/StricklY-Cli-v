import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
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

interface StreakProductivityScreenProps {
  navigation: NavigationProp;
}

const SettingRow: React.FC<{
  label: string;
  helper?: string;
  actionLabel?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  isDestructive?: boolean;
}> = ({ label, helper, actionLabel, onPress, children, isDestructive }) => (
  <View style={styles.settingRow}>
    <View style={styles.settingTextWrapper}>
      <Text style={styles.settingLabel}>{label}</Text>
      {helper && <Text style={styles.settingHelper}>{helper}</Text>}
    </View>
    {children
      ? children
      : actionLabel && (
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
        )}
  </View>
);

const StreakProductivityScreen: React.FC<StreakProductivityScreenProps> = ({ navigation }) => {
  const [showStreaks, setShowStreaks] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [achievementBadges, setAchievementBadges] = useState(false);

  const handleResetStreak = () => {
    Alert.alert(
      'Reset Streak Data',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Streak data has been reset.');
          },
        },
      ]
    );
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
            <Text style={styles.headerTitle}>Streak & Productivity</Text>
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
            <SettingRow label="Show streaks on home">
              <Switch
                value={showStreaks}
                onValueChange={setShowStreaks}
                thumbColor={showStreaks ? '#FFFFFF' : '#9CA3AF'}
                trackColor={{ false: '#374151', true: '#6B46C1' }}
              />
            </SettingRow>
            <SettingRow
              label="Reset streak data"
              helper="This action cannot be undone."
              actionLabel="Reset"
              onPress={handleResetStreak}
              isDestructive
            />
            <SettingRow label="Weekly productivity summary">
              <Switch
                value={weeklySummary}
                onValueChange={setWeeklySummary}
                thumbColor={weeklySummary ? '#FFFFFF' : '#9CA3AF'}
                trackColor={{ false: '#374151', true: '#6B46C1' }}
              />
            </SettingRow>
            <SettingRow label="Achievement badges">
              <Switch
                value={achievementBadges}
                onValueChange={setAchievementBadges}
                thumbColor={achievementBadges ? '#FFFFFF' : '#9CA3AF'}
                trackColor={{ false: '#374151', true: '#6B46C1' }}
              />
            </SettingRow>
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

export default StreakProductivityScreen;

