import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFinance } from '@/lib/finance-context';
import { useSettings } from '@/lib/settings-context';
import { t, formatMoney, getMonthLabelLocalized } from '@/lib/i18n';
import { Transaction } from '@/lib/types';
import StarField from '@/components/StarField';
import Timeline from '@/components/Timeline';
import MonthDetail from '@/components/MonthDetail';
import IdentityBadge from '@/components/IdentityBadge';
import TransactionModal from '@/components/TransactionModal';
import SettingsModal from '@/components/SettingsModal';
import TimeWarpOverlay from '@/components/TimeWarpOverlay';
import ConstellationView from '@/components/ConstellationView';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    selectedMonth,
    identity,
    totalBalance,
    addTransaction,
    editTransaction,
    deleteTransaction,
    isLoading,
  } = useFinance();
  const { language, currency, silenceMode, isRTL } = useSettings();

  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [timeWarpTransaction, setTimeWarpTransaction] = useState<Transaction | null>(null);
  const [constellationYear, setConstellationYear] = useState<number | null>(null);

  const handleAdd = useCallback(() => {
    setEditingTransaction(null);
    setModalVisible(true);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleEdit = useCallback((tr: Transaction) => {
    setEditingTransaction(tr);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteTransaction(id);
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [deleteTransaction]);

  const handleSubmit = useCallback((data: { amount: number; type: 'income' | 'expense'; category: string; note: string; date: string }) => {
    if (editingTransaction) {
      editTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
  }, [editingTransaction, editTransaction, addTransaction]);

  const handleTimeWarp = useCallback((tr: Transaction) => {
    setTimeWarpTransaction(tr);
  }, []);

  const handleLongPressMonth = useCallback((monthKey: string) => {
    const year = parseInt(monthKey.split('-')[0]);
    setConstellationYear(year);
  }, []);

  if (isLoading) {
    return <View style={[styles.container, { paddingTop: insets.top }]} />;
  }

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const balanceDisplay = silenceMode ? t(language, 'hidden') : formatMoney(totalBalance, currency, true);

  return (
    <View style={styles.container}>
      <StarField />

      <View style={[
        styles.header,
        { paddingTop: (Platform.OS === 'web' ? webTopInset : insets.top) + 16 },
        isRTL && styles.headerRTL,
      ]}>
        <View style={[styles.headerLeft, isRTL && styles.headerLeftRTL]}>
          <Pressable onPress={() => setSettingsVisible(true)} hitSlop={8}>
            <Ionicons name="planet-outline" size={20} color={Colors.textDim} />
          </Pressable>
          <View>
            <Text style={[styles.balanceLabel, isRTL && styles.textRight]}>
              {t(language, 'totalBalance')}
            </Text>
            <Text style={[styles.balanceValue, totalBalance < 0 && !silenceMode && styles.balanceNegative]}>
              {balanceDisplay}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        >
          <Ionicons name="add" size={24} color={Colors.bg} />
        </Pressable>
      </View>

      <IdentityBadge identity={identity} />

      <Timeline onLongPressMonth={handleLongPressMonth} />

      {selectedMonth && (
        <View style={[styles.detailContainer, { paddingBottom: (Platform.OS === 'web' ? webBottomInset : insets.bottom) + 8 }]}>
          <Text style={styles.monthTitle}>
            {getMonthLabelLocalized(selectedMonth.key, language)}
          </Text>
          <MonthDetail
            month={selectedMonth}
            onEditTransaction={handleEdit}
            onDeleteTransaction={handleDelete}
            onLongPressTransaction={handleTimeWarp}
          />
        </View>
      )}

      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        editingTransaction={editingTransaction}
      />

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {timeWarpTransaction && selectedMonth && (
        <TimeWarpOverlay
          month={selectedMonth}
          transaction={timeWarpTransaction}
          onClose={() => setTimeWarpTransaction(null)}
        />
      )}

      {constellationYear !== null && (
        <ConstellationView
          visible={true}
          year={constellationYear}
          onClose={() => setConstellationYear(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLeftRTL: {
    flexDirection: 'row-reverse',
  },
  balanceLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 11,
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  textRight: {
    textAlign: 'right',
  },
  balanceValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  balanceNegative: {
    color: Colors.expense,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  addBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  detailContainer: {
    flex: 1,
    marginTop: 4,
  },
  monthTitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
});
