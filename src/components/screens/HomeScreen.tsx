import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface PriorityTask {
  id: string;
  title: string;
  completed: boolean;
}

interface AllTask {
  id: string;
  title: string;
  priority: 'high' | 'low';
  meetingType: string;
  time: string;
  dueDate: string;
  participants: number;
}

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [priorityTasks, setPriorityTasks] = useState<PriorityTask[]>([
    { id: '1', title: 'Design Assets Exp', completed: true },
    { id: '2', title: 'HR Catch-Up Call', completed: false },
    { id: '3', title: 'Marketing Huddle', completed: false },
    { id: '4', title: 'Onboarding Call', completed: false },
    { id: '5', title: 'Wp Setup & Deliver', completed: false },
  ]);

  const [allTasks] = useState<AllTask[]>([
    {
      id: '1',
      title: 'Dashboard Design for Admin',
      priority: 'high',
      meetingType: 'Zoom Meet',
      time: '09:30 - 10:30 AM',
      dueDate: 'December 20',
      participants: 5,
    },
    {
      id: '2',
      title: 'Team Standup Meeting',
      priority: 'low',
      meetingType: 'Google Meet',
      time: '11:00 - 11:30 AM',
      dueDate: 'December 20',
      participants: 8,
    },
  ]);

  const togglePriorityTask = (taskId: string) => {
    setPriorityTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getUserName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent={false} />
      <LinearGradient
        colors={['#1A0B2E', '#2D1B4E', '#3D2B5E']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{getUserName()}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Urgent Tasks Summary Card */}
          <View style={styles.urgentCard}>
            <View style={styles.urgentCardHeader}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                <Text style={styles.dateText}>{getCurrentDate()}</Text>
              </View>
              <TouchableOpacity style={styles.aiReportButton}>
                <Text style={styles.aiReportText}>AI-Report</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.aiAnalysisLabel}>Today's Ai Analysis</Text>
            <View style={styles.urgentMessageContainer}>
              <Text style={styles.urgentMessage}>
                You Have <Text style={styles.urgentHighlight}>8 Tasks Urgent</Text> For Today.
              </Text>
            </View>
            {/* <View style={styles.robotContainer}>
              <Ionicons name="construct-outline" size={60} color="#4ECDC4" />
            </View> */}
          </View>

          {/* Priority Task and Progress Cards Row */}
          <View style={styles.middleRow}>
            {/* Priority Task Section */}
            <View style={styles.priorityCard}>
              <Text style={styles.sectionTitle}>Priority Task</Text>
              <View style={styles.priorityTasksList}>
                {priorityTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.priorityTaskItem}
                    onPress={() => togglePriorityTask(task.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        task.completed && styles.radioButtonChecked,
                      ]}
                    >
                      {task.completed && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.priorityTaskText,
                        task.completed && styles.priorityTaskTextCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Progress Cards */}
            <View style={styles.progressCards}>
              {/* In Progress Card */}
              <View style={styles.progressCard}>
                <View style={styles.progressIconContainer}>
                  <Ionicons name="sunny" size={24} color="#FFD700" />
                </View>
                <Text style={styles.progressCardTitle}>In Progress</Text>
                <Text style={styles.progressCardValue}>6 task</Text>
              </View>

              {/* Completed Card */}
              <View style={styles.progressCard}>
                <View style={styles.completedProgressContainer}>
                  <Svg width={40} height={40}>
                    <Circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="#6B46C1"
                      strokeWidth="3"
                      fill="none"
                    />
                    <Path
                      d="M 20 2 A 18 18 0 1 1 20 38"
                      stroke="#9D4EDD"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 18 * 0.7} ${2 * Math.PI * 18}`}
                    />
                  </Svg>
                  <Text style={styles.progressPercentage}>70%</Text>
                </View>
                <Text style={styles.progressCardTitle}>Completed</Text>
                <Text style={styles.progressCardValue}>22/72 task</Text>
                <View style={styles.barChart}>
                  {[3, 5, 4, 6, 5].map((height, index) => (
                    <View
                      key={index}
                      style={[styles.bar, { height: height * 4 }]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* All Tasks Section */}
          <View style={styles.allTasksSection}>
            <View style={styles.allTasksHeader}>
              <Text style={styles.sectionTitle}>All Tasks</Text>
              <TouchableOpacity>
                <Ionicons name="arrow-up-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <View style={styles.allTasksList}>
              {allTasks.map((task) => (
                <View key={task.id} style={styles.allTaskCard}>
                  <View style={styles.allTaskHeader}>
                    <View
                      style={[
                        styles.priorityBadge,
                        task.priority === 'high'
                          ? styles.priorityBadgeHigh
                          : styles.priorityBadgeLow,
                      ]}
                    >
                      <Text style={styles.priorityBadgeText}>
                        {task.priority === 'high' ? 'High' : 'Low'}
                      </Text>
                    </View>
                    <View style={styles.meetingTypeContainer}>
                      <View style={styles.meetingDot} />
                      <Text style={styles.meetingType}>{task.meetingType}</Text>
                    </View>
                  </View>
                  <Text style={styles.allTaskTitle}>{task.title}</Text>
                  <View style={styles.allTaskDetails}>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                      <Text style={styles.timeText}>{task.time}</Text>
                    </View>
                    <Text style={styles.dueDateText}>
                      Due Date: {task.dueDate}
                    </Text>
                  </View>
                  <View style={styles.participantsContainer}>
                    {[...Array(Math.min(task.participants, 3))].map((_, i) => (
                      <View key={i} style={styles.participantAvatar}>
                        <Text style={styles.participantInitial}>
                          {String.fromCharCode(65 + i)}
                        </Text>
                      </View>
                    ))}
                    {task.participants > 3 && (
                      <View style={styles.moreParticipants}>
                        <Text style={styles.moreParticipantsText}>
                          +{task.participants - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6B46C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  greetingContainer: {
    gap: 2,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  urgentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  aiReportButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  aiReportText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  aiAnalysisLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  urgentMessageContainer: {
    marginBottom: 20,
  },
  urgentMessage: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  urgentHighlight: {
    color: '#FF6B6B',
  },
  robotContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  priorityCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  priorityTasksList: {
    gap: 12,
  },
  priorityTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonChecked: {
    borderColor: '#9D4EDD',
    backgroundColor: '#9D4EDD',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  priorityTaskText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  priorityTaskTextCompleted: {
    color: '#6B7280',
  },
  progressCards: {
    flex: 1,
    gap: 12,
  },
  progressCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 16,
  },
  progressIconContainer: {
    marginBottom: 12,
  },
  completedProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressPercentage: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressCardValue: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 12,
    height: 20,
  },
  bar: {
    flex: 1,
    backgroundColor: '#6B46C1',
    borderRadius: 2,
    minHeight: 4,
  },
  allTasksSection: {
    marginBottom: 20,
  },
  allTasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  allTasksList: {
    gap: 12,
  },
  allTaskCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 16,
  },
  allTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeHigh: {
    backgroundColor: '#EF4444',
  },
  priorityBadgeLow: {
    backgroundColor: '#10B981',
  },
  priorityBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  meetingTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meetingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  meetingType: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  allTaskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  allTaskDetails: {
    gap: 8,
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  dueDateText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -8,
  },
  participantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6B46C1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  participantInitial: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  moreParticipants: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  moreParticipantsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default HomeScreen;

