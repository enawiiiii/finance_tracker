import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { MonthData } from '@/lib/types';

interface EchoData {
  color: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  count: number;
}

function EchoPulse({ echo }: { echo: EchoData }) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      echo.delay,
      withRepeat(
        withTiming(1.8, { duration: 3000 + echo.count * 500, easing: Easing.out(Easing.ease) }),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      echo.delay,
      withRepeat(
        withTiming(0.12 + echo.count * 0.03, { duration: 3000 + echo.count * 500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: echo.x - echo.size / 2,
          top: echo.y - echo.size / 2,
          width: echo.size,
          height: echo.size,
          borderRadius: echo.size / 2,
          backgroundColor: echo.color,
        },
        style,
      ]}
    />
  );
}

interface CategoryEchoProps {
  month: MonthData;
}

const ECHO_COLORS: Record<string, string> = {
  'Food & Dining': 'rgba(212, 149, 106, 0.3)',
  'Drinks & Coffee': 'rgba(201, 180, 88, 0.25)',
  'Transportation': 'rgba(107, 159, 212, 0.3)',
  'Rent / Housing': 'rgba(92, 184, 165, 0.25)',
  'Utilities': 'rgba(150, 130, 200, 0.25)',
  'Subscriptions': 'rgba(196, 114, 111, 0.25)',
  'Shopping': 'rgba(212, 149, 106, 0.25)',
  'Entertainment': 'rgba(201, 180, 88, 0.3)',
  'Health': 'rgba(92, 184, 165, 0.3)',
  'Travel': 'rgba(107, 159, 212, 0.25)',
  'Education': 'rgba(150, 130, 200, 0.3)',
};

const DEFAULT_ECHO_COLOR = 'rgba(120, 130, 160, 0.2)';

export default function CategoryEcho({ month }: CategoryEchoProps) {
  const echoes = useMemo<EchoData[]>(() => {
    const catCounts: Record<string, number> = {};
    month.transactions.filter(t => t.type === 'expense').forEach(t => {
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    const repeated = Object.entries(catCounts).filter(([, count]) => count > 1);
    if (repeated.length === 0) return [];

    return repeated.map(([cat, count], i) => ({
      color: ECHO_COLORS[cat] || DEFAULT_ECHO_COLOR,
      x: 40 + (i * 80) % 280,
      y: 20 + Math.random() * 40,
      size: 20 + count * 6,
      delay: i * 800,
      count,
    }));
  }, [month.transactions]);

  if (echoes.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {echoes.map((echo, i) => (
        <EchoPulse key={`echo-${i}`} echo={echo} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 80,
    overflow: 'hidden',
  },
});
