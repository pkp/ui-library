/**
 * Global mixins
 *
 * Global mixins affect every single Vue instance created, so they should be
 * be used as little as possible. In most cases, prefer creating a mixin that
 * can be loaded into a component on-demand.
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
import {DateTime} from 'luxon';
import {replaceLocaleParams, t, localize} from '../utils/i18n';
export default {
	methods: {
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
		t: function (key, params) {
			return t(key, params);
		},

		/**
		 * Parses ISO-8601 date strings in cross-browser compatible way and returns default JS Date object.
		 * @param {String} dateString
		 */
		getBrowserSafeDate(dateString) {
			return DateTime.fromISO(dateString, {zone: 'utc'}).toJSDate();
		},

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
		localize: function (multilingualData, requestedLocale) {
			return localize(multilingualData, requestedLocale);
		},

		/**
		 * Get the locale-specific string for current locale
		 * from a string representing a Date.
		 *
		 * example : {{ localizeDate(submission.dateLastActivity) }}
		 *
		 * If you want to force a specific locale:
		 *
		 * {{ localizeDate(date, 'fr_CA') }}
		 *
		 * @param string representing a Date
		 * @param string requestedLocale Optional. Request a specific locale
		 * @return string
		 */
		localizeDate(str, requestedLocale) {
			if (!str) {
				return '';
			}
			str = this.getBrowserSafeDate(str);
			let dateLocale =
				requestedLocale !== undefined
					? requestedLocale.replace('_', '-')
					: $.pkp.app.currentLocale.replace('_', '-');
			return str.toLocaleDateString(dateLocale, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		},

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
		replaceLocaleParams(str, params) {
			return replaceLocaleParams(str, params);
		},

		/**
		 * Set focus to a focusable element within a dom node
		 *
		 * @param {ParentNode} el
		 * @param {Boolean} toLast Move the focus to the last focusable element
		 */
		setFocusIn(el, toLast) {
			const selectors = [
				'button',
				'[href]',
				'input',
				'select',
				'textarea',
				'details',
				'[tabindex]:not([tabindex="-1"])',
			];
			let focusable = [...el.querySelectorAll(selectors.join(','))]
				.filter((node) => !node.hasAttribute('disabled'))
				.filter((node) => !node.hasAttribute('aria-hidden'));
			if (focusable.length) {
				if (toLast) {
					focusable[focusable.length - 1].focus();
				} else {
					focusable[0].focus();
				}
			}
		},

		/**
		 * Set the focus to an element stored as a $ref in this component
		 *
		 * @param {String} ref
		 */
		setFocusToRef(ref) {
			if (!this.$refs[ref]) {
				return;
			}
			if (this.$refs[ref].$el) {
				this.$refs[ref].$el.focus();
			} else if (typeof this.$refs[ref].focus !== 'undefined') {
				this.$refs[ref].focus();
			}
		},
	},
};
