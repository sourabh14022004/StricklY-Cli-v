import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import HomeScreen from './screens/HomeScreen';
import FocusScreen from './screens/FocusScreen';
import CapturedScreen from './screens/CapturedScreen';
import ProfileScreenContainer from './screens/ProfileScreenContainer';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionDrawer from './ui/ActionDrawer';
import EventCreationModal from './ui/EventCreationModal';
import TodoCreationModal from './ui/TodoCreationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createCalendarEvent } from '../services/googleCalendar';

const { width, height } = Dimensions.get("window");
const FAB_SIZE = 64;
const FAB_RADIUS = FAB_SIZE / 2;
const NAV_BAR_HEIGHT = Platform.OS === "ios" ? 85 : 80;

type TabType = "home" | "focus" | "add" | "captured" | "profile";

const BottomTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [displayedTab, setDisplayedTab] = useState<TabType>("home"); // Tab currently being displayed
  const previousTabRef = useRef<TabType>("home");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [todoModalVisible, setTodoModalVisible] = useState(false);
  // Animation values for smooth fade transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Glowing pulse animation for the center FAB
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping pulse for the glow around the FAB
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [glowAnim]);

  const renderTabIcon = (tab: TabType, isActive: boolean) => {
    const iconColor = isActive ? "#FF6B6B" : "#FFFFFF";

    switch (tab) {
      case "home":
        return (
          <View style={styles.iconContainer}>
            <Octicons name="home" size={24} color={iconColor} />
          </View>
        );
      case "focus":
        return (
          <View style={styles.iconContainer}>
            {/* <MaterialIcons name="timer" size={24} color={iconColor} /> */}
            <MaterialIcons
              name="do-not-disturb-on-total-silence"
              size={30}
              color={iconColor}
            />
          </View>
        );
      case "add":
        return (
          <View style={styles.addIconContainer}>
            <View style={styles.fabCircle}>
              <MaterialIcons name="add" size={28} color="#FFFFFF" />
            </View>
          </View>
        );
      case "captured":
        return (
          <View style={styles.capturedIconContainer}>
            <Entypo name="bell" size={24} color={iconColor} />
          </View>
        );
      case "profile":
        return (
          <View style={styles.iconContainer}>
            <View style={[styles.profileIcon, { borderColor: iconColor }]}>
              <View
                style={[styles.profileHead, { backgroundColor: iconColor }]}
              />
              <View
                style={[styles.profileBody, { backgroundColor: iconColor }]}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // Animate screen transitions with fade only
  useEffect(() => {
    if (activeTab !== displayedTab) {
      // Fade out current screen first
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Update displayed tab AFTER fade out completes
        setDisplayedTab(activeTab);
        previousTabRef.current = activeTab;
        
        // Small delay before fading in for smoother transition
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 0,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }, 0); // 50ms delay between fade out and fade in
      });
    }
  }, [activeTab, displayedTab]);

  const renderContent = () => {
    // Use displayedTab instead of activeTab so content only changes after fade out
    switch (displayedTab) {
      case "home":
        return <HomeScreen />;
      case "focus":
        return <FocusScreen />;
      case "captured":
        return <CapturedScreen />;
      case "profile":
        return <ProfileScreenContainer />;
      default:
        return <HomeScreen />;
    }
  };

  const handleTabPress = (tab: TabType) => {
    if (tab !== "add") {
      setActiveTab(tab);
      if (drawerVisible) {
        setDrawerVisible(false);
      }
    } else {
      // Handle Add button press - toggle drawer
      setDrawerVisible(!drawerVisible);
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Content with Fade Animation */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {renderContent()}
      </Animated.View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBarContainer}>
        <View style={styles.navBarWrapper}>
          {/* SVG Curved Background with Smooth Concave Notch */}
          <Svg width={width} height={NAV_BAR_HEIGHT} style={styles.navBarSvg}>
            <Path
              d={`
                M0 0
                L${width * 0.3} 0
                C${width * 0.43} 0 ${width * 0.38} 36 ${width * 0.5} 38
                C${width * 0.610} 36 ${width * 0.60} 0 ${width * 0.67} 0
                L${width} 0
                L${width} ${NAV_BAR_HEIGHT}
                L0 ${NAV_BAR_HEIGHT}
            `}
              // Slightly translucent deep purple to match app gradient
              fill="rgba(12, 10, 24, 0.98)"
            />
          </Svg>

          {/* Navigation Content Layer */}
          <View style={styles.navBarContent}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("home")}
              activeOpacity={0.6}
            >
              {renderTabIcon("home", activeTab === "home")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "home" && styles.tabLabelActive,
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("focus")}
              activeOpacity={0.6}
            >
              {renderTabIcon("focus", activeTab === "focus")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "focus" && styles.tabLabelActive,
                ]}
              >
                Focus
              </Text>
            </TouchableOpacity>

            {/* Spacer for Floating FAB */}
            <View style={styles.fabSpacer} />

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("captured")}
              activeOpacity={0.6}
            >
              {renderTabIcon("captured", activeTab === "captured")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "captured" && styles.tabLabelActive,
                ]}
              >
                Captured
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("profile")}
              activeOpacity={0.6}
            >
              {renderTabIcon("profile", activeTab === "profile")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "profile" && styles.tabLabelActive,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Floating Action Button - Fixed Position */}
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={styles.fabTouchable}
              onPress={() => handleTabPress("add")}
              activeOpacity={0.3}
            >
              <Animated.View
                style={[
                  styles.fabCircle,
                  {
                    transform: [
                      {
                        scale: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.03],
                        }),
                      },
                    ],
                    shadowOpacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0.9],
                    }),
                  },
                ]}
              >
                <MaterialIcons 
                  name={drawerVisible ? "close" : "add"} 
                  size={28} 
                  color="#FFFFFF" 
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Action Drawer */}
      <ActionDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onBirthdayPress={() => {
          // Handle birthday press
          console.log('Birthday pressed');
        }}
        onTodoPress={() => {
          // Handle out of office press
          console.log('Out of office pressed');
          setTodoModalVisible(true);
        }}
        onWorkingLocationPress={() => {
          // Handle working location press
          console.log('Working location pressed');
        }}
        onTaskPress={() => {
          // Handle task press
          console.log('Task pressed');
        }}
        onEventPress={() => {
          // Open event creation modal
          setEventModalVisible(true);
        }}
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
              { text: 'OK' },
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

            // Ensure existingTodos is an array
            const todosArray = Array.isArray(existingTodos) ? existingTodos : [];

            // Add new todo to the list
            const updatedTodos = [...todosArray, newTodo];

            // Save back to AsyncStorage
            await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));

            // Notify listeners (HomeScreen) to refresh
            DeviceEventEmitter.emit('todosUpdated');

            console.log('Todo created:', newTodo);
          } catch (error) {
            console.error('Failed to create todo from BottomTabNavigator:', error);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
  },
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_BAR_HEIGHT,

  },
  navBarWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  navBarSvg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBarContent: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_BAR_HEIGHT,
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === "ios" ? 8 : 10,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minHeight: 50,
  },
  tabLabel: {
    fontSize: 11,
    color: "#FFFFFF",
    marginTop: 4,
    fontWeight: "400",
  },
  tabLabelActive: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  fabSpacer: {
    width: FAB_SIZE,
    height: FAB_SIZE,
  },
  fabContainer: {
    position: "absolute",
    // display: 'none',
    bottom: NAV_BAR_HEIGHT - FAB_RADIUS - 20,
    left: (width - FAB_SIZE) / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  fabGlow: {
    position: "absolute",
    // (kept for potential future use; not used now)
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_RADIUS,
  },
  fabTouchable: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 25,
  },
  fabCircle: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_RADIUS,
    backgroundColor: "#E88B6B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E88B6B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 10,
  },
  fabLabel: {
    fontSize: 11,
    color: "#FFFFFF",
    marginTop: 4,
    fontWeight: "400",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  addIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  capturedIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
    minHeight: 24,
  },
  // Profile Icon Styles
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  profileHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 1,
  },
  profileBody: {
    width: 12,
    height: 6,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export default BottomTabNavigator;
