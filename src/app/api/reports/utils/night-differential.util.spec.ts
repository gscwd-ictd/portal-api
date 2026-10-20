import { computeNightDifferential, NdInput } from './night-differential.util';

const base: NdInput = {
  dtrDate: '2026-10-08',
  schedTimeIn: '14:00:00',
  schedTimeOut: '23:00:00',
  timeIn: '14:00:00',
  timeOut: '23:00:00',
};
const nd = (i: Partial<NdInput>) => computeNightDifferential({ ...base, ...i });

describe('computeNightDifferential', () => {
  it('14:00-23:00 on time -> 5h', () => {
    expect(nd({}).totalNdHours).toBe(5);
  });

  it('late arrival reduces ND (old bug: paid 5h)', () => {
    expect(nd({ timeIn: '19:00:00' }).totalNdHours).toBe(4);
  });

  it('undertime reduces ND', () => {
    expect(nd({ timeOut: '21:30:00' }).totalNdHours).toBe(3.5);
  });

  it('night shift 22:00-06:00 on time -> 8h, lunch not deducted', () => {
    expect(
      nd({ schedTimeIn: '22:00:00', schedTimeOut: '06:00:00', timeIn: '21:50:00', timeOut: '06:05:00' }).totalNdHours,
    ).toBe(8);
  });

  it('night shift arriving after midnight', () => {
    expect(
      nd({ schedTimeIn: '22:00:00', schedTimeOut: '06:00:00', timeIn: '00:30:00', timeOut: '06:00:00' }).totalNdHours,
    ).toBe(5.5);
  });

  it('day schedule ending after midnight without night tag', () => {
    expect(
      nd({ schedTimeIn: '16:00:00', schedTimeOut: '01:00:00', timeIn: '16:00:00', timeOut: '01:00:00' }).totalNdHours,
    ).toBe(7);
  });

  it('early morning schedule 04:00-13:00 earns 00:00-06:00 part', () => {
    expect(
      nd({ schedTimeIn: '04:00:00', schedTimeOut: '13:00:00', timeIn: '04:00:00', timeOut: '13:00:00' }).totalNdHours,
    ).toBe(2);
  });

  it('incomplete or empty logs -> no regular ND', () => {
    expect(nd({ timeOut: null }).totalNdHours).toBe(0);
    expect(nd({ timeIn: null, timeOut: null }).totalNdHours).toBe(0);
  });

  it('rest day / leave -> no regular ND', () => {
    expect(nd({ isRestDayOrLeave: true }).totalNdHours).toBe(0);
  });

  describe('holiday / work suspension day: worked hours only', () => {
    it('left early at 20:00 from 14:00-23:00 -> 2h (18:00-20:00), unworked hours not paid', () => {
      expect(nd({ timeOut: '20:00:00' }).totalNdHours).toBe(2);
    });

    it('night shift: only hours covered by the logs', () => {
      expect(
        nd({ schedTimeIn: '22:00:00', schedTimeOut: '06:00:00', timeIn: '22:00:00', timeOut: '02:00:00' }).totalNdHours,
      ).toBe(4);
    });
  });

  describe('overtime', () => {
    it('approved OT after a day shift inside ND window', () => {
      const r = computeNightDifferential({
        dtrDate: '2026-10-08',
        schedTimeIn: '08:00:00',
        schedTimeOut: '17:00:00',
        timeIn: '08:00:00',
        timeOut: '17:00:00',
        overtimes: [{ encodedTimeIn: '2026-10-08 17:00:00', encodedTimeOut: '2026-10-08 21:00:00' }],
      });
      expect(r.otNdMinutes).toBe(180);
      expect(r.totalNdHours).toBe(3);
    });

    it('OT crossing midnight', () => {
      const r = nd({ overtimes: [{ encodedTimeIn: '2026-10-08 23:00:00', encodedTimeOut: '2026-10-09 07:00:00' }] });
      expect(r.otNdMinutes).toBe(7 * 60);
      expect(r.totalNdHours).toBe(12);
    });

    it('OT on a rest day still earns ND', () => {
      const r = nd({
        isRestDayOrLeave: true,
        overtimes: [{ encodedTimeIn: '2026-10-08 19:00:00', encodedTimeOut: '2026-10-08 22:00:00' }],
      });
      expect(r.totalNdHours).toBe(3);
    });

    it('OT overlapping counted regular ND is not double counted', () => {
      const r = nd({ overtimes: [{ encodedTimeIn: '2026-10-08 22:00:00', encodedTimeOut: '2026-10-09 00:00:00' }] });
      expect(r.otNdMinutes).toBe(60);
      expect(r.totalNdHours).toBe(6);
    });

    it('OT ND with incomplete DTR logs still counts', () => {
      const r = nd({
        timeIn: null,
        overtimes: [{ encodedTimeIn: '2026-10-08 18:00:00', encodedTimeOut: '2026-10-08 20:00:00' }],
      });
      expect(r.totalNdHours).toBe(2);
    });
  });
});
