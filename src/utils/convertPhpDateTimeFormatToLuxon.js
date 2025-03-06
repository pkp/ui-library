/**
 * Converts PHP datetime format tokens to Luxon format tokens
 * Generate by Claude (with bit of help)
 * @param {string} phpFormat - PHP datetime format string
 * @return {string} - Equivalent Luxon format string
 */
export function phpToLuxonFormat(phpFormat) {
	const formatMap = {
		// Day
		d: 'dd', // Day of the month, 2 digits with leading zeros
		D: 'ccc', // A textual representation of a day, three letters
		j: 'd', // Day of the month without leading zeros
		l: 'cccc', // A full textual representation of the day of the week
		N: 'E', // ISO-8601 numeric representation of the day of the week (1-7)
		S: '', // English ordinal suffix for the day of the month (no direct Luxon equivalent)
		w: 'c', // Numeric representation of the day of the week (0-6)
		z: 'o', // The day of the year (starting from 0)

		// Week
		W: 'WW', // ISO-8601 week number of year

		// Month
		F: 'LLLL', // A full textual representation of a month
		m: 'LL', // Numeric representation of a month, with leading zeros
		M: 'LLL', // A short textual representation of a month, three letters
		n: 'L', // Numeric representation of a month, without leading zeros
		t: '', // Number of days in the given month (no direct Luxon equivalent)

		// Year
		L: '', // Whether it's a leap year (no direct Luxon equivalent)
		o: 'kkkk', // ISO-8601 week-numbering year
		Y: 'yyyy', // A full numeric representation of a year, 4 digits
		y: 'yy', // A two digit representation of a year

		// Time
		a: 'a', // Lowercase Ante meridiem and Post meridiem
		A: 'a', // Uppercase Ante meridiem and Post meridiem (Luxon doesn't distinguish case)
		B: '', // Swatch Internet time (no Luxon equivalent)
		g: 'h', // 12-hour format of an hour without leading zeros
		G: 'H', // 24-hour format of an hour without leading zeros
		h: 'hh', // 12-hour format of an hour with leading zeros
		H: 'HH', // 24-hour format of an hour with leading zeros
		i: 'mm', // Minutes with leading zeros
		s: 'ss', // Seconds with leading zeros
		u: 'SSS', // Microseconds (Luxon only has milliseconds precision)
		v: 'SSS', // Milliseconds
		f: 'SSS', // Microseconds with trailing zeros (Luxon only has milliseconds)

		// Timezone
		e: 'z', // Timezone identifier (e.g., UTC, GMT)
		I: '', // Whether or not the date is in daylight saving time (no direct Luxon equivalent)
		O: 'ZZ', // Difference to Greenwich time (GMT) without colon
		P: 'Z', // Difference to Greenwich time (GMT) with colon
		p: 'z', // The same as P, but returns Z instead of +00:00 (available in PHP 8.0+)
		T: 'z', // Timezone abbreviation
		Z: '', // Timezone offset in seconds (no direct Luxon equivalent)

		// Full Date/Time
		c: "yyyy-LL-dd'T'HH:mm:ssZ", // ISO 8601 date
		r: 'ccc, dd LLL yyyy HH:mm:ss ZZ', // RFC 2822 formatted date
		U: 'X', // Seconds since the Unix Epoch

		// Additional formats
		x: "kkkk-'WW'", // ISO-8601 year-week pattern (e.g., 2022-W42)
		X: 'W', // ISO-8601 week number of year without leading zeroes (PHP 7.2.0+)
	};

	// Characters used in Luxon format tokens that need to be escaped when used as literals
	const luxonFormatChars = 'GyYQqMLwWdDFgHhmsSAazZEeOPTxkKc';

	let result = [];
	let i = 0;

	// Process the PHP format string character by character
	while (i < phpFormat.length) {
		// Handle escaped character in PHP
		if (phpFormat[i] === '\\' && i + 1 < phpFormat.length) {
			const char = phpFormat[i + 1];

			// Check if the escaped character needs quotes in Luxon
			if (luxonFormatChars.includes(char)) {
				result.push(`'${char}'`);
			} else if (char === "'") {
				// Escape single quotes by doubling them
				result.push("''");
			} else {
				result.push(char);
			}

			i += 2;
			continue;
		}

		// Check for PHP format tokens
		if (Object.prototype.hasOwnProperty.call(formatMap, phpFormat[i])) {
			const luxonToken = formatMap[phpFormat[i]];
			if (luxonToken) {
				result.push(luxonToken);
			}
			i++;
			continue;
		}

		// Handle literal characters
		const char = phpFormat[i];

		if (luxonFormatChars.includes(char)) {
			result.push(`'${char}'`);
		} else if (char === "'") {
			// Escape single quotes by doubling them
			result.push("''");
		} else {
			result.push(char);
		}

		i++;
	}

	return result.join('');
}
