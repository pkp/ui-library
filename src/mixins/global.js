/**
 * Global mixins
 *
 * Global mixins affect every single Vue instance created, so they should be
 * be used as little as possible. In most cases, prefer creating a mixin that
 * can be loaded into a component on-demand.
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
export default {
	methods: {
		/**
		 * Compile a string translation
		 *
		 * This method can be used in templates:
		 *
		 * {{ __('key') }}
		 *
		 * And parameters can be passed in:
		 *
		 * {{ __('key', { count: this.item_count }) }}
		 *
		 * @param {String} key The translation string to use
		 * @param {params} object (Optional) Variables to compile with the translation
		 * @return {String}
		 */
		__: function(key, params) {
			if (typeof this.i18n[key] === 'undefined') {
				return '';
			}

			if (typeof params === 'undefined') {
				return this.i18n[key];
			}

			var str = this.i18n[key];
			for (var param in params) {
				let value = params[param];
				// If a locale object is passed, take the value from the current locale
				if (value === Object(value)) {
					value = this.localize(value);
				}
				str = str.replace('{$' + param + '}', value);
			}
			return str;
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
		 * @param {Object} localizedString Key/value hash storing one string per locale
		 * @param {String} requestedLocale Optional. Request a specific locale
		 * @return {String}
		 */
		localize: function(localizedString, requestedLocale) {
			if (localizedString === null) {
				return '';
			} else if (requestedLocale !== undefined) {
				return localizedString.hasOwnProperty(requestedLocale)
					? localizedString[requestedLocale]
					: '';
			} else if (
				localizedString.hasOwnProperty($.pkp.app.currentLocale) &&
				localizedString[$.pkp.app.currentLocale]
			) {
				return localizedString[$.pkp.app.currentLocale];
			} else if (
				localizedString.hasOwnProperty($.pkp.app.primaryLocale) &&
				localizedString[$.pkp.app.primaryLocale]
			) {
				return localizedString[$.pkp.app.primaryLocale];
			}

			for (var key in localizedString) {
				if (localizedString[key]) {
					return localizedString[key];
				}
			}

			return '';
		},

		/**
		 * Get the locale-specific string for current locale
		 * from a string representing a Date.
		 *
		 * example : {{ localizeDate(submission.dateStatusModified) }}
		 *
		 * If you want to force a specific locale:
		 *
		 * {{ localizeDate(date, 'fr_CA') }}
		 *
		 * @param string representing a Date
		 * @param string requestedLocale Optional. Request a specific locale
		 * @return string
		 */
		localizeDate: function(str, requestedLocale) {
			if (!str) {
				return '';
			}
			str = new Date(str);
			let dateLocale =
					requestedLocale !== undefined
						? requestedLocale.replace('_', '-')
						: $.pkp.app.currentLocale.replace('_', '-');
			return str.toLocaleDateString(dateLocale);
		},

		/**
		 * Display an error message from an ajax request
		 *
		 * This callback expects to be attached to the `error` param of the
		 * jQuery $.ajax method. It can also be fired directly, but should have
		 * a jQuery response object with the following:
		 * {
		 *   responseJSON: {
		 *     error: 'localised.string.key',
		 *     errorMessage: 'The string rendered into localised form for display',
		 *   }
		 * }
		 *
		 * @param {Object} r The response from jQuery's ajax request
		 */
		ajaxErrorCallback: function(r) {
			var msg, modalOptions, $modal, modalHandler;

			if ('responseJSON' in r && 'errorMessage' in r.responseJSON) {
				msg = r.responseJSON.errorMessage;
			} else {
				msg = $.pkp.locale.api_submissions_unknownError;
			}

			modalOptions = {
				modalHandler: '$.pkp.controllers.modal.ConfirmationModalHandler',
				title: $.pkp.locale.common_error,
				okButton: $.pkp.locale.common_ok,
				cancelButton: false,
				dialogText: msg
			};

			$modal = $(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler(modalOptions.modalHandler, modalOptions);

			modalHandler = $.pkp.classes.Handler.getHandler($modal);

			modalHandler.modalBuild();
			modalHandler.modalOpen();
		},

		/**
		 * Set focus to the first focusable element within a dom node
		 *
		 * @param {ParentNode} el
		 */
		setFocusIn(el) {
			let focusable = el.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length) {
				focusable[0].focus();
			}
		}
	}
};
