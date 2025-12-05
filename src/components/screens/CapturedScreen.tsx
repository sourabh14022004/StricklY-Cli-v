import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CapturedItem {
  id: string;
  app: string;
  title: string;
  category: 'Work' | 'Social' | 'Personal';
  time: string;
  isMuted: boolean;
}

const capturedToday: CapturedItem[] = [
  {
    id: '1',
    app: 'Slack',
    title: 'Design sync starts in 10 minutes',
    category: 'Work',
    time: '09:24 AM',
    isMuted: true,
  },
  {
    id: '2',
    app: 'Gmail',
    title: 'Figma handoff from Product team',
    category: 'Work',
    time: '08:57 AM',
    isMuted: true,
  },
  {
    id: '3',
    app: 'Instagram',
    title: 'New likes on your post',
    category: 'Social',
    time: '08:14 AM',
    isMuted: true,
  },
];

const capturedEarlier: CapturedItem[] = [
  {
    id: '4',
    app: 'Calendar',
    title: 'Weekly review with yourself',
    category: 'Personal',
    time: 'Yesterday • 06:30 PM',
    isMuted: true,
  },
  {
    id: '5',
    app: 'LinkedIn',
    title: 'Someone viewed your profile',
    category: 'Social',
    time: 'Mon • 03:12 PM',
    isMuted: true,
  },
];

const CapturedScreen: React.FC = () => {
  const renderBadge = (category: CapturedItem['category']) => {
    let backgroundColor = '#1F2937';
    let textColor = '#E5E7EB';

    if (category === 'Work') {
      backgroundColor = 'rgba(96, 165, 250, 0.18)';
      textColor = '#93C5FD';
    } else if (category === 'Social') {
      backgroundColor = 'rgba(244, 114, 182, 0.18)';
      textColor = '#F9A8D4';
    } else if (category === 'Personal') {
      backgroundColor = 'rgba(52, 211, 153, 0.18)';
      textColor = '#6EE7B7';
    }

    return (
      <View style={[styles.badge, { backgroundColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{category}</Text>
      </View>
    );
  };

  const renderCapturedItem = (item: CapturedItem) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>{item.app[0]}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.cardMetaRow}>
            {renderBadge(item.category)}
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Ionicons
          name={item.isMuted ? 'notifications-off-outline' : 'notifications-outline'}
          size={20}
          color="#9CA3AF"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A0B2E', '#2D1B4E', '#3D2B5E']}
        style={styles.gradient}
      >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
      >
          <View style={styles.headerRow}>
            <View>
          <Text style={styles.title}>Captured</Text>
              <Text style={styles.subtitle}>
                We hold your distractions while you stay in flow.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.headerIconButton}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={22} color="#E5E7EB" />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <View style={styles.summaryPill}>
                <Ionicons
                  name="notifications-off-circle-outline"
                  size={18}
                  color="#FBBF24"
                />
                <Text style={styles.summaryPillText}>Captured queue</Text>
              </View>
              <Text style={styles.summaryTitle}>15 notifications held</Text>
              <Text style={styles.summaryBody}>
                Delivered when your current focus session ends or when you’re
                ready to review them.
              </Text>
            </View>
            <View style={styles.summaryRight}>
              <View style={styles.summaryBubbleLarge} />
              <View style={styles.summaryBubbleMedium} />
              <View style={styles.summaryBubbleSmall} />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today</Text>
            <Text style={styles.sectionCount}>{capturedToday.length} held</Text>
          </View>

          {capturedToday.map(renderCapturedItem)}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Earlier this week</Text>
            <Text style={styles.sectionCount}>{capturedEarlier.length} held</Text>
          </View>

          {capturedEarlier.map(renderCapturedItem)}

          <View style={styles.rulesHeaderRow}>
            <View>
              <Text style={styles.rulesTitle}>Notification rules</Text>
              <Text style={styles.rulesSubtitle}>
                Fine-tune what gets captured vs. delivered instantly.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.manageButton}
              activeOpacity={0.7}
            >
              <Text style={styles.manageButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ruleRow}>
            <View style={styles.ruleIcon}>
              <Ionicons name="time-outline" size={18} color="#93C5FD" />
            </View>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>During focus sessions</Text>
              <Text style={styles.ruleBody}>
                All non-critical notifications are captured automatically.
              </Text>
            </View>
          </View>

          <View style={styles.ruleRow}>
            <View style={styles.ruleIconAlt}>
              <Ionicons name="briefcase-outline" size={18} color="#FDE68A" />
            </View>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>Work apps after hours</Text>
              <Text style={styles.ruleBody}>
                Slack & email alerts are held outside your work window.
              </Text>
        </View>
        </View>

          <View style={styles.bottomSpacer} />
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    maxWidth: 260,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  summaryLeft: {
    flex: 1.3,
  },
  summaryRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(55, 65, 81, 0.85)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  summaryPillText: {
    fontSize: 12,
    color: '#FBBF24',
    marginLeft: 6,
    fontWeight: '500',
  },
  summaryTitle: {
    fontSize: 18,
    color: '#F9FAFB',
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryBody: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  summaryBubbleLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    position: 'absolute',
    top: 8,
    right: 16,
  },
  summaryBubbleMedium: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
    position: 'absolute',
    bottom: 10,
    right: 4,
  },
  summaryBubbleSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(251, 191, 36, 0.5)',
    position: 'absolute',
    bottom: 24,
    left: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  sectionCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.8)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  appIconText: {
    color: '#F9FAFB',
    fontWeight: '600',
    fontSize: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#F9FAFB',
    marginBottom: 4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardRight: {
    marginLeft: 8,
  },
  rulesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  rulesSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
    maxWidth: 240,
  },
  manageButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.8)',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
  },
  manageButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  ruleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  ruleIconAlt: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  ruleTextContainer: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 2,
  },
  ruleBody: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  bottomSpacer: {
    height: 140,
  },
});

export default CapturedScreen;
