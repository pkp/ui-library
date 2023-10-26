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
	if (typeof pkp.localeKeys[key] === 'undefined') {
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
			value = this.localize(value);
		}
		const re = new RegExp('{\\$' + param + '}', 'g');
		str = str.replace(re, value);
	}
	return str;
}
