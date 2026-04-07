import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import { formatShortDate } from '@/shared/utils';
import type { SportsEvent } from '@/shared/types';
import {
  getSportIcon,
  formatEventTime,
} from '@/features/sports/data/api/sports.api';
import { allUpcomingGamesScreenStrings } from '@/features/sports/strings';

type Props = {
  event: SportsEvent;
  onBattle: () => void;
};

export function AllUpcomingGamesListCard({ event, onBattle }: Props) {
  return (
    <View style={styles.gameCard}>
      <View style={styles.gameHeader}>
        <View style={styles.gameLeft}>
          <View style={styles.sportIcon}>
            <AppText style={{ fontSize: 20 }}>{getSportIcon(event.strSport)}</AppText>
          </View>
          <View style={styles.gameInfo}>
            <AppText variant="h6" numberOfLines={1}>
              {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
            </AppText>
            <AppText variant="captionSm" color={colors.textSecondary}>
              {event.strLeague}
            </AppText>
          </View>
        </View>
        <View style={styles.teamLogos}>
          {event.strHomeTeamBadge ? (
            <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
          ) : null}
          {event.strAwayTeamBadge ? (
            <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
          ) : null}
        </View>
      </View>

      <View style={styles.gameDetails}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <AppText variant="label">{formatEventTime(event)}</AppText>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <AppText variant="captionSm" color={colors.textSecondary}>
            {formatShortDate(event.strTimestamp || event.dateEvent)}
          </AppText>
        </View>
      </View>

      <View style={styles.gameFooter}>
        <View style={styles.venueContainer}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ maxWidth: 180 }}
            numberOfLines={1}
          >
            {event.strVenue || allUpcomingGamesScreenStrings.venueTbd}
          </AppText>
        </View>
        <TouchableOpacity style={styles.battleButton} onPress={onBattle}>
          <Ionicons name="flash" size={16} color={colors.white} />
          <AppText variant="buttonMd" color={colors.white}>
            {allUpcomingGamesScreenStrings.battleCta}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
    borderWidth: 1,
    borderColor: colors.primary,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  gameLeft: {
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
  gameInfo: {
    flex: 1,
  },
  teamLogos: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: spacing[2],
  },
  teamBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  battleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: 4,
  },
});
