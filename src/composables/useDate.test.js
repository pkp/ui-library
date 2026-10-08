import {describe, test, expect} from 'vitest';
import {useDate} from './useDate';
global.pkp = {
	context: {
		timeZone: 'UTC',
	},
};

describe('calculateDaysFromNow', () => {
	const {calculateDaysBetweenDates} = useDate();
	test('today date should result in 0 days', () => {
		expect(
			calculateDaysBetweenDates('2025-02-20 08:10:27', '2025-02-20 11:00:00'),
		).toBe(0);

		expect(
			calculateDaysBetweenDates('2025-02-20 23:10:27', '2025-02-20 11:00:00'),
		).toBe(0);
	});
	test('tomorrow should always result in 1 day', () => {
		expect(
			calculateDaysBetweenDates('2025-02-19 08:10:27', '2025-02-20 11:00:00'),
		).toBe(1);

		expect(
			calculateDaysBetweenDates('2025-02-19 23:10:27', '2025-02-20 23:12:00'),
		).toBe(1);
	});

	test('yesterday should always result in -1 day', () => {
		expect(
			calculateDaysBetweenDates('2025-02-21 08:10:27', '2025-02-20 07:00:00'),
		).toBe(-1);
	});
});

describe('calculateDaysBetweenDates with ignoreTime', () => {
	const {calculateDaysBetweenDates} = useDate();
	const calculateCalendarDays = (startDate, endDate) =>
		calculateDaysBetweenDates(startDate, endDate, {ignoreTime: true});

	test('due date today is 0 days away at any time of the day', () => {
		expect(calculateCalendarDays('2025-02-20 00:05:00', '2025-02-20')).toBe(0);
		expect(calculateCalendarDays('2025-02-20 23:55:00', '2025-02-20')).toBe(0);
	});

	test('due date tomorrow is 1 day away at any time of the day', () => {
		expect(calculateCalendarDays('2025-02-19 00:05:00', '2025-02-20')).toBe(1);
		// less than 24 hours until the due date starts
		expect(calculateCalendarDays('2025-02-19 23:55:00', '2025-02-20')).toBe(1);
	});

	test('due date yesterday is -1 day away at any time of the day', () => {
		expect(calculateCalendarDays('2025-02-21 00:05:00', '2025-02-20')).toBe(-1);
		expect(calculateCalendarDays('2025-02-21 23:55:00', '2025-02-20')).toBe(-1);
	});

	test('today is the day of the configured timezone, not of the browser', () => {
		// 01:00 UTC on the 21st, still the 20th in Vancouver
		const now = new Date('2025-02-21T01:00:00Z');

		global.pkp.context.timeZone = 'UTC';
		expect(calculateCalendarDays(now, '2025-02-22')).toBe(1);

		global.pkp.context.timeZone = 'America/Vancouver';
		expect(calculateCalendarDays(now, '2025-02-22')).toBe(2);

		global.pkp.context.timeZone = 'UTC';
	});

	test('a clock change does not add or drop a day', () => {
		global.pkp.context.timeZone = 'Europe/Prague';
		// clocks go forward on 2025-03-30
		expect(calculateCalendarDays('2025-03-29 12:00:00', '2025-03-31')).toBe(2);
		global.pkp.context.timeZone = 'UTC';
	});
});
