import {
	formatShortDate,
	formatShortDateTime,
	calculateDaysBetweenDates,
	getDateCurrentLocale,
	relativeStringTimeFromNow,
} from '@/utils/dateUtils';

export function useDate() {
	return {
		calculateDaysBetweenDates,
		formatShortDate,
		formatShortDateTime,
		getDateCurrentLocale,
		relativeStringTimeFromNow,
	};
}
