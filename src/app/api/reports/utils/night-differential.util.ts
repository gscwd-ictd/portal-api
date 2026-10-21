/**
 * Night differential (ND) computation — pure, no DB access.
 *
 * Rules (HRMS work suspension rework, HR 2026-10-12 / 2026-10-16):
 *  - ND window is 18:00 - 06:00 (on the DTR timeline: 00:00-06:00 of the DTR date and 18:00 -> 06:00 next day).
 *  - Regular ND = schedule ∩ DTR logs ∩ ND window. Late / undertime reduce it. Lunch is NOT deducted.
 *  - Incomplete or empty DTR logs (no time in or no time out) -> no regular ND.
 *  - Holidays and work suspension days (same rule, HR 2026-10-19) still earn ND, but only for the
 *    hours actually worked per the DTR logs; unworked suspended/holiday hours are not paid.
 *  - Overtime ND: approved OT, encoded time in/out ∩ ND window, paid on top of OT. Minutes already
 *    counted as regular ND are not counted twice.
 *  - Rest day / leave: no regular ND (OT ND still applies).
 */

export const ND_INTERVALS: Interval[] = [
  { start: 0, end: 6 * 60 }, // 00:00 - 06:00 of the DTR date
  { start: 18 * 60, end: 30 * 60 }, // 18:00 - 06:00 next day
];
const MIDNIGHT = 24 * 60;

export type Interval = { start: number; end: number };

export type NdInput = {
  /** YYYY-MM-DD */
  dtrDate: string;
  schedTimeIn: string | null;
  schedTimeOut: string | null;
  timeIn: string | null;
  timeOut: string | null;
  /** rest day or leave: no regular ND */
  isRestDayOrLeave?: boolean;
  /** approved OT, encoded 'YYYY-MM-DD HH:mm[:ss]' */
  overtimes?: { encodedTimeIn: string | null; encodedTimeOut: string | null }[];
};

export type NdResult = {
  regularNdMinutes: number;
  otNdMinutes: number;
  totalNdHours: number;
};

/** 'HH:mm[:ss]' -> minutes */
export function toMinutes(time: string | null | undefined): number | null {
  if (!time) return null;
  const [h, m] = time.split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/** 'YYYY-MM-DD HH:mm[:ss]' -> minutes from 00:00 of dtrDate (can be negative or > 1440) */
export function dateTimeToMinutes(dateTime: string | null | undefined, dtrDate: string): number | null {
  if (!dateTime) return null;
  const [datePart, timePart] = dateTime.trim().split(/[ T]/);
  const t = toMinutes(timePart);
  if (t === null) return null;
  const days = Math.round((Date.UTC(...ymd(datePart)) - Date.UTC(...ymd(dtrDate))) / 86400000);
  if (Number.isNaN(days)) return null;
  return days * MIDNIGHT + t;
}

function ymd(d: string): [number, number, number] {
  const [y, m, day] = d
    .slice(0, 10)
    .split('-')
    .map((v) => parseInt(v, 10));
  return [y, m - 1, day];
}

/** total length of the union of intervals */
export function unionLength(intervals: Interval[]): number {
  const sorted = intervals.filter((i) => i.end > i.start).sort((a, b) => a.start - b.start);
  let total = 0;
  let curStart = -Infinity;
  let curEnd = -Infinity;
  for (const i of sorted) {
    if (i.start > curEnd) {
      if (curEnd > curStart) total += curEnd - curStart;
      curStart = i.start;
      curEnd = i.end;
    } else curEnd = Math.max(curEnd, i.end);
  }
  if (curEnd > curStart) total += curEnd - curStart;
  return total;
}

/** clip intervals to the ND window */
export function clipToNd(intervals: Interval[]): Interval[] {
  const out: Interval[] = [];
  for (const i of intervals)
    for (const nd of ND_INTERVALS) {
      const start = Math.max(i.start, nd.start);
      const end = Math.min(i.end, nd.end);
      if (end > start) out.push({ start, end });
    }
  return out;
}

export function computeNightDifferential(input: NdInput): NdResult {
  const regular: Interval[] = [];
  let workedNd = 0;

  const schedIn = toMinutes(input.schedTimeIn);
  let schedOut = toMinutes(input.schedTimeOut);
  let tin = toMinutes(input.timeIn);
  let tout = toMinutes(input.timeOut);

  const logsComplete = tin !== null && tout !== null;

  if (!input.isRestDayOrLeave && logsComplete && schedIn !== null && schedOut !== null) {
    if (schedOut <= schedIn) schedOut += MIDNIGHT;
    // night shift arriving after midnight (e.g. 00:30 for a 22:00 schedule)
    if (tin < schedIn - 12 * 60) tin += MIDNIGHT;
    while (tout <= tin) tout += MIDNIGHT;

    const worked: Interval = { start: Math.max(schedIn, tin), end: Math.min(schedOut, tout) };
    const workedClipped = clipToNd([worked]);
    workedNd = unionLength(workedClipped);
    regular.push(...workedClipped);
  }

  const regularTotal = unionLength(regular);

  const ot: Interval[] = [];
  for (const o of input.overtimes ?? []) {
    const start = dateTimeToMinutes(o.encodedTimeIn, input.dtrDate);
    const end = dateTimeToMinutes(o.encodedTimeOut, input.dtrDate);
    if (start !== null && end !== null && end > start) ot.push({ start, end });
  }
  const otNd = unionLength([...regular, ...clipToNd(ot)]) - regularTotal;

  return {
    regularNdMinutes: workedNd,
    otNdMinutes: otNd,
    totalNdHours: Math.round(((regularTotal + otNd) / 60) * 100) / 100,
  };
}

/**
 * Daily rate for the ND computation. Permanent / casual: monthly salary grade amount / 22.
 * Job order (no salary grade): the NOSI/NOSA daily rate. Missing both -> 0.
 */
export function resolveDailyRate(
  salaryGradeAmount: number | string | null,
  nosiDailyRate: number | string | null,
): number {
  const monthly = Number(salaryGradeAmount) || 0;
  if (monthly > 0) return monthly / 22;
  return Number(nosiDailyRate) || 0;
}
