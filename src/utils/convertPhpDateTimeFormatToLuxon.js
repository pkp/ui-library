/**
 * PHP datetime format conversion to Luxon
 * Generated with LLM, so probably overkill implementation,
 * but works as expected
 * */

const phpFormatSpecifiers = new Set([
	'd',
	'j',
	'D',
	'l',
	'N',
	'S',
	'w',
	'z',
	'W',
	'F',
	'm',
	'M',
	'n',
	't',
	'L',
	'o',
	'Y',
	'y',
	'a',
	'A',
	'B',
	'g',
	'G',
	'h',
	'H',
	'i',
	's',
	'u',
	'e',
	'I',
	'O',
	'P',
	'T',
	'Z',
	'c',
	'r',
	'U',
]);

// Mapping from PHP format specifiers to Luxon tokens
const phpToLuxonMap = {
	// Day
	d: 'dd', // Day of the month, 2 digits (01-31)
	j: 'd', // Day of the month without leading zeros (1-31)
	D: 'EEE', // Abbreviated weekday name (Mon-Sun)
	l: 'EEEE', // Full weekday name (Monday-Sunday)
	N: 'c', // ISO-8601 weekday (1 [Monday] to 7 [Sunday]), note: locale-dependent in Luxon
	S: '', // English ordinal suffix (st, nd, rd, th), handled with 'jS' as 'do'
	w: 'e', // Weekday (0 [Sunday] to 6 [Saturday]), note: locale-dependent in Luxon
	z: 'DDD', // Day of the year (0-365), note: Luxon is 1-based (1-366)
	W: 'W', // ISO-8601 week number

	// Month
	F: 'LLLL', // Full month name (January-December)
	m: 'LL', // Month, 2 digits (01-12)
	M: 'LLL', // Abbreviated month name (Jan-Dec)
	n: 'L', // Month without leading zeros (1-12)
	t: '', // Number of days in the month (28-31), not supported in Luxon

	// Year
	L: '', // Leap year (1 or 0), not supported in Luxon
	o: 'YYYY', // ISO-8601 week-numbering year
	Y: 'yyyy', // Full year (e.g., 2023)
	y: 'yy', // Two-digit year (e.g., 23)

	// Time
	a: 'a', // Lowercase am/pm
	A: 'a', // Uppercase AM/PM, Luxon uses locale-appropriate case
	B: '', // Swatch Internet time (000-999), not supported in Luxon
	g: 'h', // 12-hour hour without leading zeros (1-12)
	G: 'H', // 24-hour hour without leading zeros (0-23)
	h: 'hh', // 12-hour hour with leading zeros (01-12)
	H: 'HH', // 24-hour hour with leading zeros (00-23)
	i: 'mm', // Minutes with leading zeros (00-59)
	s: 'ss', // Seconds with leading zeros (00-59)
	u: 'SSS', // Microseconds, approximated to milliseconds in Luxon (000-999)

	// Timezone
	e: 'z', // Timezone identifier (e.g., UTC, America/New_York)
	I: '', // Daylight saving time (1 or 0), not supported in Luxon
	O: 'ZZ', // Offset in hours and minutes (e.g., +0200)
	P: 'ZZZ', // Offset with colon (e.g., +02:00)
	T: 'z', // Timezone abbreviation (e.g., EST)
	Z: '', // Offset in seconds, not supported in Luxon

	// Full Date/Time
	c: "yyyy-MM-dd'T'HH:mm:ssZZZ", // ISO 8601 date (e.g., 2004-02-12T15:19:21+00:00)
	r: 'EEE, d MMM yyyy HH:mm:ss ZZZ', // RFC 2822 date (e.g., Thu, 21 Dec 2000 16:01:07 +0200)
	U: 'X', // Unix timestamp in seconds (e.g., 1700000000)
};

// Tokenize the PHP format string into format specifiers and literals
function tokenizePhpFormat(phpFormat) {
	const tokens = [];
	let i = 0;
	while (i < phpFormat.length) {
		const char = phpFormat[i];
		if (char === '\\') {
			if (i + 1 < phpFormat.length) {
				tokens.push({type: 'literal', value: phpFormat[i + 1]});
				i += 2;
			} else {
				tokens.push({type: 'literal', value: '\\'});
				i++;
			}
		} else if (phpFormatSpecifiers.has(char)) {
			tokens.push({type: 'format', value: char});
			i++;
		} else {
			tokens.push({type: 'literal', value: char});
			i++;
		}
	}
	return tokens;
}

// Convert tokens to Luxon format string
function tokensToLuxonFormat(tokens) {
	let luxonFormat = '';
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.type === 'format') {
			// Handle 'jS' as a special case
			if (
				token.value === 'j' &&
				i + 1 < tokens.length &&
				tokens[i + 1].type === 'format' &&
				tokens[i + 1].value === 'S'
			) {
				luxonFormat += 'do';
				i++; // Skip the 'S'
			} else {
				luxonFormat += phpToLuxonMap[token.value] || '';
			}
		} else if (token.type === 'literal') {
			const char = token.value;
			// Enclose letters in single quotes to treat as literals in Luxon
			if (/[a-zA-Z]/.test(char)) {
				luxonFormat += `'${char}'`;
			} else {
				luxonFormat += char;
			}
		}
	}
	return luxonFormat;
}

// Main conversion function
export function convertPhpToLuxonFormat(phpFormat) {
	const tokens = tokenizePhpFormat(phpFormat);
	const luxonFormat = tokensToLuxonFormat(tokens);
	return luxonFormat;
}
