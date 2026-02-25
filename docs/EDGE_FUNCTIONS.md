# Edge Functions

## award-xp
**Purpose:** Awards XP for key actions (create/join/resolve/share), idempotent.

**Input Payload:**
- `user_id` (string)
- `amount` (number)
- `reason` (string)

**Returns:**
- Success flag and awarded XP details

**Tables Affected:**
- `profiles`
- `xp_events` (if present)

---

## resolve-battles
**Purpose:** Auto-resolves battles when linked sports events reach `final` status.

**Input Payload:**
- None (scheduled/triggered)

**Returns:**
- Resolution summary

**Tables Affected:**
- `battles`
- `battle_participants`
- `profiles` (XP awards)

---

## crew-request
**Purpose:** Creates a crew request by username.

**Input Payload:**
- `username` (string)

**Returns:**
- `request` (crew request row)
- `error` (string if applicable)

**Tables Affected:**
- `crew_requests`

---

## crew-respond
**Purpose:** Accepts/declines/cancels a crew request.

**Input Payload:**
- `request_id` (string)
- `action` ("accept" | "decline" | "cancel")

**Returns:**
- Success flag or error message

**Tables Affected:**
- `crew_requests`
- `crew_members` (on accept)
