/**
 * Mixin for localizing submission data, which accounts for submission locale.
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
export default {
	methods: {
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
		localizeSubmission: function(localizedString, submissionLocale) {
			if (typeof localizedString === 'undefined') {
				return '';
			} else if (
				localizedString.hasOwnProperty($.pkp.app.currentLocale) &&
				localizedString[$.pkp.app.currentLocale]
			) {
				return localizedString[$.pkp.app.currentLocale];
			} else if (
				localizedString.hasOwnProperty(submissionLocale) &&
				localizedString[submissionLocale]
			) {
				return localizedString[submissionLocale];
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
		}
	}
};
