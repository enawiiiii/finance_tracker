import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Colors from '@/constants/colors';
import { MonthData, Transaction } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';
import { t, formatMoney } from '@/lib/i18n';
import TransactionItem from './TransactionItem';
import CategoryEcho from './CategoryEcho';

interface MonthDetailProps {
  month: MonthData;
  onEditTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onLongPressTransaction?: (t: Transaction) => void;
}

function getReflectionKey(month: MonthData): string {
  if (month.transactions.length === 0) return 'reflectionSilence';
  if (month.income === 0 && month.expense > 0) return 'reflectionOutward';
  if (month.stability > 0.7) return 'reflectionSteady';
  if (month.stability > 0.4) return 'reflectionDrift';
  if (month.balance < 0) return 'reflectionPull';
  return 'reflectionMovement';
}

export default function MonthDetail({ month, onEditTransaction, onDeleteTransaction, onLongPressTransaction }: MonthDetailProps) {
  const { language, currency, silenceMode, isRTL, animationsEnabled } = useSettings();
  const reflectionKey = getReflectionKey(month);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      onEdit={() => onEditTransaction(item)}
      onDelete={() => onDeleteTransaction(item.id)}
      onLongPress={() => onLongPressTransaction?.(item)}
    />
  );

  const sortedTransactions = [...month.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayValue = (val: number) => silenceMode ? t(language, 'hidden') : formatMoney(val, currency, true);

  return (
    <View style={styles.container}>
      {animationsEnabled && <CategoryEcho month={month} />}

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, isRTL && styles.textRight]}>{t(language, 'in')}</Text>
          <Text style={[styles.summaryValue, styles.incomeValue]}>
            {displayValue(month.income)}
          </Text>
        </View>
        <View style={styles.orbitalDivider}>
          <View style={styles.dividerDot} />
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, isRTL && styles.textRight]}>{t(language, 'out')}</Text>
          <Text style={[styles.summaryValue, styles.expenseValue]}>
            {displayValue(month.expense)}
          </Text>
        </View>
        <View style={styles.orbitalDivider}>
          <View style={styles.dividerDot} />
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, isRTL && styles.textRight]}>{t(language, 'net')}</Text>
          <Text style={[styles.summaryValue, month.balance >= 0 ? styles.incomeValue : styles.expenseValue]}>
            {displayValue(month.balance)}
          </Text>
        </View>
      </View>

      {month.transactions.length > 0 && !silenceMode && (
        <View style={styles.reflectionContainer}>
          <Text style={[styles.reflectionText, isRTL && styles.textRight]}>
            {t(language, reflectionKey as any)}
          </Text>
        </View>
      )}

      <View style={styles.orbitalBar}>
        {month.income + month.expense > 0 && (
          <>
            <View
              style={[
                styles.orbitalSegment,
                styles.incomeSegment,
                { flex: month.income / (month.income + month.expense) || 0.001 },
              ]}
            />
            <View
              style={[
                styles.orbitalSegment,
                styles.expenseSegment,
                { flex: month.expense / (month.income + month.expense) || 0.001 },
              ]}
            />
          </>
        )}
        {month.income + month.expense === 0 && (
          <View style={[styles.orbitalSegment, styles.emptySegment, { flex: 1 }]} />
        )}
      </View>

      {sortedTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t(language, 'noSignals')}</Text>
          <Text style={styles.emptySubtext}>{t(language, 'tapToLog')}</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTransactions}
          keyExtractor={item => item.id}
          renderItem={renderTransaction}
          scrollEnabled={sortedTransactions.length > 0}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 11,
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  textRight: {
    textAlign: 'right',
  },
  summaryValue: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
  },
  incomeValue: {
    color: Colors.income,
  },
  expenseValue: {
    color: Colors.expense,
  },
  orbitalDivider: {
    width: 20,
    height: 1,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textDim,
  },
  reflectionContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reflectionText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
    textAlign: 'center',
    lineHeight: 20,
  },
  orbitalBar: {
    flexDirection: 'row',
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 8,
    gap: 2,
  },
  orbitalSegment: {
    height: 3,
    borderRadius: 1.5,
  },
  incomeSegment: {
    backgroundColor: Colors.income,
  },
  expenseSegment: {
    backgroundColor: Colors.expense,
  },
  emptySegment: {
    backgroundColor: Colors.border,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 15,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 13,
    color: Colors.textDim,
  },
  list: {
    flex: 1,
  },
});
