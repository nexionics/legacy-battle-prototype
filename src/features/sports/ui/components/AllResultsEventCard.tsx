import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatShortDate } from '@/shared/utils';
import type { SportsEvent } from '@/shared/types';
import { getSportIcon } from '@/features/sports/data/api/sports.api';
import { allResultsScreenStrings } from '@/features/sports/strings';

type Props = {
  event: SportsEvent;
};

export function AllResultsEventCard({ event }: Props) {
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.resultLeft}>
          <View style={styles.sportIcon}>
            <AppText style={{ fontSize: 20 }}>{getSportIcon(event.strSport)}</AppText>
          </View>
          <View style={styles.resultInfo}>
            <AppText variant="h6" numberOfLines={1}>
              {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
            </AppText>
            <AppText variant="captionSm" color={colors.textSecondary}>
              {event.strLeague}
            </AppText>
          </View>
        </View>
        <View style={styles.finalBadge}>
          <AppText variant="captionSm" color={colors.white} style={{ fontSize: 10 }}>
            {allResultsScreenStrings.finalBadge}
          </AppText>
        </View>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.scoreContainer}>
          {event.strHomeTeamBadge ? (
            <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
          ) : null}
          <AppText variant="h4">
            {event.intHomeScore || '0'} - {event.intAwayScore || '0'}
          </AppText>
          {event.strAwayTeamBadge ? (
            <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
          ) : null}
        </View>
        <View style={styles.venueInfo}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ maxWidth: 120 }}
            numberOfLines={1}
          >
            {event.strVenue || allResultsScreenStrings.venueTbd}
          </AppText>
        </View>
      </View>

      <View style={styles.resultFooter}>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
          <AppText variant="captionSm" color={colors.textSecondary}>
            {formatShortDate(event.strTimestamp || event.dateEvent)}
          </AppText>
        </View>
        <View style={styles.sportBadge}>
          <AppText variant="captionSm" color={colors.textSecondary} style={{ fontSize: 10 }}>
            {event.strSport}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  finalBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: spacing[2],
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  teamBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sportBadge: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
  },
});
