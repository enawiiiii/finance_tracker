import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Dimensions, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useFinance } from '@/lib/finance-context';
import { useSettings } from '@/lib/settings-context';
import { t, getMonthLabelShortLocalized } from '@/lib/i18n';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface ConstellationViewProps {
  visible: boolean;
  onClose: () => void;
  year: number;
}

export default function ConstellationView({ visible, onClose, year }: ConstellationViewProps) {
  const { months } = useFinance();
  const { language, isRTL } = useSettings();

  const yearMonths = useMemo(() => {
    return months.filter(m => m.year === year).slice(0, 12);
  }, [months, year]);

  const stars = useMemo(() => {
    const centerX = SCREEN_W * 0.5;
    const centerY = SCREEN_H * 0.4;
    const radiusX = SCREEN_W * 0.32;
    const radiusY = SCREEN_H * 0.18;

    return yearMonths.map((m, i) => {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;

      const brightness = m.transactions.length === 0
        ? 0.15
        : Math.min(1, 0.3 + m.stability * 0.7);

      const size = m.transactions.length === 0 ? 4 : 4 + Math.min(8, m.transactions.length * 0.8);

      return { x, y, brightness, size, month: m, label: getMonthLabelShortLocalized(m.key, language) };
    });
  }, [yearMonths, language]);

  const lines = useMemo(() => {
    if (stars.length < 2) return [];
    const result: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < stars.length - 1; i++) {
      result.push({
        x1: stars[i].x,
        y1: stars[i].y,
        x2: stars[i + 1].x,
        y2: stars[i + 1].y,
      });
    }
    return result;
  }, [stars]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.background} />

        {lines.map((line, i) => {
          const dx = line.x2 - line.x1;
          const dy = line.y2 - line.y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`line-${i}`}
              style={[
                styles.constellationLine,
                {
                  left: line.x1,
                  top: line.y1,
                  width: length,
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          );
        })}

        {stars.map((star, i) => (
          <View
            key={`star-${i}`}
            style={[
              styles.starContainer,
              { left: star.x - 20, top: star.y - 20 },
            ]}
          >
            <View
              style={[
                styles.star,
                {
                  width: star.size,
                  height: star.size,
                  borderRadius: star.size / 2,
                  opacity: star.brightness,
                  shadowOpacity: star.brightness * 0.8,
                  shadowRadius: star.size,
                },
              ]}
            />
            <Text style={[styles.starLabel, { opacity: Math.max(0.3, star.brightness) }]}>
              {star.label}
            </Text>
          </View>
        ))}

        <View style={[styles.titleContainer, { top: Platform.OS === 'web' ? 80 : 60 }]}>
          <Text style={styles.yearTitle}>{year}</Text>
          <Text style={styles.subtitle}>{t(language, 'constellation')}</Text>
        </View>

        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={16}>
          <Ionicons name="close" size={24} color={Colors.textSecondary} />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#030710',
  },
  constellationLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(200, 210, 230, 0.08)',
    transformOrigin: 'left center',
  },
  starContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    backgroundColor: '#E8EEFF',
    shadowColor: '#E8EEFF',
    shadowOffset: { width: 0, height: 0 },
  },
  starLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 8,
    color: 'rgba(200, 210, 230, 0.6)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 4,
  },
  yearTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 32,
    color: 'rgba(200, 210, 230, 0.3)',
    letterSpacing: 6,
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 11,
    color: 'rgba(200, 210, 230, 0.2)',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 72 : 56,
    right: 24,
    padding: 8,
  },
});
