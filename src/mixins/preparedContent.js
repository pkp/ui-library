/**
 * Prepared content mixin
 *
 * This mixin provides a method to render prepared content in
 * placeholders.
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
		 * @param {Object} preparedContent The placeholders (keys) and content (values)
		 */
		renderPreparedContent(string, preparedContent) {
			return Object.keys(preparedContent).reduce((string, key) => {
				return string.replaceAll('{$' + key + '}', preparedContent[key]);
			}, string);
		}
	}
};
