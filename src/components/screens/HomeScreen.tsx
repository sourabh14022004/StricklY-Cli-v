import React, { useState, useEffect } from 'react';
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
  Image,
  DeviceEventEmitter,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { fetchUpcomingEvents, createCalendarEvent, CalendarEvent } from '../../services/googleCalendar';
import ActionDrawer from '../ui/ActionDrawer';
import EventCreationModal from '../ui/EventCreationModal';
import TodoCreationModal, { TodoInput } from '../ui/TodoCreationModal';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface PriorityTask {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt?: string;
}

interface AllTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt?: string;
}

interface CalendarDay {
  key: string; // YYYY-MM-DD
  dayNumber: number;
  weekdayShort: string;
}

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [todoModalVisible, setTodoModalVisible] = useState(false);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [eventsByDate, setEventsByDate] = useState<Record<string, CalendarEvent[]>>({});
  const [priorityTasks, setPriorityTasks] = useState<PriorityTask[]>([]);
  const [allTasks, setAllTasks] = useState<AllTask[]>([]);

  const loadTodos = async () => {
    try {
      const todosJson = await AsyncStorage.getItem('todos');
      console.log('Loading todos from AsyncStorage:', todosJson);
      if (todosJson) {
        const todos = JSON.parse(todosJson);
        console.log('Parsed todos:', todos);
        // Ensure todos is an array
        if (!Array.isArray(todos)) {
          console.error('Todos is not an array:', todos);
          setPriorityTasks([]);
          return;
        }
        // Convert todos to PriorityTask format
        const formattedTodos: PriorityTask[] = todos.map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed || false,
          description: todo.description,
          dueDate: todo.dueDate, // Keep as ISO string for display
          priority: todo.priority || 'medium',
          createdAt: todo.createdAt,
        }));
        console.log('Formatted todos:', formattedTodos);
        // Sort by priority (high first) and then by creation date (newest first)
        formattedTodos.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority || 'medium'] || 2;
          const bPriority = priorityOrder[b.priority || 'medium'] || 2;
          if (aPriority !== bPriority) {
            return bPriority - aPriority;
          }
          // If same priority, sort by creation date (newest first)
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
        console.log('Setting priority tasks:', formattedTodos);
        setPriorityTasks(formattedTodos);
        // Also set allTasks with the same data
        setAllTasks(formattedTodos.map(todo => ({
          id: todo.id,
          title: todo.title,
          priority: todo.priority || 'medium',
          description: todo.description,
          dueDate: todo.dueDate,
          completed: todo.completed,
          createdAt: todo.createdAt,
        })));
      } else {
        // If no todos exist, initialize with empty array
        console.log('No todos found in AsyncStorage');
        setPriorityTasks([]);
        setAllTasks([]);
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
      setPriorityTasks([]);
      setAllTasks([]);
    }
  };

  // Calculate progress statistics from actual todos
  const getProgressStats = () => {
    const totalTasks = priorityTasks.length;
    const completedTasks = priorityTasks.filter(task => task.completed).length;
    const inProgressTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      percentage: completionPercentage,
    };
  };

  // Generate weekly completion data for bar chart (last 5 days)
  const getWeeklyCompletionData = () => {
    const days = 5;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      // Count completed tasks created on or before this date
      const tasksForDay = priorityTasks.filter(task => {
        if (!task.createdAt) return false;
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate <= dateKey && task.completed;
      }).length;
      
      // Normalize to 1-6 range for bar height
      const maxTasks = Math.max(...priorityTasks.map(() => 1), 1);
      const height = maxTasks > 0 ? Math.max(1, Math.round((tasksForDay / maxTasks) * 6)) : 1;
      data.push(height);
    }
    
    // If no data, return default heights
    return data.length > 0 ? data : [2, 3, 2, 4, 3];
  };

  const togglePriorityTask = async (taskId: string) => {
    const updatedTasks = priorityTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setPriorityTasks(updatedTasks);
    
    // Also update allTasks
    setAllTasks(updatedTasks.map(todo => ({
      id: todo.id,
      title: todo.title,
      priority: todo.priority || 'medium',
      description: todo.description,
      dueDate: todo.dueDate,
      completed: todo.completed,
      createdAt: todo.createdAt,
    })));
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  const getUserName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const loadCalendarEvents = async () => {
    try {
      setCalendarLoading(true);
      setCalendarError(null);

      // Check if user is signed in with Google
      const currentUser = await GoogleSignin.getCurrentUser();
      if (!currentUser) {
        setCalendarLoading(false);
        setCalendarError('Please sign in with Google to view calendar events');
        return;
      }

      // Get access token
      const tokens = await GoogleSignin.getTokens();

      if (!tokens.accessToken) {
        setCalendarLoading(false);
        setCalendarError('Unable to get access token. Please sign in again with Google');
        return;
      }

      const events = await fetchUpcomingEvents(tokens.accessToken, 10);
      console.log('Loaded calendar events:', events.length, events);
      setCalendarEvents(events);
      setCalendarError(null); // Clear any previous errors
    } catch (error: any) {
      console.warn('Failed to load Google Calendar events:', error?.message || error);
      
      // Provide more specific error messages
      let errorMessage = 'Unable to load Google Calendar events';
      
      if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        errorMessage = 'Please sign in with Google to view calendar events';
      } else if (error?.message?.includes('403') || error?.message?.includes('permission')) {
        errorMessage = 'Calendar permission required. Please sign out and sign in again with Google';
      } else if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection';
      } else if (error?.code === 'SIGN_IN_REQUIRED') {
        errorMessage = 'Please sign in with Google to view calendar events';
      }
      
      setCalendarError(errorMessage);
    } finally {
      setCalendarLoading(false);
    }
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

  const getSelectedMonthLabel = () => {
    const d = new Date(selectedDate);
    return d.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };

  const getDateKey = (date: string | Date) => {
    if (typeof date === 'string') {
      // Handle all-day events (YYYY-MM-DD format)
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      // Handle dateTime format (ISO 8601)
      const d = new Date(date);
      // Use local date to avoid timezone issues
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    // Handle Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Build a 14-day strip starting from today
  useEffect(() => {
    const today = new Date();
    const days: CalendarDay[] = [];

    for (let i = -2; i < 12; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = getDateKey(d);
      const dayNumber = d.getDate();
      const weekdayShort = d
        .toLocaleDateString('default', { weekday: 'short' })
        .replace('.', '');

      days.push({ key, dayNumber, weekdayShort });
    }

    setCalendarDays(days);
  }, []);

  useEffect(() => {
    loadCalendarEvents();
    loadTodos();
  }, []);

  // Group calendar events by date (YYYY-MM-DD)
  useEffect(() => {
    const map: Record<string, CalendarEvent[]> = {};
    calendarEvents.forEach((event) => {
      console.log('Processing event:', event.summary, 'start:', event.start);
      const key = getDateKey(event.start);
      console.log('Event date key:', key);
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(event);
    });
    console.log('All events grouped by date:', JSON.stringify(map, null, 2));
    console.log('Selected date:', selectedDate);
    console.log('Events for selected date:', map[selectedDate] || []);
    console.log('All date keys in map:', Object.keys(map));
    setEventsByDate(map);
  }, [calendarEvents, selectedDate]);

  // Listen for todo updates from other parts of the app (e.g., BottomTabNavigator)
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('todosUpdated', () => {
      loadTodos();
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.avatarText}>{getUserInitials()}</Text>
                )}
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{getUserName()}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                activeOpacity={0.7}
                onPress={() => setDrawerVisible(true)}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Horizontal Date Strip (Google Calendar) */}
          <View style={styles.calendarStripContainer}>
            <View style={styles.calendarStripHeader}>
              <Text style={styles.calendarMonthText}>{getSelectedMonthLabel()}</Text>
              <View style={styles.calendarHeaderActions}>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#9CA3AF"
                  style={{ marginRight: 8 }}
                />
                <TouchableOpacity activeOpacity={0.7}>
                  <Ionicons name="search-outline" size={18} color="#E5E7EB" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarDaysRow}
            >
              {calendarDays.map((day) => {
                const isSelected = day.key === selectedDate;
                const hasEvents = !!eventsByDate[day.key];

                return (
                  <TouchableOpacity
                    key={day.key}
                    style={[
                      styles.calendarDayCard,
                      isSelected && styles.calendarDayCardSelected,
                    ]}
                    onPress={() => setSelectedDate(day.key)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.calendarDayNumber,
                        isSelected && styles.calendarDayNumberSelected,
                      ]}
                    >
                      {day.dayNumber}
                    </Text>
                    <Text
                      style={[
                        styles.calendarDayWeekday,
                        isSelected && styles.calendarDayWeekdaySelected,
                      ]}
                    >
                      {day.weekdayShort}
                    </Text>
                    {hasEvents && <View style={styles.calendarEventDot} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
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
                {priorityTasks.length > 0 ? (
                  priorityTasks.map((task) => (
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
                  ))
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>No tasks yet</Text>
                    <Text style={styles.emptyStateSubtext}>Create a todo to get started</Text>
                  </View>
                )}
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
                <Text style={styles.progressCardValue}>
                  {getProgressStats().inProgress} {getProgressStats().inProgress === 1 ? 'task' : 'tasks'}
                </Text>
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
                      strokeDasharray={`${2 * Math.PI * 18 * (getProgressStats().percentage / 100)} ${2 * Math.PI * 18}`}
                    />
                  </Svg>
                  <Text style={styles.progressPercentage}>{getProgressStats().percentage}%</Text>
                </View>
                <Text style={styles.progressCardTitle}>Completed</Text>
                <Text style={styles.progressCardValue}>
                  {getProgressStats().completed}/{getProgressStats().total} {getProgressStats().total === 1 ? 'task' : 'tasks'}
                </Text>
                <View style={styles.barChart}>
                  {getWeeklyCompletionData().map((height, index) => (
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
              {allTasks.length > 0 ? (
                allTasks.map((task) => {
                  const formatDueDate = (dueDate?: string) => {
                    if (!dueDate) return 'No due date';
                    try {
                      const date = new Date(dueDate);
                      return date.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      });
                    } catch {
                      return dueDate;
                    }
                  };

                  const getPriorityColor = (priority?: string) => {
                    switch (priority) {
                      case 'high': return styles.priorityBadgeHigh;
                      case 'low': return styles.priorityBadgeLow;
                      case 'medium': return styles.priorityBadgeMedium;
                      default: return styles.priorityBadgeMedium;
                    }
                  };

                  return (
                    <View key={task.id} style={styles.allTaskCard}>
                      <View style={styles.allTaskHeader}>
                        <View
                          style={[
                            styles.priorityBadge,
                            getPriorityColor(task.priority),
                          ]}
                        >
                          <Text style={styles.priorityBadgeText}>
                            {task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Medium'}
                          </Text>
                        </View>
                        {task.completed && (
                          <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text style={styles.completedBadgeText}>Done</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.allTaskTitle,
                        task.completed && styles.allTaskTitleCompleted
                      ]}>
                        {task.title}
                      </Text>
                      {task.description && (
                        <Text style={styles.allTaskDescription} numberOfLines={2}>
                          {task.description}
                        </Text>
                      )}
                      <View style={styles.allTaskDetails}>
                        {task.dueDate && (
                          <View style={styles.timeContainer}>
                            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.timeText}>
                              Due: {formatDueDate(task.dueDate)}
                            </Text>
                          </View>
                        )}
                        {task.createdAt && (
                          <Text style={styles.dueDateText}>
                            Created: {new Date(task.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>No tasks yet</Text>
                  <Text style={styles.emptyStateSubtext}>Create a todo to get started</Text>
                </View>
              )}
            </View>
          </View>

          {/* Google Calendar Section */}
          <View style={styles.calendarSection}>
            <View style={styles.allTasksHeader}>
              <Text style={styles.sectionTitle}>Upcoming from Google Calendar</Text>
              {calendarLoading && (
                <Text style={styles.calendarStatusText}>Syncing...</Text>
              )}
            </View>

              {calendarError && (
                <View style={styles.calendarErrorContainer}>
                  <Text style={styles.calendarErrorText}>{calendarError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadCalendarEvents}
                    disabled={calendarLoading}
                  >
                    <Ionicons name="refresh" size={16} color="#FFFFFF" />
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.allTasksList}>
                {calendarEvents.length === 0 && !calendarLoading && !calendarError ? (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="calendar-outline" size={48} color="#6B7280" />
                    <Text style={styles.emptyStateText}>No upcoming events</Text>
                    <Text style={styles.emptyStateSubtext}>
                      Create an event to get started
                    </Text>
                  </View>
                ) : calendarEvents.length > 0 ? (
                  (() => {
                    const selectedDateEvents = eventsByDate[selectedDate] || [];
                    
                    // If no events for selected date, show all events with their dates
                    if (selectedDateEvents.length === 0 && Object.keys(eventsByDate).length > 0) {
                      return Object.keys(eventsByDate)
                        .sort()
                        .map((dateKey) => {
                          const eventsForDate = eventsByDate[dateKey];
                          return eventsForDate.map((event) => {
                            // Format the date/time for display
                            let formattedTime: string;
                            if (event.start.match(/^\d{4}-\d{2}-\d{2}$/)) {
                              // All-day event
                              const date = new Date(event.start + 'T00:00:00');
                              formattedTime = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }) + ' (All day)';
                            } else {
                              // Timed event
                              const startDate = new Date(event.start);
                              formattedTime = startDate.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              });
                            }
                            
                            return (
                              <View key={event.id} style={styles.allTaskCard}>
                                <Text style={styles.allTaskTitle}>{event.summary}</Text>
                                <View style={styles.timeContainer}>
                                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                  <Text style={styles.timeText}>{formattedTime}</Text>
                                </View>
                              </View>
                            );
                          });
                        })
                        .flat();
                    }
                    
                    // Show events for selected date
                    return selectedDateEvents.map((event) => {
                      // Format the date/time for display
                      let formattedTime: string;
                      if (event.start.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        // All-day event
                        const date = new Date(event.start + 'T00:00:00');
                        formattedTime = date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }) + ' (All day)';
                      } else {
                        // Timed event
                        const startDate = new Date(event.start);
                        formattedTime = startDate.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        });
                      }
                      
                      return (
                        <View key={event.id} style={styles.allTaskCard}>
                          <Text style={styles.allTaskTitle}>{event.summary}</Text>
                          <View style={styles.timeContainer}>
                            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.timeText}>{formattedTime}</Text>
                          </View>
                        </View>
                      );
                    });
                  })()
                ) : null}
              </View>
            </View>
        </ScrollView>
      </LinearGradient>

      {/* Action Drawer */}
      <ActionDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onBirthdayPress={() => {
          // Handle birthday press
          console.log('Birthday pressed from HomeScreen');
        }}
        onTodoPress={() => {
          // Open todo creation modal
          setTodoModalVisible(true);
        }}
        onWorkingLocationPress={() => {
          // Handle working location press
          console.log('Working location pressed from HomeScreen');
        }}
        onTaskPress={() => {
          // Handle task press
          console.log('Task pressed from HomeScreen');
        }}
        onEventPress={() => {
          // Open event creation modal
          setEventModalVisible(true);
        }}
        // Uses default bottomOffset (NAV_BAR_HEIGHT + 20) to match BottomTabNavigator
      />

      {/* Event Creation Modal */}
      <EventCreationModal
        visible={eventModalVisible}
        onClose={() => setEventModalVisible(false)}
        onCreateEvent={async (event) => {
          try {
            const tokens = await GoogleSignin.getTokens();
            
            if (!tokens.accessToken) {
              Alert.alert('Error', 'Please sign in with Google to create events');
              return;
            }

            await createCalendarEvent(tokens.accessToken, event);

            Alert.alert('Success', 'Event created successfully!', [
              { 
                text: 'OK',
                onPress: () => {
                  // Refresh calendar events after creating a new event
                  loadCalendarEvents();
                }
              },
            ]);
          } catch (error: any) {
            console.error('Failed to create event:', error);
            
            // Check if it's a scope/permission error
            if (error?.message?.includes('403') || 
                error?.message?.includes('insufficient') ||
                error?.message?.includes('PERMISSION_DENIED')) {
              Alert.alert(
                'Permission Required',
                'Calendar write permission is required. Please sign out and sign in again with Google to grant this permission.',
                [
                  { text: 'OK' },
                ]
              );
            } else {
              Alert.alert(
                'Error',
                error?.message || 'Failed to create event. Please try again.',
              );
            }
            throw error; // Re-throw to let modal handle it
          }
        }}
      />

      {/* Todo Creation Modal */}
      <TodoCreationModal
        visible={todoModalVisible}
        onClose={() => setTodoModalVisible(false)}
        onCreateTodo={async (todo) => {
          try {
            // Get existing todos from AsyncStorage
            const todosJson = await AsyncStorage.getItem('todos');
            const existingTodos = todosJson ? JSON.parse(todosJson) : [];
            
            // Create new todo with id and timestamp
            const newTodo = {
              id: Date.now().toString(),
              title: todo.title,
              description: todo.description,
              dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined,
              priority: todo.priority || 'medium',
              completed: false,
              createdAt: new Date().toISOString(),
            };
            
            console.log('Creating new todo:', newTodo);
            console.log('Existing todos:', existingTodos);
            
            // Ensure existingTodos is an array
            const todosArray = Array.isArray(existingTodos) ? existingTodos : [];
            
            // Add new todo to the list
            const updatedTodos = [...todosArray, newTodo];
            
            console.log('Updated todos array:', updatedTodos);
            
            // Save back to AsyncStorage
            await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
            console.log('Saved todos to AsyncStorage');
            
            // Refresh the todos list
            await loadTodos();
            
            Alert.alert('Success', 'Todo created successfully!', [
              { 
                text: 'OK',
                onPress: () => {
                  console.log('Todo created:', newTodo);
                }
              },
            ]);
          } catch (error: any) {
            console.error('Failed to create todo:', error);
            Alert.alert(
              'Error',
              error?.message || 'Failed to create todo. Please try again.',
            );
            throw error;
          }
        }}
      />
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
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  calendarStripContainer: {
    marginBottom: 20,
  },
  calendarStripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calendarMonthText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  calendarHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarDaysRow: {
    paddingVertical: 4,
  },
  calendarDayCard: {
    width: 58,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#111827',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayCardSelected: {
    backgroundColor: '#FDE68A',
  },
  calendarDayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  calendarDayNumberSelected: {
    color: '#111827',
  },
  calendarDayWeekday: {
    fontSize: 12,
    marginTop: 2,
    color: '#9CA3AF',
  },
  calendarDayWeekdaySelected: {
    color: '#4B5563',
  },
  calendarEventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
    backgroundColor: '#4ADE80',
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
    backgroundColor: '#000000',
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
    backgroundColor: '#000000',
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
    backgroundColor: '#000000',
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
  calendarSection: {
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
    backgroundColor: '#000000',
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
  priorityBadgeMedium: {
    backgroundColor: '#F59E0B',
  },
  priorityBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  completedBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
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
  allTaskTitleCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  allTaskDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 18,
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
    borderColor: '#000000',
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
    borderColor: '#000000',
  },
  moreParticipantsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  calendarStatusText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  calendarErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarErrorText: {
    fontSize: 12,
    color: '#F97373',
    flex: 1,
    marginRight: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default HomeScreen;

