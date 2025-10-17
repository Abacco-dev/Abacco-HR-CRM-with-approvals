// src/pages/attendes/utils/workTimeUtils.js
// Utilities to decide whether a timestamp is within company working hours and not during breaks.
//
// Company timings (as per user's requirement):
// - Work shift: 17:30 → 03:30 (crosses midnight)
// - Breaks (total 1h15m):
//   1) 00:15 - 00:30 (12:15 AM - 12:30 AM)
//   2) 14:30 - 14:45 (2:30 PM - 2:45 PM)   <-- user requested this; it'll be ignored if outside shift
//   3) 21:30 - 22:15 (9:30 PM - 10:15 PM)

export const SHIFT_START = { hour: 17, minute: 30 }; // 17:30
export const SHIFT_END = { hour: 3, minute: 30 }; // 03:30 next day

// Breaks defined as [startTime, endTime] strings in "HH:mm" (24h)
export const BREAK_WINDOWS = [
  ["00:15", "00:30"], // 12:15 AM - 12:30 AM
  ["14:30", "14:45"], // 2:30 PM - 2:45 PM (user-provided; outside shift normally)
  ["21:30", "22:15"], // 9:30 PM - 10:15 PM
];

function timeStringToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Convert a Date to minutes-since-midnight (0..1439)
function minutesOfDayForDate(date) {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Returns true if 'date' falls on the company's shift window.
 * Shift may cross midnight. We compare minutes-of-day and handle crossing.
 */
export function isWithinShift(date) {
  const minutes = minutesOfDayForDate(date);
  const start = SHIFT_START.hour * 60 + SHIFT_START.minute;
  const end = SHIFT_END.hour * 60 + SHIFT_END.minute;

  if (start <= end) {
    // Non-crossing (not applicable here)
    return minutes >= start && minutes <= end;
  } else {
    // Crossing midnight: e.g., 17:30 -> 03:30
    return minutes >= start || minutes <= end;
  }
}

/**
 * Returns true if `date` is inside any break window.
 * Break windows are checked by converting the break time into minutes-of-day.
 * Note: If break windows fall outside shift they will still be evaluated and excluded only if the timestamp matches them.
 */
export function isDuringBreak(date) {
  const dateMinutes = minutesOfDayForDate(date);

  for (const [startStr, endStr] of BREAK_WINDOWS) {
    const startMin = timeStringToMinutes(startStr);
    const endMin = timeStringToMinutes(endStr);

    if (startMin <= endMin) {
      if (dateMinutes >= startMin && dateMinutes < endMin) return true;
    } else {
      // crossing midnight break (not used here, but keep logic robust)
      if (dateMinutes >= startMin || dateMinutes < endMin) return true;
    }
  }
  return false;
}

/**
 * Decides whether a timestamp should be counted as "working" activity:
 * - It must be within shift
 * - It must NOT be during one of the break windows
 */
export function isWorkingTimestamp(date) {
  return isWithinShift(date) && !isDuringBreak(date);
}

/**
 * Helper: convert seconds to minutes, rounding down.
 */
export function secondsToMinutesRounded(seconds) {
  return Math.floor(seconds / 60);
}
