import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const STAR_COUNT = Platform.OS === 'web' ? 40 : 60;

interface StarData {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function AnimatedStar({ star }: { star: StarData }) {
  const opacity = useSharedValue(0.1);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withTiming(0.8, { duration: star.duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: Colors.star,
        },
        animStyle,
      ]}
    />
  );
}

export default function StarField() {
  const stars = useMemo<StarData[]>(() => {
    return Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 4000,
      duration: 3000 + Math.random() * 4000,
    }));
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((star, i) => (
        <AnimatedStar key={i} star={star} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
