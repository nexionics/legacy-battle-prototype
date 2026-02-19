# Developer Setup

## Prerequisites

- Node.js 18+
- npm
- Expo Go app on your phone (for basic testing) or EAS CLI for native builds

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Fill in your Supabase credentials:
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 3. Start the dev server
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) to run on your device.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Native Builds

The splash video (`expo-av`) requires a native build and won't work in Expo Go.

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios

# Build and auto-submit to App Store Connect
eas build --platform ios --auto-submit
```

## Common Issues

- **"Module not found" errors**: Run `npm install` again
- **Splash video not showing**: You need a native build, not Expo Go
- **Supabase connection errors**: Check your `.env` values match your Supabase project
- **TypeScript errors after pulling**: Run `npm run typecheck` to see what changed
