import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Octicons from 'react-native-vector-icons/Octicons';
import { ListTodo, Cake, Goal } from 'lucide-react-native';



const { width, height } = Dimensions.get('window');
const NAV_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 80;

export interface ActionDrawerProps {
  visible: boolean;
  onClose: () => void;
  onBirthdayPress?: () => void;
  onTodoPress?: () => void;
  onWorkingLocationPress?: () => void;
  onTaskPress?: () => void;
  onEventPress?: () => void;
  bottomOffset?: number; // Custom bottom offset if needed
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({
  visible,
  onClose,
  onBirthdayPress,
  onTodoPress,
  onWorkingLocationPress,
  onTaskPress,
  onEventPress,
  bottomOffset = NAV_BAR_HEIGHT + 20,
}) => {
  // Animation values
  const drawerBackdropOpacity = useRef(new Animated.Value(0)).current;
  const drawerButton1Anim = useRef(new Animated.Value(0)).current;
  const drawerButton2Anim = useRef(new Animated.Value(0)).current;
  const drawerButton3Anim = useRef(new Animated.Value(0)).current;
  const drawerButton4Anim = useRef(new Animated.Value(0)).current;
  const drawerButton5Anim = useRef(new Animated.Value(0)).current;
  const drawerCloseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset all animations
      drawerButton1Anim.setValue(0);
      drawerButton2Anim.setValue(0);
      drawerButton3Anim.setValue(0);
      drawerButton4Anim.setValue(0);
      drawerButton5Anim.setValue(0);
      drawerCloseAnim.setValue(0);

      // Animate backdrop
      Animated.timing(drawerBackdropOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // Staggered button animations
      const createButtonAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.parallel([
          Animated.spring(animValue, {
            toValue: 1,
            tension: 50,
            friction: 7,
            delay,
            useNativeDriver: true,
          }),
        ]);
      };

      Animated.parallel([
        createButtonAnimation(drawerButton1Anim, 50),
        createButtonAnimation(drawerButton2Anim, 100),
        createButtonAnimation(drawerButton3Anim, 150),
        createButtonAnimation(drawerButton4Anim, 200),
        createButtonAnimation(drawerButton5Anim, 250),
        createButtonAnimation(drawerCloseAnim, 300),
      ]).start();
    } else {
      // Close animations
      Animated.parallel([
        Animated.timing(drawerBackdropOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(drawerButton1Anim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(drawerButton2Anim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(drawerButton3Anim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(drawerButton4Anim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(drawerButton5Anim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(drawerCloseAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleButtonPress = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.drawerModalContainer}>
        <Animated.View
          style={[
            styles.drawerBackdrop,
            {
              opacity: drawerBackdropOpacity,
            },
          ]}
        />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.drawerContainer, { paddingBottom: bottomOffset }]} pointerEvents="box-none">
          <View style={styles.drawerButtonsContainer}>
            {/* Birthday Button */}
            <Animated.View
              style={[
                styles.drawerButtonWrapper,
                {
                  transform: [
                    {
                      scale: drawerButton1Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                    {
                      translateY: drawerButton1Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                  opacity: drawerButton1Anim,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.drawerButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress(onBirthdayPress)}
              >
                <Cake size={24} color="#FFFFFF" />
                <Text style={styles.drawerButtonText}>Birthday</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Out of Office Button */}
            <Animated.View
              style={[
                styles.drawerButtonWrapper,
                {
                  transform: [
                    {
                      scale: drawerButton2Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                    {
                      translateY: drawerButton2Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                  opacity: drawerButton2Anim,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.drawerButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress(onTodoPress)}
              >
                <ListTodo size={24} color="#FFFFFF" />
                <Text style={styles.drawerButtonText}>To do</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Working Location Button */}
            <Animated.View
              style={[
                styles.drawerButtonWrapper,
                {
                  transform: [
                    {
                      scale: drawerButton3Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                    {
                      translateY: drawerButton3Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                  opacity: drawerButton3Anim,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.drawerButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress(onWorkingLocationPress)}
              >
                <Goal size={24} color="#FFFFFF" />
                <Text style={styles.drawerButtonText}>Goal</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Task Button */}
            <Animated.View
              style={[
                styles.drawerButtonWrapper,
                {
                  transform: [
                    {
                      scale: drawerButton4Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                    {
                      translateY: drawerButton4Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                  opacity: drawerButton4Anim,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.drawerButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress(onTaskPress)}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.drawerButtonText}>Task</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Event Button */}
            <Animated.View
              style={[
                styles.drawerButtonWrapper,
                {
                  transform: [
                    {
                      scale: drawerButton5Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                    {
                      translateY: drawerButton5Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                  opacity: drawerButton5Anim,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.drawerButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress(onEventPress)}
              >
                <MaterialIcons name="event" size={24} color="#FFFFFF" />
                <Text style={styles.drawerButtonText}>Event</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Close Button */}
            <Animated.View
              style={[
                styles.drawerCloseButtonWrapper,
                {
                  transform: [
                    {
                      scale: drawerCloseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                  opacity: drawerCloseAnim,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.drawerCloseButton}
                activeOpacity={0.8}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  drawerModalContainer: {
    flex: 1,
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  drawerButtonsContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
  drawerButtonWrapper: {
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerButton: {
    minWidth: 88,
    height: 52,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 26,
    backgroundColor: '#E88B6B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerCloseButtonWrapper: {
    marginTop: 8,
  },
  drawerCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFB6C1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActionDrawer;

