import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import Colors from '@/constants/colors';
import { useFinance } from '@/lib/finance-context';
import { useSettings } from '@/lib/settings-context';
import { getMonthLabelShortLocalized } from '@/lib/i18n';
import PlanetNode from './PlanetNode';

const { width: SCREEN_W } = Dimensions.get('window');
const NODE_WIDTH = 80;
const PADDING = SCREEN_W / 2 - NODE_WIDTH / 2;

interface TimelineProps {
  onLongPressMonth?: (monthKey: string) => void;
}

export default function Timeline({ onLongPressMonth }: TimelineProps) {
  const { months, selectedMonthKey, setSelectedMonthKey, currentMonthKey } = useFinance();
  const { language } = useSettings();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const idx = months.findIndex(m => m.key === selectedMonthKey);
    if (idx >= 0 && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: idx * NODE_WIDTH,
          animated: true,
        });
      }, 300);
    }
  }, [selectedMonthKey, months.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: PADDING }}
        decelerationRate="fast"
        snapToInterval={NODE_WIDTH}
        snapToAlignment="center"
      >
        {months.map((month, index) => (
          <View key={month.key} style={styles.nodeWrapper}>
            <PlanetNode
              month={month}
              isSelected={month.key === selectedMonthKey}
              isCurrent={month.key === currentMonthKey}
              onPress={() => setSelectedMonthKey(month.key)}
              onLongPress={() => onLongPressMonth?.(month.key)}
            />
            <Text
              style={[
                styles.label,
                month.key === selectedMonthKey && styles.labelSelected,
                month.key === currentMonthKey && styles.labelCurrent,
              ]}
            >
              {getMonthLabelShortLocalized(month.key, language)}
            </Text>
            <Text style={styles.yearLabel}>{month.year}</Text>
            {index < months.length - 1 && (
              <View style={styles.connector} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
  },
  nodeWrapper: {
    width: NODE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 11,
    color: Colors.textDim,
    marginTop: 4,
  },
  labelSelected: {
    color: Colors.accent,
  },
  labelCurrent: {
    color: Colors.textSecondary,
  },
  yearLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 9,
    color: Colors.textDim,
    marginTop: 1,
  },
  connector: {
    position: 'absolute',
    right: -1,
    top: 40,
    width: 2,
    height: 1,
    backgroundColor: Colors.border,
  },
});
