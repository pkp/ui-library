export function useDate() {
	function calculateDaysBetweenDates(startDate, endDate) {
		const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day
		const start = new Date(startDate);
		const end = new Date(endDate);

		const difference = end - start; // difference in milliseconds

		return Math.round(difference / oneDay);
	}
	return {calculateDaysBetweenDates};
}
