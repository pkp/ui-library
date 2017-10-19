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
		 * @param string key The translation string to use
		 * @param params object (Optional) Variables to compile with the translation
		 * @return string
		 */
		__: function (key, params) {

			if (typeof this.i18n[key] === 'undefined') {
				console.log('Translation key ' + key + ' could not be found.');
				return '';
			}

			if (typeof params === 'undefined') {
				return this.i18n[key];
			}

			var str = this.i18n[key];
			for (var param in params) {
				str = str.replace('{$' + param + '}', params[param]);
			}
			return str;
		},

		/**
		 * Get the locale-specific string from a locale object.
		 *
		 * It will search for the current locale value. If there's no value for the
		 * current locale, it will revert to the primary locale. If there's still
		 * no match, it will return an empty string.
		 *
		 * This can be used in templates like this:
		 *
		 * {{ localize(fullTitle) }}
		 *
		 * If you want to force a specific locale and not print a fallback:
		 *
		 * {{ localize(fullTitle, 'fr_CA') }}
		 *
		 * @param object localizedString Key/value hash storing one string per locale
		 * @param string locale Optional. The locale to search for.
		 * @return string
		 */
		localize: function (localizedString, requestedLocale) {
			if (requestedLocale !== undefined) {
				return localizedString.hasOwnProperty(requestedLocale) ? localizedString[requestedLocale] : '';
			} else if (localizedString.hasOwnProperty($.pkp.app.currentLocale)) {
				return localizedString[$.pkp.app.currentLocale];
			} else if (localizedString.hasOwnProperty($.pkp.app.primaryLocale)) {
				return localizedString[$.pkp.app.primaryLocale];
			}
			return '';
		},

		/**
		 * Get an API endpoint URL
		 *
		 * This constructs an appropriate URL for querying the API, adjusting
		 * as necessary for the disable_path_info configuration option.
		 *
		 * @param string endpoint
		 * @return string
		 */
		getApiUrl: function (endpoint) {
			var apiBase;
			if ($.pkp.app.contextPath) {
				apiBase = '/' + $.pkp.app.contextPath + $.pkp.app.apiBasePath;
			} else {
				apiBase = $.pkp.app.apiBasePath;
			}
			if (!$.pkp.app.pathInfoEnabled) {
				if ($.pkp.app.contextPath) {
					return $.pkp.app.baseUrl + '/index.php?journal=' + encodeURIComponent($.pkp.app.contextPath) + '&endpoint=' + apiBase + '/' + endpoint;
				}
				return $.pkp.app.baseUrl + '/index.php?endpoint=' + apiBase + '/' + endpoint;
			}
			return $.pkp.app.baseUrl + '/index.php' + apiBase + '/' + endpoint;
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
		 * @param object r The response from jQuery's ajax request
		 * @return null
		 */
		ajaxErrorCallback: function (r) {
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
				dialogText: msg,
			};

			$modal = $(
				'<div id="' + $.pkp.classes.Helper.uuid() + '" ' +
				'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>')
				.pkpHandler(modalOptions.modalHandler, modalOptions);

			modalHandler = $.pkp.classes.Handler.getHandler($modal);

			modalHandler.modalBuild();
			modalHandler.modalOpen();
		},
	},
};
