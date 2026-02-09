import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Platform, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useSettings } from '@/lib/settings-context';
import { t, CURRENCIES, Language, CurrencyCode } from '@/lib/i18n';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const {
    language, setLanguage,
    currency, setCurrency,
    animationsEnabled, setAnimationsEnabled,
    silenceMode, setSilenceMode,
    isRTL,
  } = useSettings();

  const tap = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const langOptions: { code: Language; label: string }[] = [
    { code: 'en', label: t(language, 'english') },
    { code: 'ar', label: t(language, 'arabic') },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
          <View style={[styles.header, isRTL && styles.headerRTL]}>
            <Text style={styles.title}>{t(language, 'settings')}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            <Text style={[styles.sectionLabel, isRTL && styles.textRight]}>{t(language, 'language')}</Text>
            <View style={styles.optionRow}>
              {langOptions.map(opt => (
                <Pressable
                  key={opt.code}
                  style={[styles.optionChip, language === opt.code && styles.optionChipActive]}
                  onPress={() => { setLanguage(opt.code); tap(); }}
                >
                  <Text style={[styles.optionText, language === opt.code && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sectionLabel, isRTL && styles.textRight]}>{t(language, 'currency')}</Text>
            <View style={styles.currencyGrid}>
              {CURRENCIES.map(cur => (
                <Pressable
                  key={cur.code}
                  style={[styles.currencyChip, currency === cur.code && styles.currencyChipActive]}
                  onPress={() => { setCurrency(cur.code); tap(); }}
                >
                  <Text style={[styles.currencySymbol, currency === cur.code && styles.currencySymbolActive]}>
                    {cur.symbol}
                  </Text>
                  <Text style={[styles.currencyCode, currency === cur.code && styles.currencyCodeActive]}>
                    {cur.code}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.toggleSection}>
              <View style={[styles.toggleRow, isRTL && styles.toggleRowRTL]}>
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleLabel, isRTL && styles.textRight]}>{t(language, 'animations')}</Text>
                  <Text style={[styles.toggleDesc, isRTL && styles.textRight]}>{t(language, 'animDesc')}</Text>
                </View>
                <Switch
                  value={animationsEnabled}
                  onValueChange={(v) => { setAnimationsEnabled(v); tap(); }}
                  trackColor={{ false: Colors.border, true: Colors.accentDim }}
                  thumbColor={animationsEnabled ? Colors.accent : Colors.textDim}
                />
              </View>

              <View style={[styles.toggleRow, isRTL && styles.toggleRowRTL]}>
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleLabel, isRTL && styles.textRight]}>{t(language, 'silenceMode')}</Text>
                  <Text style={[styles.toggleDesc, isRTL && styles.textRight]}>{t(language, 'silenceDesc')}</Text>
                </View>
                <Switch
                  value={silenceMode}
                  onValueChange={(v) => { setSilenceMode(v); tap(); }}
                  trackColor={{ false: Colors.border, true: 'rgba(107, 159, 212, 0.3)' }}
                  thumbColor={silenceMode ? '#6B9FD4' : Colors.textDim}
                />
              </View>
            </View>
          </ScrollView>
        </Pressable>
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
  content: {
    backgroundColor: Colors.bgLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
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
    marginBottom: 24,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 0,
  },
  sectionLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 11,
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
  },
  textRight: {
    textAlign: 'right',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentGlow,
  },
  optionText: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 14,
    color: Colors.textDim,
  },
  optionTextActive: {
    color: Colors.accent,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  currencyChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    minWidth: 68,
    gap: 2,
  },
  currencyChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentGlow,
  },
  currencySymbol: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    color: Colors.textDim,
  },
  currencySymbolActive: {
    color: Colors.accent,
  },
  currencyCode: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 1,
  },
  currencyCodeActive: {
    color: Colors.accent,
  },
  toggleSection: {
    gap: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toggleRowRTL: {
    flexDirection: 'row-reverse',
  },
  toggleInfo: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  toggleDesc: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 11,
    color: Colors.textDim,
  },
});
