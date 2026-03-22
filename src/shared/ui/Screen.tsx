import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/app/providers/ThemeProvider';
import { screenPadding } from '../lib/layout';
import type { ScreenProps } from '@/shared/types';

export function Screen({ children, scroll = false, padding, style }: ScreenProps) {
  const { colors, mode } = useAppTheme();
  const pad = padding ?? screenPadding();

  const barStyle = mode === 'dark' ? 'light-content' : 'dark-content';

  if (scroll) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }, style]}>
        <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: pad }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingHorizontal: pad, backgroundColor: colors.background },
        style,
      ]}
    >
      <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
