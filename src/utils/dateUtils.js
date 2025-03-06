import {DateTime} from 'luxon';
import {phpToLuxonFormat} from './convertPhpDateTimeFormatToLuxon';

/**
 * Retrieves the short date format from the pkp context.
 * @returns {string} The short date format string.
 * @throws {Error} If pkp.context.dateFormatShort is not configured.
 */
function getDateFormatShort() {
	if (typeof pkp === 'undefined' || !pkp?.context?.dateFormatShort) {
		throw new Error('pkp.context.dateFormatShort is not configured');
	}
	return pkp.context.dateFormatShort;
}

/**
 * Retrieves the short datetime format from the pkp context.
 * @returns {string} The short datetime format string.
 * @throws {Error} If pkp.context.datetimeFormatShort is not configured.
 */
function getDateTimeFormatShort() {
	if (typeof pkp === 'undefined' || !pkp?.context?.datetimeFormatShort) {
		throw new Error('pkp.context.datetimeFormatShort is not configured');
	}
	return pkp.context.datetimeFormatShort;
}

/**
 * Retrieves the configured timezone from the pkp context.
 * @returns {string} The timezone string, defaults to 'UTC' if not set.
 * @throws {Error} If pkp.context.timeZone is not configured.
 */
function getConfiguredTimezone() {
	if (typeof pkp === 'undefined' || !pkp?.context?.timeZone) {
		throw new Error('pkp.context.timeZone is not configured');
	}
	return pkp.context.timeZone || 'UTC';
}

/**
 * Retrieves the current locale configured in the pkp context and converts it to a Luxon-compatible locale.
 * @returns {string} The Luxon-compatible locale string.
 * @throws {Error} If pkp.context.currentLocale is not configured.
 */
export function getDateCurrentLocale() {
	if (typeof pkp === 'undefined' || !pkp?.context?.currentLocale) {
		throw new Error('pkp.context.currentLocale is not configured');
	}
	return getLuxonLocale(pkp.context.currentLocale);
}

/**
 * Converts a locale string to a Luxon-compatible format and validates it.
 * @param {string} _locale - The locale string (e.g., 'en_US' or 'fr-FR').
 * @returns {string} A Luxon-compatible locale string, falling back to 'en' if unsupported.
 */
export function getLuxonLocale(_locale) {
	// There might be added more nuanced mapping if we identify that some locale needs to be mapped
	const locale = _locale.replace('_', '-');
	if (isLocaleSupported(locale)) {
		return locale;
	}
	// fallback
	return 'en';
}

/**
 * Checks if a locale is supported by the Intl.DateTimeFormat API.
 * @param {string} locale - The locale string to validate.
 * @returns {boolean} True if the locale is supported, false otherwise.
 */
function isLocaleSupported(locale) {
	try {
		new Intl.DateTimeFormat(locale);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Parses a date or datetime string into a Luxon DateTime object.
 * @param {string | Date} dateString - The date string (e.g., '2023-01-01', '2023-01-01 12:00:00') or Date object.
 * @returns {DateTime} A Luxon DateTime object representing the parsed date.
 */
export function parseDateTimeString(dateString) {
	// in case its already Date object
	if (dateString instanceof Date) {
		return DateTime.fromJSDate(dateString);
	}
	const isItISOString = dateString.includes('T');
	const doesItIncludeTime = dateString.includes(' ');
	return isItISOString
		? DateTime.fromISO(dateString)
		: doesItIncludeTime
			? DateTime.fromFormat(dateString, 'yyyy-MM-dd HH:mm:ss', {
					zone: getConfiguredTimezone(),
				})
			: DateTime.fromFormat(dateString, 'yyyy-MM-dd', {
					zone: getConfiguredTimezone(),
				});
}

/**
 * Calculates the number of days between two dates.
 * @param {string | Date} _startDate - The start date as a string or Date object.
 * @param {string | Date} _endDate - The end date as a string or Date object.
 * @returns {number} The number of days between the two dates (truncated to an integer).
 */
export function calculateDaysBetweenDates(_startDate, _endDate) {
	const startDateTime = parseDateTimeString(_startDate);
	const endDateTime = parseDateTimeString(_endDate);
	const diffInDays =
		// + 0 is trick to avoid -0
		// at least 24 hours diff is considered as 1 day, at least 48 hours diff as 2 days etc
		Math.trunc(endDateTime.diff(startDateTime, 'days').days) + 0;
	return diffInDays;
}

/**
 * Formats a Luxon DateTime object using a PHP-style format string.
 * @param {DateTime} dateTime - The Luxon DateTime object to format.
 * @param {string} phpFormat - The PHP-style format string (e.g., 'Y-m-d').
 * @param {string} [locale='en'] - The locale to use for formatting (defaults to 'en').
 * @returns {string} The formatted date string.
 */
export function formatDateWithPhpFormat(dateTime, phpFormat, locale = 'en') {
	const luxonFormat = phpToLuxonFormat(phpFormat);
	return dateTime.setLocale(getLuxonLocale(locale)).toFormat(luxonFormat);
}

/**
 * Formats a date string using the configured short date format and current locale.
 * @param {string | Date} dateString - The date string or Date object to format.
 * @returns {string} The formatted date string, or an empty string if dateString is falsy.
 */
export function formatShortDate(dateString) {
	if (!dateString) {
		return '';
	}
	const dateTime = parseDateTimeString(dateString);
	return formatDateWithPhpFormat(
		dateTime,
		getDateFormatShort(),
		getDateCurrentLocale(),
	);
}

/**
 * Formats a datetime string using the configured short datetime format and current locale.
 * @param {string | Date} dateString - The datetime string or Date object to format.
 * @returns {string} The formatted datetime string, or an empty string if dateString is falsy.
 */
export function formatShortDateTime(dateString) {
	if (!dateString) {
		return '';
	}
	const dateTime = parseDateTimeString(dateString);
	return formatDateWithPhpFormat(
		dateTime,
		getDateTimeFormatShort(),
		getDateCurrentLocale(),
	);
}

/**
 * Generates a relative time string (e.g., "2 days ago") from a timestamp.
 * @param {number} timestamp - The timestamp in milliseconds.
 * @returns {string} A relative time string based on the current locale.
 */
export function relativeStringTimeFromNow(timestamp) {
	return DateTime.fromMillis(timestamp).toRelative({
		locale: getDateCurrentLocale(),
	});
}
