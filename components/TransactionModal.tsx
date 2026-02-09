import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';
import { t, getCurrencySymbol, getCategoryKey } from '@/lib/i18n';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; type: TransactionType; category: string; note: string; date: string }) => void;
  editingTransaction?: Transaction | null;
}

export default function TransactionModal({ visible, onClose, onSubmit, editingTransaction }: TransactionModalProps) {
  const { language, currency, isRTL } = useSettings();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setNote(editingTransaction.note);
      setDate(editingTransaction.date);
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setNote('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [editingTransaction, visible]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const currencySymbol = getCurrencySymbol(currency);

  const handleSubmit = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0 || !category) return;

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onSubmit({
      amount: parsed,
      type,
      category,
      note,
      date,
    });
    onClose();
  };

  const isValid = parseFloat(amount) > 0 && category.length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
            <View style={[styles.header, isRTL && styles.headerRTL]}>
              <Text style={styles.title}>
                {editingTransaction ? t(language, 'editEntry') : t(language, 'newEntry')}
              </Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
              <View style={styles.typeToggle}>
                <Pressable
                  style={[styles.typeBtn, type === 'income' && styles.typeBtnIncomeActive]}
                  onPress={() => { setType('income'); setCategory(''); }}
                >
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={18}
                    color={type === 'income' ? Colors.income : Colors.textDim}
                  />
                  <Text style={[styles.typeText, type === 'income' && styles.typeTextIncomeActive]}>
                    {t(language, 'income')}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpenseActive]}
                  onPress={() => { setType('expense'); setCategory(''); }}
                >
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={18}
                    color={type === 'expense' ? Colors.expense : Colors.textDim}
                  />
                  <Text style={[styles.typeText, type === 'expense' && styles.typeTextExpenseActive]}>
                    {t(language, 'expense')}
                  </Text>
                </Pressable>
              </View>

              <View style={[styles.amountContainer, isRTL && styles.amountContainerRTL]}>
                <Text style={styles.currencySign}>{currencySymbol}</Text>
                <TextInput
                  style={[styles.amountInput, isRTL && styles.amountInputRTL]}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={Colors.textDim}
                  selectionColor={Colors.accent}
                />
              </View>

              <Text style={[styles.sectionLabel, isRTL && styles.textRight]}>
                {t(language, 'category')}
              </Text>
              <View style={styles.categoryGrid}>
                {categories.map(cat => {
                  const icon = CATEGORY_ICONS[cat];
                  const selected = category === cat;
                  const catKey = getCategoryKey(cat);
                  return (
                    <Pressable
                      key={cat}
                      style={[styles.categoryChip, selected && (type === 'income' ? styles.categoryChipIncomeSelected : styles.categoryChipExpenseSelected)]}
                      onPress={() => {
                        setCategory(cat);
                        if (Platform.OS !== 'web') Haptics.selectionAsync();
                      }}
                    >
                      <Ionicons
                        name={icon?.name as any || 'ellipse-outline'}
                        size={16}
                        color={selected ? (type === 'income' ? Colors.income : Colors.expense) : Colors.textDim}
                      />
                      <Text
                        style={[styles.categoryText, selected && { color: type === 'income' ? Colors.income : Colors.expense }]}
                        numberOfLines={1}
                      >
                        {t(language, catKey)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.sectionLabel, isRTL && styles.textRight]}>
                {t(language, 'noteOptional')}
              </Text>
              <TextInput
                style={[styles.noteInput, isRTL && styles.textRight]}
                value={note}
                onChangeText={setNote}
                placeholder={t(language, 'addNote')}
                placeholderTextColor={Colors.textDim}
                selectionColor={Colors.accent}
                multiline
                textAlign={isRTL ? 'right' : 'left'}
              />

              <Text style={[styles.sectionLabel, isRTL && styles.textRight]}>
                {t(language, 'date')}
              </Text>
              <TextInput
                style={styles.dateInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textDim}
                selectionColor={Colors.accent}
              />

              <Pressable
                style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text style={styles.submitText}>
                  {editingTransaction ? t(language, 'updateTrajectory') : t(language, 'logEntry')}
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.bgLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'web' ? 34 : 40,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  scrollContent: {
    flexGrow: 0,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtnIncomeActive: {
    borderColor: Colors.income,
    backgroundColor: Colors.incomeGlow,
  },
  typeBtnExpenseActive: {
    borderColor: Colors.expense,
    backgroundColor: Colors.expenseGlow,
  },
  typeText: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 14,
    color: Colors.textDim,
  },
  typeTextIncomeActive: {
    color: Colors.income,
  },
  typeTextExpenseActive: {
    color: Colors.expense,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 4,
  },
  amountContainerRTL: {
    flexDirection: 'row-reverse',
  },
  currencySign: {
    fontFamily: 'SpaceGrotesk_300Light',
    fontSize: 36,
    color: Colors.textDim,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 42,
    color: Colors.textPrimary,
    padding: 0,
  },
  amountInputRTL: {
    textAlign: 'right',
  },
  sectionLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textRight: {
    textAlign: 'right',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipIncomeSelected: {
    borderColor: Colors.income,
    backgroundColor: Colors.incomeGlow,
  },
  categoryChipExpenseSelected: {
    borderColor: Colors.expense,
    backgroundColor: Colors.expenseGlow,
  },
  categoryText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: Colors.textDim,
  },
  noteInput: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
  },
  dateInput: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  submitBtnDisabled: {
    opacity: 0.3,
  },
  submitText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 16,
    color: Colors.bg,
  },
});
