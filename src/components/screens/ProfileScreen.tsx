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
  SafeAreaView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import LoadingModal from '../../modals/LoadingModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';

type ProfileScreenName = 
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
  goBack?: () => void;
}

interface SectionItem {
  id: ProfileScreenName;
  title: string;
  icon: string;
}

interface ProfileScreenProps {
  navigation?: NavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, loading, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  
  const defaultNavigation: NavigationProp = {
    navigate: () => {},
  };
  
  const nav = navigation || defaultNavigation;

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await signOut();
              if (!result.success && result.error) {
                Alert.alert('Error', result.error);
              }
              // Navigation will be handled automatically by App.tsx when user becomes null
            } catch (error: any) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'An unexpected error occurred while signing out.');
            }
          },
        },
      ]
    );
  };

  const sections: SectionItem[] = [
    { id: 'Account', title: 'Account', icon: 'person-outline' },
    { id: 'Permissions', title: 'Permissions', icon: 'lock-closed-outline' },
    { id: 'FocusPreferences', title: 'Focus Preferences', icon: 'time-outline' },
    { id: 'NotificationRules', title: 'Captured Notification Rules', icon: 'notifications-outline' },
    { id: 'Appearance', title: 'Appearance', icon: 'color-palette-outline' },
    { id: 'StreakProductivity', title: 'Streak & Productivity', icon: 'flame-outline' },
    { id: 'PrivacySecurity', title: 'Privacy & Security', icon: 'shield-checkmark-outline' },
    { id: 'About', title: 'About', icon: 'information-circle-outline' },
  ];

  return (
    <>
      <LoadingModal visible={loading} message="Please wait..." />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} />
        <LinearGradient
          colors={['#1A0B2E', '#2D1B4E', '#3D2B5E']}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={[
              styles.contentContainer,
              { 
                paddingTop: 20,
                paddingBottom: 160 + insets.bottom,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* <View style={styles.headerBar}>
              <View style={styles.headerIconButtonPlaceholder} />
              <Text style={styles.headerTitle}>Profile</Text>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => {}}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View> */}

            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarPlaceholder}>
                  {user?.photoURL ? (
                    <Image
                      source={{ uri: user.photoURL }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.avatarInitials}>
                      {(user?.displayName || 'U')
                        .split(' ')
                        .map((p) => p[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  )}
                </View>
                <View style={styles.userTextWrapper}>
                  <Text style={styles.userName}>
                    {user?.displayName || 'Galangal Richard'}
                  </Text>
                  <Text style={styles.userEmail}>
                    {user?.email || 'galangal82@gmail.com'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.8}
                  onPress={() => nav.navigate('Account')}
                >
                  <Ionicons name="pencil" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sectionsContainer}>
              {sections.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  style={styles.sectionRow}
                  activeOpacity={0.7}
                  onPress={() => nav.navigate(section.id)}
                >
                  <View style={styles.sectionLeft}>
                  <Ionicons
                    name={section.icon}
                    size={22}
                    color="#9CA3AF"
                    style={styles.sectionIcon}
                  />
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.logoutContainer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleSignOut}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={20} color="#F87171" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
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
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  headerIconButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6B46C1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  userTextWrapper: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B46C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionsContainer: {
    backgroundColor: '#000000',
    borderRadius: 20,
    overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2D2D2D',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutContainer: {
    marginTop: 20,
    backgroundColor: '#000000',
    borderRadius: 20,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreen;
