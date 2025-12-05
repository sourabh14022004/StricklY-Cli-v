import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch,
  Alert,
  Linking,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle } from 'react-native-svg';
import WarpDriveShader from '../ui/warp-drive-shader';


const FocusScreen: React.FC = () => {
  const [duration, setDuration] = useState(25);
  const [autoEnableDND, setAutoEnableDND] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isDNDEnabled, setIsDNDEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const decreaseDuration = () => {
    if (duration > 5) {
      setDuration(duration - 5);
    }
  };

  const increaseDuration = () => {
    if (duration < 120) {
      setDuration(duration + 5);
    }
  };

  const openDoNotDisturbSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        await Linking.openSettings();
        return;
      }

      const iosDndUrl = 'App-Prefs:root=DO_NOT_DISTURB';
      if (await Linking.canOpenURL(iosDndUrl)) {
        await Linking.openURL(iosDndUrl);
        return;
      }

      await Linking.openSettings();
    } catch (settingsError) {
      console.error('Unable to open DND settings:', settingsError);
      await Linking.openSettings();
    }
  };

  // Enable DND (Do Not Disturb) mode
  const enableDND = async () => {
    try {
      console.log('Enabling Do Not Disturb mode...');
      Alert.alert(
        'Do Not Disturb',
        'We will open your device settings so you can enable Do Not Disturb for this focus session.',
      );

      await openDoNotDisturbSettings();
      setIsDNDEnabled(true);
    } catch (error) {
      console.error('Failed to enable DND:', error);
      Alert.alert('Error', 'Failed to enable Do Not Disturb mode');
    }
  };

  // Disable DND mode
  const disableDND = async () => {
    try {
      console.log('Disabling Do Not Disturb mode...');
      setIsDNDEnabled(false);
      
      // TODO: Implement actual DND disable
    } catch (error) {
      console.error('Failed to disable DND:', error);
    }
  };

  // Start the focus timer
  const handleStartFocus = () => {
    if (isRunning) {
      // If already running, stop the timer
      handleStopFocus();
      return;
    }

    const totalSeconds = duration * 60;
    setTimeRemaining(totalSeconds);
    
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Start animations
    Animated.parallel([
      // Scale animation for timer circle
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Fade animation for content transition
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsRunning(true);
      fadeAnim.setValue(1);
      
      // Start pulse animation for DND icon
      if (autoEnableDND) {
        enableDND();
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      }

      // Progress will be updated manually in the interval
    });

    // Initialize progress animation
    progressAnim.setValue(0);
    
    // Start countdown timer
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          // Timer completed
          handleFocusComplete();
          return 0;
        }
        // Smoothly update progress animation to match remaining time
        const progressPercent = ((totalSeconds - newValue) / totalSeconds) * 100;
        Animated.timing(progressAnim, {
          toValue: progressPercent,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
        return newValue;
      });
    }, 1000);
  };

  // Stop the focus timer
  const handleStopFocus = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop animations
    pulseAnim.stopAnimation();
    progressAnim.stopAnimation();
    
    // Reset animation values
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    
    setIsRunning(false);
    setTimeRemaining(0);
    
    // Disable DND
    if (isDNDEnabled) {
      disableDND();
    }
  };

  // Handle focus session completion
  const handleFocusComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop animations
    pulseAnim.stopAnimation();
    progressAnim.stopAnimation();
    
    // Completion animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsRunning(false);
    
    // Disable DND
    if (isDNDEnabled) {
      disableDND();
    }

    Alert.alert(
      'Focus Session Complete! 🎉',
      `Great job! You completed a ${duration}-minute focus session.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setTimeRemaining(0);
            progressAnim.setValue(0);
          },
        },
      ]
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for circular progress
  const getProgress = () => {
    if (!isRunning || duration === 0) return 0;
    const totalSeconds = duration * 60;
    return (timeRemaining / totalSeconds) * 100;
  };

  // Animated Circle Component for progress
  const AnimatedCircle = ({ progressAnim, ...props }: any) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const listener = progressAnim.addListener(({ value }: { value: number }) => {
        setProgress(value);
      });
      return () => {
        progressAnim.removeListener(listener);
      };
    }, [progressAnim]);

    const circumference = 2 * Math.PI * 90;
    const strokeDasharray = `${circumference * (progress / 100)} ${circumference}`;

    return <Circle {...props} strokeDasharray={strokeDasharray} />;
  };

  const quotes = [
    'Your focus determines your reality.',
    'Small focus leads to big results.',
    'Focus is the key to productivity.',
    'Where focus goes, energy flows.',
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent={false} />
      <WarpDriveShader />
      <LinearGradient
        colors={['rgba(26, 11, 46, 0.7)', 'rgba(45, 27, 78, 0.7)', 'rgba(61, 43, 94, 0.7)']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Focus Mode</Text>
              <Text style={styles.subtitle}>Stay distraction-free ✨</Text>
            </View>

            {/* Duration Selector */}
            <View style={styles.durationContainer}>
              <Animated.View
                style={[
                  styles.durationCircle,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.durationInner,
                    {
                      opacity: fadeAnim,
                    },
                  ]}
                >
                  {isRunning ? (
                    <>
                      <Text style={styles.durationText}>{formatTime(timeRemaining)}</Text>
                      <View style={styles.durationLabelContainer}>
                        {isDNDEnabled && (
                          <Animated.View
                            style={{
                              transform: [{ scale: pulseAnim }],
                            }}
                          >
                            <Ionicons name="notifications-off" size={16} color="#9CA3AF" style={{ marginRight: 4 }} />
                          </Animated.View>
                        )}
                        <Text style={styles.durationLabel}>Running</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Ionicons name="time-outline" size={32} color="#FFFFFF" />
                      <Text style={styles.durationText}>{duration}</Text>
                      <Text style={styles.durationLabel}>min</Text>
                    </>
                  )}
                </Animated.View>
                <Svg width={200} height={200} style={styles.circleSvg}>
                  <Circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="#6B46C1"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 90} ${2 * Math.PI * 90}`}
                    opacity={0.3}
                  />
                  {isRunning && (
                    <AnimatedCircle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="#E88B6B"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                      progressAnim={progressAnim}
                    />
                  )}
                </Svg>
              </Animated.View>
              {!isRunning && (
                <Animated.View
                  style={[
                    styles.durationControls,
                    {
                      opacity: fadeAnim,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.durationButton}
                    onPress={decreaseDuration}
                    activeOpacity={0.7}
                    disabled={isRunning}
                  >
                    <Text style={styles.durationButtonText}>-5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.durationButton}
                    onPress={increaseDuration}
                    activeOpacity={0.7}
                    disabled={isRunning}
                  >
                    <Text style={styles.durationButtonText}>+5</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
            
            {/* Start/Stop Button */}
            <Animated.View
              style={{
                transform: [{ scale: buttonScaleAnim }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.startButton,
                  isRunning && styles.stopButton,
                ]}
                onPress={handleStartFocus}
                activeOpacity={0.9}
              >
                {isRunning ? (
                  <>
                    <Ionicons name="stop" size={24} color="#FFFFFF" />
                    <Text style={styles.startButtonText}>Stop Focus Session</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="flame" size={24} color="#FFFFFF" />
                    <Text style={styles.startButtonText}>Start Focus Session</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Task Selection Card */}
            <View style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Ionicons name="flag-outline" size={20} color="#FFFFFF" />
                <Text style={styles.taskTitle}>What are you focusing on?</Text>
              </View>
              <TouchableOpacity
                style={styles.taskSelector}
                activeOpacity={0.7}
                onPress={() => {
                  // Handle task selection
                  console.log('Select task');
                }}
              >
                <Text
                  style={[
                    styles.taskSelectorText,
                    selectedTask && styles.taskSelectorTextSelected,
                  ]}
                >
                  {selectedTask || 'Select Task'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Focus Settings */}
            <View style={styles.settingsCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name="notifications-off-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.settingLabel}>Auto Enable DND</Text>
                </View>
                <Switch
                  value={autoEnableDND}
                  onValueChange={setAutoEnableDND}
                  thumbColor={autoEnableDND ? '#FFFFFF' : '#9CA3AF'}
                  trackColor={{ false: '#374151', true: '#6B46C1' }}
                />
              </View>

              <View style={styles.settingDivider} />

              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="people-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.settingLabel}>Allowed Contacts</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={styles.settingDivider} />

              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="apps-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.settingLabel}>Allowed Apps</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            

            {/* Quote */}
            <Text style={styles.quote}>{randomQuote}</Text>
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
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  durationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  circleSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  durationInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  durationLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  durationLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  durationControls: {
    flexDirection: 'row',
    gap: 20,
  },
  durationButton: {
    width: 60,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  durationButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  taskCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  taskSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
  },
  taskSelectorText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  taskSelectorTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#2D2D2D',
    marginHorizontal: 16,
  },
  startButton: {
    backgroundColor: '#E88B6B',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
    shadowColor: '#E88B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quote: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default FocusScreen;
