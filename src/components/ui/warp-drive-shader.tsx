import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const WarpDriveShader = () => {
  const { width, height } = useWindowDimensions();
  const animValue1 = useRef(new Animated.Value(0)).current;
  const animValue2 = useRef(new Animated.Value(0)).current;
  const animValue3 = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create multiple animated loops for the warp effect
    const createAnimation = (animValue: Animated.Value, duration: number, delay: number = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start all animations
    createAnimation(animValue1, 3000, 0).start();
    createAnimation(animValue2, 4000, 500).start();
    createAnimation(animValue3, 5000, 1000).start();

    // Scale and rotate animation for tunnel effect
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Base dark background */}
      <View style={[styles.background, { width, height }]} />
      
      {/* Animated gradient circles for warp effect */}
      <Animated.View
        style={[
          styles.circle,
          {
            width: maxRadius * 2,
            height: maxRadius * 2,
            left: centerX - maxRadius,
            top: centerY - maxRadius,
            transform: [
              { scale: scaleAnim },
              { rotate },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#FF0066', '#00FF66', '#0066FF', '#FF0066']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Additional layers for depth */}
      <Animated.View
        style={[
          styles.circle,
          {
            width: maxRadius * 1.5,
            height: maxRadius * 1.5,
            left: centerX - maxRadius * 0.75,
            top: centerY - maxRadius * 0.75,
            transform: [
              { scale: animValue2 },
              { rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg'],
                })},
            ],
            opacity: 0.6,
          },
        ]}
      >
        <LinearGradient
          colors={['#0066FF', '#FF0066', '#00FF66', '#0066FF']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.circle,
          {
            width: maxRadius * 1.2,
            height: maxRadius * 1.2,
            left: centerX - maxRadius * 0.6,
            top: centerY - maxRadius * 0.6,
            transform: [
              { scale: animValue3 },
              { rotate },
            ],
            opacity: 0.4,
          },
        ]}
      >
        <LinearGradient
          colors={['#00FF66', '#0066FF', '#FF0066', '#00FF66']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    backgroundColor: '#000000',
  },
  circle: {
    position: 'absolute',
    borderRadius: 10000,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default WarpDriveShader;

