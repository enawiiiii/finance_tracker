import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { FinancialIdentity } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';

interface IdentityBadgeProps {
  identity: FinancialIdentity;
}

export default function IdentityBadge({ identity }: IdentityBadgeProps) {
  const { isRTL, animationsEnabled, silenceMode } = useSettings();
  const glowPulse = useSharedValue(0.4);

  useEffect(() => {
    if (!animationsEnabled) {
      glowPulse.value = 0.5;
      return;
    }
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [animationsEnabled]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.row, isRTL && styles.rowRTL]}>
        <Animated.View style={[styles.glowDot, glowStyle]} />
        <Text style={styles.name}>{identity.name}</Text>
      </View>
      {!silenceMode && (
        <Text style={[styles.message, isRTL && styles.messageRTL]}>{identity.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  name: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 13,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  message: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    paddingLeft: 14,
    lineHeight: 19,
  },
  messageRTL: {
    paddingLeft: 0,
    paddingRight: 14,
    textAlign: 'right',
  },
});
