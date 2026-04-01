# Battle Creation API Documentation

This document outlines the payload structure for creating battles in the unified Battle system. The "Challenges" feature has been consolidated into this flow.

## Create Battle Endpoint

**POST** `/battles`

### Common Payload Structure

The following fields are used for all battle types, with specific requirements based on the `mode`.

```json
{
  "type": "STAT_DUEL",
  "mode": "STANDARD",
  "stakeAmount": 100,
  "visibility": "public",
  "playerId": "player-uuid-123",
  "expectation": "over_250_passing_yards"
}
```

### Field Definitions

| Field         | Type         | Required  | Description                                                        |
| :------------ | :----------- | :-------- | :----------------------------------------------------------------- |
| `type`        | `BattleType` | **Yes**   | The type of battle (e.g., `STAT_DUEL`, `PREDICTION_FLASH`).        |
| `mode`        | `BattleMode` | No        | `STANDARD` (default) or `FANTASY`.                                 |
| `stakeAmount` | `number`     | No        | The amount of BC to wager (defaults to 0).                         |
| `visibility`  | `Enum`       | No        | `public` (default) or `private`.                                   |
| `opponentId`  | `UUID`       | No        | Used for private challenges to specify the opponent's User ID.     |
| `playerId`    | `string`     | **Yes\*** | Required for `STAT_DUEL`. The ID of the player being predicted.    |
| `expectation` | `string`     | **Yes\*** | Required for `STAT_DUEL`. The predicted outcome (e.g., "3_goals"). |
| `eventId`     | `UUID`       | No        | Required if `mode` is `STANDARD`.                                  |
| `sport`       | `string`     | No        | Required if `mode` is `FANTASY`. e.g., "Soccer", "NFL".            |
| `week`        | `string`     | No        | Required if `mode` is `FANTASY`. e.g., "Week 4", "GW12".           |

---

## Example Scenarios

### 1. Standard Stat Duel (Match-Based)

Used when a user wants to battle based on a player's performance in a specific upcoming match.

```json
{
  "type": "STAT_DUEL",
  "mode": "STANDARD",
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "playerId": "lebron-james-id",
  "expectation": "double_double",
  "stakeAmount": 50,
  "visibility": "public"
}
```

### 2. Fantasy Stat Duel (Week-Based)

Used for overall performance during a specific week or gameweek across multiple possible games.

```json
{
  "type": "STAT_DUEL",
  "mode": "FANTASY",
  "sport": "Basketball",
  "week": "Week 22",
  "playerId": "steph-curry-id",
  "expectation": "5_plus_threes",
  "stakeAmount": 200,
  "visibility": "public"
}
```

### 3. Private Challenge

To create what was previously a "Challenge", set the `visibility` to `private` and provide an `opponentId`.

```json
{
  "type": "STAT_DUEL",
  "mode": "STANDARD",
  "eventId": "event-uuid",
  "playerId": "player-id",
  "expectation": "any_time_scorer",
  "stakeAmount": 500,
  "visibility": "private",
  "opponentId": "target-user-uuid"
}
```

> [!NOTE]
> Creating a battle with a `stakeAmount > 0` will automatically lock the corresponding funds in the creator's wallet.
