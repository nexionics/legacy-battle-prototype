import { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { svgIconComponents } from '@/shared/lib/svgIconComponents';
import { AuthHeaderVariant, IconNameEnum } from '@/shared/utils/enum';
import { colors, radii, sizes, spacing } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { AuthHeaderProps } from '@/shared/types';

const DEFAULT_TITLE_HAND_SIZE = 28;

export function AuthHeader({
  variant,
  icon = IconNameEnum.LegacyBattleLogo,
  title,
  subtitle,
  logoSize = 40,
  canGoBack,
  disabled,
  onBeforeBack,
  showTitleHand,
  titleHandSize = DEFAULT_TITLE_HAND_SIZE,
  style,
}: AuthHeaderProps) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  // Derive layout values only when `variant` changes — not on every render.
  const { isCenter, textAlign, alignItems } = useMemo(() => {
    const center = variant === AuthHeaderVariant.Center;
    return {
      isCenter: center,
      textAlign: center ? ('center' as const) : ('left' as const),
      alignItems: center ? ('center' as const) : ('flex-start' as const),
    };
  }, [variant]);

  // Keep `onBeforeBack` in the dep array so the callback always calls the
  // latest prop value instead of a stale closure.
  const handleBackPress = useCallback(() => {
    onBeforeBack?.();
    navigation.goBack();
  }, [navigation, onBeforeBack]);

  // Resolve icon components once; guard against an unknown key.
  const Logo = svgIconComponents[icon] ?? svgIconComponents[IconNameEnum.LegacyBattleLogo];
  const Hand = svgIconComponents[IconNameEnum.BattleHand];

  return (
    <View style={[styles.root, style]}>
      {canGoBack ? (
        <TouchableOpacity
          onPress={handleBackPress}
          disabled={disabled}
          style={[styles.backButton, disabled && styles.backButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigates to the previous screen"
          accessibilityState={{ disabled: !!disabled }}
        >
          <AntDesign name="arrow-left" size={sizes.icon16} color={colors.white} />
        </TouchableOpacity>
      ) : null}

      <View style={[styles.body, { alignItems }]}>
        <Logo width={logoSize} height={logoSize} style={styles.logo} />

        {title != null ? (
          <View style={[styles.titleRow, isCenter ? styles.titleRowCenter : styles.titleRowLeft]}>
            <View style={styles.titleBlock}>
              {typeof title === 'string' ? (
                <AppText
                  variant="h2"
                  style={[showTitleHand && styles.titleTextWithHand, { textAlign }]}
                >
                  {title}
                </AppText>
              ) : (
                title
              )}
            </View>
            {showTitleHand ? (
              <Hand width={titleHandSize} height={titleHandSize} style={styles.titleHandIcon} />
            ) : null}
          </View>
        ) : null}

        {subtitle != null ? (
          <View style={styles.slot}>
            {typeof subtitle === 'string' ? (
              <AppText variant="body1" color={colors.textSecondary} style={{ textAlign }}>
                {subtitle}
              </AppText>
            ) : (
              subtitle
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: spacing[5],
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing[4],
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonDisabled: {
    opacity: 0.4,
  },
  body: {
    width: '100%',
  },
  logo: {
    marginBottom: spacing[2],
  },
  titleRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  titleRowCenter: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  titleRowLeft: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  titleHandIcon: {
    flexShrink: 0,
  },
  titleBlock: {
    flexShrink: 1,
    minWidth: 0,
  },
  // Only applied when the hand is present — prevents the text from stretching
  // past the icon and wrapping awkwardly on narrow screens.
  titleTextWithHand: {
    maxWidth: '100%',
  },
  slot: {
    width: '100%',
  },
});
