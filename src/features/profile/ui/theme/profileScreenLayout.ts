import { horizontalScale, verticalScale } from '@/shared/theme';

/** Design reference sizes → scaled for layout (width: horizontalScale, height: verticalScale). */
const AVATAR_W = 56;
const AVATAR_H = 56;
const BADGE_W = 20;
const BADGE_H = 20;
const BADGE_INSET = 2;
const CONTENT_MAX_W = 366;
const SWITCH_TRACK_W = 44;
const SWITCH_TRACK_H = 24;
const SWITCH_PAD = 2;
const SWITCH_THUMB_W = 20;
const SWITCH_THUMB_H = 20;
const SWITCH_TRAVEL = 20;

export const profileScreenLayout = {
  avatarWidth: horizontalScale(AVATAR_W),
  avatarHeight: verticalScale(AVATAR_H),
  /** Circular avatar / placeholder */
  avatarBorderRadius: horizontalScale(AVATAR_W / 2),
  editBadgeWidth: horizontalScale(BADGE_W),
  editBadgeHeight: verticalScale(BADGE_H),
  editBadgeBorderRadius: horizontalScale(BADGE_W / 2),
  editBadgeBottom: verticalScale(-BADGE_INSET),
  editBadgeRight: horizontalScale(-BADGE_INSET),
  infoContentMaxWidth: horizontalScale(CONTENT_MAX_W),
  switchTrackWidth: horizontalScale(SWITCH_TRACK_W),
  switchTrackHeight: verticalScale(SWITCH_TRACK_H),
  switchTrackBorderRadius: verticalScale(SWITCH_TRACK_H / 2),
  switchPadding: verticalScale(SWITCH_PAD),
  switchThumbWidth: horizontalScale(SWITCH_THUMB_W),
  switchThumbHeight: verticalScale(SWITCH_THUMB_H),
  switchThumbBorderRadius: verticalScale(SWITCH_THUMB_H / 2),
  switchThumbTravelX: horizontalScale(SWITCH_TRAVEL),
} as const;
