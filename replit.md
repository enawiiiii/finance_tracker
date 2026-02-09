# Orbit - Space Finance App

## Overview
Personal finance mobile app where money is represented as a space navigation system. Users control finances through an orbital timeline interface with planetary nodes for each month. Supports multi-language (English/Arabic with RTL), multi-currency (USD, AED, EUR, GBP, TRY), and advanced visual features.

## Architecture
- **Frontend**: Expo React Native with Expo Router (file-based routing)
- **Backend**: Express server (serves landing page and API)
- **Storage**: AsyncStorage for local persistence
- **State**: React Context (SettingsProvider + FinanceProvider) + React Query
- **Fonts**: Space Grotesk (custom Google Font)
- **i18n**: Custom translation system (lib/i18n.ts) with EN/AR support

## Key Files
- `app/index.tsx` - Main screen with timeline, balance, identity badge
- `app/_layout.tsx` - Root layout with providers (Settings wraps Finance)
- `lib/finance-context.tsx` - Finance state management (uses settings for language)
- `lib/settings-context.tsx` - Settings state (language, currency, animations, silence mode)
- `lib/i18n.ts` - Translation strings, currency formatting, localized labels
- `lib/types.ts` - TypeScript types, categories, category icons
- `lib/finance-utils.ts` - Financial calculations, localized identity logic
- `lib/planet-colors.ts` - Dynamic planet colors based on financial state, orbit rings
- `lib/storage.ts` - AsyncStorage persistence
- `components/StarField.tsx` - Animated star background
- `components/Timeline.tsx` - Horizontal month timeline with localized labels
- `components/PlanetNode.tsx` - Animated planetary month nodes with orbit rings
- `components/MonthDetail.tsx` - Month transactions, analytics, category echoes
- `components/TransactionModal.tsx` - Add/edit transaction modal with i18n
- `components/TransactionItem.tsx` - Single transaction row with i18n
- `components/IdentityBadge.tsx` - Financial identity display
- `components/SettingsModal.tsx` - Control Room with language/currency/toggles
- `components/TimeWarpOverlay.tsx` - Alternate timeline on transaction long-press
- `components/ConstellationView.tsx` - Annual star constellation view on month long-press
- `components/CategoryEcho.tsx` - Visual pulses for repeated expense categories

## Design
- Deep cosmic navy/black background (#060B18)
- Accent: Teal/cyan (#00E5CC)
- Income: Teal, Expense: Rose
- Space Grotesk font family
- No traditional dashboard/table UI
- All elements float in space

## Features
- **Multi-language**: English and Arabic with full RTL support
- **Multi-currency**: USD ($), AED (د.إ), EUR (€), GBP (£), TRY (₺)
- **Dynamic Planet Colors**: Planet nodes change color based on spending ratio, stability, balance
- **Orbit Rings**: Concentric rings on planets showing fixed, recurring, and surprise spending layers
- **Financial Silence Mode**: Hides all numbers (shows ••••) but preserves visual motion and colors
- **Time Warp Mode**: Long-press transaction to see alternate timeline without that expense
- **Category Echo**: Visual pulses appear for categories that repeat frequently
- **Constellation View**: Long-press month planet to see annual star pattern of finances
- **Financial Identity**: Evolving identity labels (Explorer, Builder, Stabilizer, Observer, Voyager, Drifter) based on behavior

## Interactions
- Tap planet node: Select month
- Long-press planet node: Open constellation view for that year
- Tap transaction: Edit transaction
- Long-press transaction: Open time warp overlay
- Tap + button: Add new transaction
- Tap planet icon (header): Open settings control room

## Recent Changes
- Initial build of space finance app
- Added full i18n system with English/Arabic and RTL support
- Added multi-currency support (USD, AED, EUR, GBP, TRY)
- Implemented Settings context with language, currency, animations, silence mode
- Built dynamic planet color system and orbit rings
- Added Time Warp, Silence Mode, Category Echo, Constellation View features
- All components updated for localization and settings integration
- E2E tested: transactions, currency switching, language switching, silence mode
