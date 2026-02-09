import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Transaction, CATEGORY_ICONS } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';
import { t, formatMoney, getCategoryKey } from '@/lib/i18n';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  onLongPress?: () => void;
}

export default function TransactionItem({ transaction, onEdit, onDelete, onLongPress }: TransactionItemProps) {
  const { language, currency, silenceMode, isRTL } = useSettings();
  const icon = CATEGORY_ICONS[transaction.category];
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete();
  };

  const handleLongPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };

  const catKey = getCategoryKey(transaction.category);
  const categoryLabel = t(language, catKey);

  return (
    <Pressable
      style={[styles.container, isRTL && styles.containerRTL]}
      onPress={onEdit}
      onLongPress={handleLongPress}
      delayLongPress={600}
    >
      <View style={[styles.iconContainer, isIncome ? styles.iconIncome : styles.iconExpense]}>
        <Ionicons
          name={icon?.name as any || 'ellipse-outline'}
          size={18}
          color={isIncome ? Colors.income : Colors.expense}
        />
      </View>

      <View style={styles.details}>
        <Text style={[styles.category, isRTL && styles.textRight]} numberOfLines={1}>
          {categoryLabel}
        </Text>
        {transaction.note ? (
          <Text style={[styles.note, isRTL && styles.textRight]} numberOfLines={1}>
            {transaction.note}
          </Text>
        ) : null}
      </View>

      <View style={[styles.rightSection, isRTL && styles.rightSectionRTL]}>
        <Text style={[styles.amount, isIncome ? styles.amountIncome : styles.amountExpense]}>
          {silenceMode
            ? t(language, 'hidden')
            : `${isIncome ? '+' : '-'}${formatMoney(transaction.amount, currency)}`
          }
        </Text>
        <Pressable onPress={handleDelete} hitSlop={12} style={styles.deleteBtn}>
          <Ionicons name="close-circle-outline" size={16} color={Colors.textDim} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconIncome: {
    backgroundColor: Colors.incomeGlow,
  },
  iconExpense: {
    backgroundColor: Colors.expenseGlow,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  category: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textRight: {
    textAlign: 'right',
  },
  note: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: Colors.textDim,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightSectionRTL: {
    flexDirection: 'row-reverse',
  },
  amount: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 14,
  },
  amountIncome: {
    color: Colors.income,
  },
  amountExpense: {
    color: Colors.expense,
  },
  deleteBtn: {
    padding: 4,
  },
});
