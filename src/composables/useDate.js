import moment from 'moment';

function convertUTCStringDateToDate(stringDate) {
	return new Date(
		stringDate.includes(' ')
			? stringDate.replace(' ', 'T') + 'Z' // "2025-02-07 05:37:07" -> "2025-02-07T05:37:07Z"
			: stringDate + 'T00:00:00Z', // "2025-02-07" -> "2025-02-07T00:00:00Z"
	);
}

export function useDate() {
	function calculateDaysBetweenDates(startDate, endDate) {
		const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day
		const start =
			startDate instanceof Date
				? startDate
				: convertUTCStringDateToDate(startDate);

		const end =
			endDate instanceof Date ? endDate : convertUTCStringDateToDate(endDate);

		start.setUTCHours(0, 0, 0, 0);
		end.setUTCHours(0, 0, 0, 0);
		const difference = end - start; // difference in milliseconds
		return Math.round(difference / oneDay);
	}

	function formatShortDate(dateString) {
		return moment(dateString).format('DD-MM-YYYY');
	}

	function formatDateAndTime(dateString) {
		return moment(dateString).format('YYYY-MM-DD hh:mm A');
	}

	return {calculateDaysBetweenDates, formatShortDate, formatDateAndTime};
}
