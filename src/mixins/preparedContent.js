/**
 * Prepared content mixin
 *
 * This mixin helps components work with prepared content. This
 * is a way to work with dynamic content in text strings.
 *
 * Example:
 *
 * this.renderPreparedContent(
 *   'Thank you for submitting to {$journalName}',
 *   [
 * 		{
 * 			key: 'journalName',
 * 			value: 'Journal of Public Knowledge',
 * 			description: ''
 * 		}
 *   ]
 * );
 *
 * Can produce:
 *
 * Thank you for submitting to Journal of Public Knowledge
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
export default {
	methods: {
		/**
		 * Replace placeholders with prepared content
		 *
		 * For example, a string "From {$editor}" can be converted to
		 * the string "From Daniel Barnes" if the following
		 * preparedContent is passed.
		 *
		 * {
		 *  editorName: "Daniel Barnes"
		 * }
		 *
		 * @param {String} string The string to manipulate
		 * @param {Array} preparedContent The list of prepared items
		 */
		renderPreparedContent(string, preparedContent) {
			return preparedContent.reduce((string, item) => {
				const regex = new RegExp(`{\$${item.key}}`.replace(/[${]/g, '\\$&'), 'g'); // eslint-disable-line
				return string.replace(regex, item.value);
			}, string);
		}
	}
};
