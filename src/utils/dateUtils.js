import {DateTime} from 'luxon';
import {convertPhpToLuxonFormat} from './convertPhpDateTimeFormatToLuxon';
function getDateFormatShort() {
	if (typeof pkp === 'undefined' || !pkp?.context?.dateFormatShort) {
		throw new Error('pkp.context.dateFormatShort is not configured');
	}

	return pkp.context.dateFormatShort;
}

function getDateTimeFormatShort() {
	if (typeof pkp === 'undefined' || !pkp?.context?.datetimeFormatShort) {
		throw new Error('pkp.context.datetimeFormatShort is not configured');
	}

	return pkp.context.datetimeFormatShort;
}

function getConfiguredTimezone() {
	if (typeof pkp === 'undefined' || !pkp?.context?.timeZone) {
		throw new Error('pkp.context.timeZone is not configured');
	}

	return pkp.context.timeZone || 'UTC';
}

export function getDateCurrentLocale() {
	if (typeof pkp === 'undefined' || !pkp?.context?.currentLocale) {
		throw new Error('pkp.context.currentLocale is not configured');
	}

	return getLuxonLocale(pkp.context.currentLocale);
}

export function getLuxonLocale(_locale) {
	// There might be added more nuanced mapping if we identify that some locale needs to be mapped
	const locale = _locale.replace('_', '-');

	if (isLocaleSupported(locale)) {
		return locale;
	}
	// falback
	return 'en';
}

function isLocaleSupported(locale) {
	try {
		new Intl.DateTimeFormat(locale);
		return true;
	} catch (e) {
		return false;
	}
}

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

export function calculateDaysBetweenDates(_startDate, _endDate) {
	const startDateTime = parseDateTimeString(_startDate);
	const endDateTime = parseDateTimeString(_endDate);

	const diffInDays =
		// + 0 is trick to avoid -0
		// at least 24 hours diff is considered as 1 day, at least 48  hours diff as 2 days etc
		Math.trunc(endDateTime.diff(startDateTime, 'days').days) + 0;
	return diffInDays;
}

// Helper function to format a date with a PHP-style format string
export function formatDateWithPhpFormat(dateTime, phpFormat, locale = 'en') {
	const luxonFormat = convertPhpToLuxonFormat(phpFormat);
	return dateTime.setLocale(getLuxonLocale(locale)).toFormat(luxonFormat);
}

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

export function relativeStringTimeFromNow(timestamp) {
	return DateTime.fromMillis(timestamp).toRelative({
		locale: getDateCurrentLocale(),
	});
}
