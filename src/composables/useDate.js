import moment from 'moment';

export function useDate() {
	function calculateDaysFromNow(dateString) {
		// Step 1: Parse input as UTC
		const inputDate = new Date(
			dateString.includes(' ')
				? dateString.replace(' ', 'T') + 'Z' // "2025-02-07 05:37:07" -> "2025-02-07T05:37:07Z"
				: dateString + 'T00:00:00Z', // "2025-02-07" -> "2025-02-07T00:00:00Z"
		);

		// Step 2: Get current date as UTC midnight
		const now = new Date();
		const nowUTC = new Date(
			Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate(),
				0,
				0,
				0,
			),
		);

		// Step 3: Calculate difference in whole days
		const diffMilliseconds = inputDate - nowUTC;
		const millisecondsPerDay = 1000 * 60 * 60 * 24; // 86,400,000 ms
		return Math.floor(diffMilliseconds / millisecondsPerDay);
	}

	function formatShortDate(dateString) {
		return moment(dateString).format('DD-MM-YYYY');
	}

	function formatDateAndTime(dateString) {
		return moment(dateString).format('YYYY-MM-DD hh:mm A');
	}

	return {calculateDaysFromNow, formatShortDate, formatDateAndTime};
}
