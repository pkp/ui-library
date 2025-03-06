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
