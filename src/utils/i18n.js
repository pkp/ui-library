/**
 * Compile a string translation
 *
 * This method can be used in templates:
 *
 * {{ t('key') }}
 *
 * And parameters can be passed in:
 *
 * {{ t('key', { count: this.item_count }) }}
 *
 * @param {String} key The translation string to use
 * @param {Object} params (Optional) Variables to compile with the translation
 * @return {String}
 */
export function t(key, params) {
	if (
		typeof pkp === 'undefined' ||
		typeof pkp?.localeKeys?.[key] === 'undefined'
	) {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line
			console.error('Missing locale key: ', key);
		}
		return '';
	}

	if (typeof params === 'undefined') {
		return pkp.localeKeys[key];
	}

	return replaceLocaleParams(pkp.localeKeys[key], params);
}

/**
 * Replace params in a localized string
 *
 * Example:
 *
 * var str = this.replaceLocaleParams(
 * 	'Version {$num}',
 * 	{num: 1}
 * );
 * console.log(str); // result: Version 1
 *
 * @param {String} str String to replace params in
 * @param {Object} params Key/value hash of params to replace
 * @return {String}
 */
export function replaceLocaleParams(str, params) {
	for (var param in params) {
		let value = params[param];
		// If a locale object is passed, take the value from the current locale
		if (value === Object(value)) {
			value = localize(value);
		}
		const re = new RegExp('{\\$' + param + '}', 'g');
		str = str.replace(re, value);
	}
	return str;
}

/**
 * Get the locale-specific string from a locale object.
 *
 * It will search for the current locale value. If there's no value for the
 * current locale, it will revert to the primary locale. If there's still
 * no match, it will return the first available value or an empty string.
 *
 * This method mimics the DataObject::getLocalizedData() method from the
 * PHP backend.
 *
 * This can be used in templates like this:
 *
 * {{ localize(fullTitle) }}
 *
 * If you want to force a specific locale and not print a fallback:
 *
 * {{ localize(fullTitle, 'fr_CA') }}
 *
 * @param {Object} multilingualData Key/value hash storing one string per locale
 * @param {String} requestedLocale Optional. Request a specific locale
 * @return {String}
 */
export function localize(multilingualData, requestedLocale) {
	if (!multilingualData) {
		return '';
	} else if (typeof multilingualData === 'string') {
		return multilingualData;
	} else if (requestedLocale !== undefined) {
		return Object.prototype.hasOwnProperty.call(
			multilingualData,
			requestedLocale,
		)
			? multilingualData[requestedLocale]
			: '';
	} else if (
		Object.prototype.hasOwnProperty.call(
			multilingualData,
			pkp.context.currentLocale,
		) &&
		multilingualData[pkp.context.currentLocale]
	) {
		return multilingualData[pkp.context.currentLocale];
	} else if (
		Object.prototype.hasOwnProperty.call(
			multilingualData,
			pkp.context.primaryLocale,
		) &&
		multilingualData[pkp.context.primaryLocale]
	) {
		return multilingualData[pkp.context.primaryLocale];
	}

	for (var key in multilingualData) {
		if (multilingualData[key]) {
			return multilingualData[key];
		}
	}

	return '';
}

/**
 * Get a submission's locale-specific string from a locale object.
 *
 * This method mimics the global localize mixin, but falls back to the
 * submission locale before falling back to the journal's primary locale.
 *
 * @param {Object} localizedString Key/value hash storing one string per locale
 * @param {String} submissionLocale The submission's locale
 * @return {String}
 */
export function localizeSubmission(localizedString, submissionLocale) {
	if (typeof localizedString === 'undefined') {
		return '';
	} else if (
		Object.prototype.hasOwnProperty.call(
			localizedString,
			pkp.context.currentLocale,
		) &&
		localizedString[pkp.context.currentLocale]
	) {
		return localizedString[pkp.context.currentLocale];
	} else if (
		Object.prototype.hasOwnProperty.call(localizedString, submissionLocale) &&
		localizedString[submissionLocale]
	) {
		return localizedString[submissionLocale];
	} else if (
		Object.prototype.hasOwnProperty.call(
			localizedString,
			pkp.context.primaryLocale,
		) &&
		localizedString[pkp.context.primaryLocale]
	) {
		return localizedString[pkp.context.primaryLocale];
	}

	for (var key in localizedString) {
		if (localizedString[key]) {
			return localizedString[key];
		}
	}

	return '';
}
