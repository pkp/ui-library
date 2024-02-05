/**
 * Mixin for localizing submission data, which accounts for submission locale.
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */

import {localizeSubmission} from '../utils/i18n';
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
		localizeSubmission: function (localizedString, submissionLocale) {
			return localizeSubmission(localizedString, submissionLocale);
		},
	},
};
