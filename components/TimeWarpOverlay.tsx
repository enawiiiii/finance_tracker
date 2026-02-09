import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useSettings } from '@/lib/settings-context';
import { t, formatMoney } from '@/lib/i18n';
import { Transaction, MonthData } from '@/lib/types';

interface TimeWarpOverlayProps {
  month: MonthData;
  transaction: Transaction;
  onClose: () => void;
}

export default function TimeWarpOverlay({ month, transaction, onClose }: TimeWarpOverlayProps) {
  const { language, currency, isRTL } = useSettings();

  const alternate = useMemo(() => {
    const isIncome = transaction.type === 'income';
    const altBalance = isIncome
      ? month.balance - transaction.amount
      : month.balance + transaction.amount;
    const altExpense = isIncome ? month.expense : month.expense - transaction.amount;
    const altIncome = isIncome ? month.income - transaction.amount : month.income;
    return { altBalance, altExpense, altIncome };
  }, [month, transaction]);

  const diff = alternate.altBalance - month.balance;

  return (
    <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(300)} style={styles.container}>
      <View style={styles.backdrop} />
      <View style={styles.card}>
        <View style={[styles.headerRow, isRTL && styles.rowRTL]}>
          <Ionicons name="time-outline" size={18} color="#6B9FD4" />
          <Text style={styles.title}>{t(language, 'timeWarp')}</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color={Colors.textDim} />
          </Pressable>
        </View>

        <Text style={[styles.hint, isRTL && styles.textRight]}>
          {t(language, 'timeWarpHint')}
        </Text>

        <View style={styles.comparisonRow}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>NOW</Text>
            <Text style={styles.comparisonValue}>{formatMoney(month.balance, currency, true)}</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={Colors.textDim} />
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>ALT</Text>
            <Text style={[styles.comparisonValue, diff > 0 ? styles.positive : diff < 0 ? styles.negative : null]}>
              {formatMoney(alternate.altBalance, currency, true)}
            </Text>
          </View>
        </View>

        <View style={styles.diffRow}>
          <Text style={[styles.diffText, diff > 0 ? styles.positive : diff < 0 ? styles.negative : null]}>
            {diff > 0 ? '+' : ''}{formatMoney(diff, currency, true)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 11, 24, 0.85)',
  },
  card: {
    width: '100%',
    backgroundColor: Colors.bgLight,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(107, 159, 212, 0.2)',
    shadowColor: '#6B9FD4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 15,
    color: '#6B9FD4',
    flex: 1,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  hint: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: Colors.textDim,
    marginBottom: 20,
    fontStyle: 'italic' as const,
  },
  textRight: {
    textAlign: 'right',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  comparisonItem: {
    alignItems: 'center',
    gap: 4,
  },
  comparisonLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 2,
  },
  comparisonValue: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
  },
  positive: {
    color: '#5CB8A5',
  },
  negative: {
    color: '#C4726F',
  },
  diffRow: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  diffText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
});
