<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';

export default {
	name: 'FieldSelectIssues',
	extends: FieldBaseAutosuggest,
	methods: {
		/**
		 * Set the suggestions from an API response
		 *
		 * Maps the API response when searching for issues
		 * to an object with value and label props.
		 *
		 * @param {Array} items List of issues
		 * @param {Number} itemsMax Total amount of issues based on the applied filters
		 */
		setSuggestions(items, itemsMax) {
			const suggestions = items.map(item => {
				return {
					value: item.id,
					label: item.identification
				};
			});
			this.suggestions = suggestions;
			this.itemsMax = itemsMax;
		}
	}
};
</script>
