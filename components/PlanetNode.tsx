import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { MonthData } from '@/lib/types';
import { getPlanetTheme, getOrbitRings } from '@/lib/planet-colors';
import { useSettings } from '@/lib/settings-context';

interface PlanetNodeProps {
  month: MonthData;
  isSelected: boolean;
  isCurrent: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PlanetNode({ month, isSelected, isCurrent, onPress, onLongPress }: PlanetNodeProps) {
  const { animationsEnabled } = useSettings();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const theme = getPlanetTheme(month);
  const rings = getOrbitRings(month);

  useEffect(() => {
    if (!animationsEnabled) {
      scale.value = isSelected ? 1.15 : 1;
      glowOpacity.value = isSelected ? 1 : (isCurrent ? 0.6 : 0.2);
      pulseScale.value = 1;
      return;
    }

    scale.value = withTiming(isSelected ? 1.15 : 1, { duration: 600, easing: Easing.out(Easing.exp) });
    glowOpacity.value = withTiming(isSelected ? 1 : (isCurrent ? 0.6 : 0.2), { duration: 600 });

    if (isCurrent) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [isSelected, isCurrent, animationsEnabled]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleLongPress = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  }, [onLongPress]);

  const planetSize = isSelected ? 44 : isCurrent ? 38 : 30;
  const glowSize = planetSize + 30;

  return (
    <AnimatedPressable
      style={[styles.container, containerStyle]}
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={600}
    >
      <Animated.View
        style={[
          styles.glow,
          glowStyle,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: theme.glow,
          },
        ]}
      />

      {rings.map((ring, i) => (
        <View
          key={`ring-${i}`}
          style={[
            styles.ring,
            {
              width: planetSize + ring.radius * 2,
              height: planetSize + ring.radius * 2,
              borderRadius: (planetSize + ring.radius * 2) / 2,
              borderColor: ring.color,
              borderWidth: 1,
              opacity: ring.opacity,
            },
          ]}
        />
      ))}

      <View
        style={[
          styles.planet,
          {
            width: planetSize,
            height: planetSize,
            borderRadius: planetSize / 2,
            backgroundColor: theme.color,
            shadowColor: theme.shadowColor,
          },
        ]}
      />

      {isSelected && (
        <View style={[styles.innerGlow, {
          width: planetSize * 0.35,
          height: planetSize * 0.35,
          borderRadius: planetSize * 0.175,
        }]} />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  glow: {
    position: 'absolute',
  },
  ring: {
    position: 'absolute',
  },
  planet: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  innerGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    top: '32%',
    left: '32%',
  },
});
