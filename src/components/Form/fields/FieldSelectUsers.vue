<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';

export default {
	name: 'FieldSelectUsers',
	extends: FieldBaseAutosuggest,
	methods: {
		/**
		 * Set the suggestions from an API response
		 *
		 * Maps the API response when searching for users
		 * to an object with value and label props.
		 *
		 * @param {Array} items List of users
		 * @param {Number} itemsMax Total amount of users based on the applied filters
		 */
		setSuggestions(items, itemsMax) {
			const suggestions = items.map(item => {
				return {
					value: item.id,
					label: item.fullName
				};
			});
			this.suggestions = suggestions;
			this.itemsMax = itemsMax;
		}
	}
};
</script>
