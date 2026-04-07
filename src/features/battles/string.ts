/**
 * User-facing copy for the battles feature.
 * Import as: `import { battlesStrings } from '@/features/battles/string'`
 */
export const battlesStrings = {
  common: {
    createBattle: 'Create Battle',
    continue: 'Continue',
    join: 'Join',
    view: 'View',
    filter: 'Filter',
    search: 'Search',
    vs: 'vs',
    comingSoon: 'Coming Soon',
    oracleVerified: 'Oracle Verified',
    oracleVerifiedBody:
      'Winner Decided By Official Data Source. Attesters Only Activate If Data Is Delayed.',
    error: 'Error',
    failed: 'Failed',
    ok: 'OK',
  },

  alerts: {
    createTitleRequired: 'Please enter a battle title',
    createTeamRequired: 'Please select a team',
    createOutcomeRequired: 'Please select an outcome',
    createLoginRequired: 'You must be logged in to create a battle',
    createGenericFailure: 'Could not create battle',
    joinPickRequiredTitle: 'Pick required',
    joinPickRequiredBody: 'Please select a team to join this battle',
    joinLoginRequired: 'You must be logged in to join a battle',
    joinSuccessTitle: 'Joined!',
    joinSuccessBody: 'You have successfully joined this battle.',
    joinFailedTitle: 'Join failed',
    joinUnknownError: 'Unknown error',
    statDuelCreatedTitle: 'Battle Created!',
    statDuelCreatedBody: 'Your Stat Duel has been created successfully.',
  },

  errors: {
    network: 'Network error',
    missingBattle: 'Missing battle',
  },

  api: {
    defaultBattleTitle: 'Battle',
  },

  battlesList: {
    screenTitle: 'My Battles',
    create: 'Create',
    loading: 'Loading battles...',
    loadFailed: 'Failed to load',
    emptyTitle: (tab: string) => `No ${tab} battles`,
    emptyMessage: 'Create your first battle to get started.',
    createFirstBattle: 'Create Your First Battle',
    noDescription: 'No description',
    stake: 'Stake:',
    sportsEvent: 'Sports Event',
    customBattle: 'Custom Battle',
  },

  explore: {
    title: 'Explore',
    noBattles: 'No battles found',
    categoriesHeading: 'Categories',
    topPlayers: 'Top Players',
    seeAll: 'See All',
    xp: (n: number) => `${n} XP`,
    gamePick: 'Game Pick',
    bcEntry: (stake: number) => `${stake} Bc Entry`,
    defaultBattleTitle: 'Super Bowl QB Passing Yards Duel',
    vs: 'Vs',
    createdPrefix: 'Created ',
    joined: (n: number) => `${n} Joined`,
    tagOngoing: 'Ongoing',
    mockPlayerA: 'Mahomes',
    mockPlayerB: 'Burrow',
  },

  battleDetail: {
    notFound: 'Battle Not Found',
    screenTitle: 'Battle Details',
    noWinner: 'No winner',
    you: 'You',
    playerPreview: (idSlice: string) => `Player (${idSlice}...)`,
    winnerLine: (name: string) => `Winner: ${name}`,
  },

  battleInfo: {
    initials: 'LB',
    stake: 'Stake:',
    created: 'Created:',
    event: 'Event:',
    youCreated: 'You created this battle',
  },

  score: {
    final: 'Final Score',
    live: 'Live Score',
  },

  winnerCard: {
    battleResolved: 'Battle Resolved',
    homeFallback: 'Home',
    awayFallback: 'Away',
    autoResolving: 'Game finished. Auto-resolving shortly...',
  },

  participants: {
    sectionTitle: (n: number) => `Participants (${n})`,
    emptyTitle: 'No participants yet',
    emptySubtitle: 'Be the first to join!',
    you: 'You',
    playerN: (index: number) => `Player ${index + 1}`,
    joinedAt: (date: string) => `Joined ${date}`,
    pick: 'Pick:',
  },

  joinBattle: {
    joinedMessage: 'You have joined this battle',
    sectionTitle: 'Join This Battle',
    creatorsPrediction: "Creator's prediction:",
    yourSide: 'Your side (if you accept):',
    willWin: (team: string) => `${team} will win`,
    pickWinner: 'Pick the winner:',
    home: 'Home',
    away: 'Away',
    unableTeams: 'Unable to determine teams for this battle',
    acceptChallenge: 'Accept Challenge',
    joinBattle: 'Join Battle',
  },

  createBattle: {
    screenTitle: 'Create Battle',
    titleLabel: 'Title',
    titlePlaceholder: 'e.g., Chiefs vs Bills - Who wins?',
    battleSetup: 'Battle Setup',
    setupHint: 'Select your prediction for this game',
    eventIdLabel: 'Game/Event ID',
    eventIdPlaceholder: 'Sports event ID',
    linkedGame: 'Linked to live game data',
    stakeLabel: 'Stake (BC)',
    stakePlaceholder: '0',
    stakeHint: 'Battle Coins to wager (optional)',
    createButton: 'Create Battle',
    modalSelectTeam: 'Select Team',
    modalSelectOutcome: 'Select Outcome',
    selectTeam: 'Select Team',
    selectOutcome: 'Select Outcome',
    outcomeWillWin: 'Will Win',
    outcomeWillLose: 'Will Lose',
    willWinPhrase: 'will win',
    willLosePhrase: 'will lose',
  },

  battleType: {
    progress: '1/6',
    chooseTitle: 'Choose Battle Type',
    chooseSubtitle: 'Choose The Type Of Battle You Want To Create',
  },

  battleVisibility: {
    screenTitle: 'Select Battle Type',
    subtitle: 'Choose The Type Of Battle You Want To Create',
    private: 'Private',
    privateHint: 'Only Invited Opponent Can Join',
    crewOnly: 'Crew Only',
    crewHint: 'Only Your Crew Members Can Join This Battle',
    public: 'Public',
    publicHint: 'Anyone Can Join The Battle From The Explore Page',
  },

  startBattle: {
    headerSkills: 'Skills Battle',
    headerSelectType: 'Select Battle Type',
    headerSelectSport: 'Select a Sport',
    skillBattleTitle: 'Skill Battle',
    neutralAttesterBadge: 'Neutral Attester Verifies',
    skillsSubtitle: 'Showcase Your Skills With Proof',
    videoEvidence: 'Video Evidence Needed',
    threeAttesters: '3 Neutral Attesters',
    comingSoonTitle: 'Coming Soon',
    comingSoonBody:
      'Skills Battles will let you challenge friends with video proof of your skills. Neutral attesters will verify the winner.',
    categoryComingSoon: 'Coming Soon',
  },

  statDuel: {
    progress2of6: '2/6',
    progress3of6: '3/6',
    progress4of6: '4/6',
    progress5of6: '5/6',
    progress6of6: '6/6',
    selectBattleMode: 'Select Battle Mode',
    modeSubtitle: 'Choose How Your Battle Will Be Resolved',
    detailsTitle: 'Create Battle',
    detailsSubtitleStandard: 'Select Event And Position For Standard Battle',
    detailsSubtitleFantasy: 'Select Sport And Position For Fantasy Battle',
    modeLabel: 'Mode:',
    modeStandard: 'Standard',
    modeFantasy: 'Fantasy',
    modeBothPicks: 'Both Picks',
    chooseSport: 'Choose Sport',
    selectSport: 'Select Sport',
    chooseEvent: 'Choose Event',
    selectEvent: 'Select Event',
    choosePosition: 'Choose Position',
    selectPosition: 'Select Position',
    startTime: 'Start Time',
    endTime: 'End Time',
    lockStandard: 'Lock Time: Locks At Game Kickoff',
    lockFantasy: 'Lock Time: Locks At Earliest Kickoff This Week',
    fantasyInfo:
      'In Fantasy Mode, you can pick any player from the selected sport and position. Your opponent can also pick any player of the same sport and position.',
    selectSportFirst: 'Select a sport first',
    validation: {
      sportRequired: 'Select a sport',
      eventRequired: 'Select an event',
      positionRequired: 'Select a position',
      playerRequired: 'Pick a player',
      statCategoryRequired: 'Select a stat category',
      stakeRequired: 'Select a stake',
      directionRequired: 'Select a direction (Most or Least)',
      opponentRequired: 'Select an opponent to continue',
    },
    championSubtitle: 'Choose Stats To Battle On',
    championHeading: 'Choose Your Champion And The Dueling Stats',
    pickPlayer: 'Pick Player *',
    pickPlayersPlaceholder: 'pick players',
    statCategory: 'Stat Category *',
    selectStatCategory: 'Select stat category',
    chooseDirection: 'Choose Direction *',
    selectDirection: 'Select direction (Most/Least)',
    stakeBc: 'Stake BC',
    statDescription: 'Stat Description',
    officialRules: 'Official Rules',
    championRulesSnippet:
      'Tie Rule: If Both QBs Have Same Passing Yards — Tie.\nMinimum Attempts: x10 Passes Required For Each QB.',
    searchPlayersTitle: 'Search Player/Teams',
    searchPlayersPlaceholder: 'Search players...',
    filterPs: 'Ps',
    filterLabel: 'Filter',
    playerActive: 'Active',
    modalStatCategory: 'Select Stat Category',
    modalStake: 'Select Stake',
    modalDirection: 'Select Direction',
    opponentTitle: 'Pick An Opponent For Battle',
    opponentSubtitle: 'Pick Your Opponent And Players To Battle On.',
    searchOpponentPlaceholder: 'search opponent',
    chooseFriendSheetTitle: 'Choose Your Friend To Battle',
    sheetSearchPlaceholder: 'Search',
    sheetAddFriend: 'Add Friend',
    addOpponent: 'Add Opponent',
    selectedOpponent: 'Selected Opponent',
    publicBattle: 'Public Battle',
    publicBattleBody:
      'This battle will be visible to all users on the Explore page. Anyone can join and accept your challenge.',
    confirmTitle: 'Confirm Challenge Details',
    confirmSubtitle: 'Confirm The Details Of Your Battle',
    summaryStatCategory: 'Stat Category:',
    summaryGameEvent: 'Game/Event:',
    summaryPlayer: 'Player:',
    defaultStatCategory: 'Passing Yards',
    defaultGame: 'Chiefs vs Bills, Week 5',
    defaultPlayer: 'Mahomes',
    lockKickoff: 'Lock: "Locks At Kickoff — Sun 8:00 PM',
    confirmRules:
      'Tie Rule: If Both QBs Have Same Passing Yards — Tie.\nMinimum Attempts: x10 Passes Required For Each QB.\nEvidence: Winner Decided By Official Data Source. Attesters Only Activate If Data Is Delayed.\nInfo Note: *Rules Are Automatically Enforced At Resolution',
    lockFooter: 'Lock Time: Locks At Kickoff (8:00 PM)',
    detailBattleMode: 'Battle Mode',
    detailVisibility: 'Visibility',
    detailStake: 'Stake',
    detailOpponent: 'Opponent',
    visibilityPrivate: 'Private',
    visibilityPublic: 'Public',
  },
} as const;

export function battlesFormatPrediction(teamName: string, willWin: boolean): string {
  const phrase = willWin
    ? battlesStrings.createBattle.willWinPhrase
    : battlesStrings.createBattle.willLosePhrase;
  return `I predict ${teamName} ${phrase}`;
}

export function battlesStatCategorySummary(name: string): string {
  return `${name} (H2H)`;
}

export function battlesFormatStakeBc(stake: string | number): string {
  return `${stake} BC`;
}

export function battlesStatCompareDescription(statName: string): string {
  return `Compare Total ${statName} For Both Players`;
}

export function battlesStatDuelOpponentLevelRank(level: number, rank: string): string {
  return `Level ${level}, ${rank}`;
}
