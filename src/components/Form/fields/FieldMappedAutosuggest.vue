<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';

export default {
	name: 'FieldMappedAutosuggest',
	extends: FieldBaseAutosuggest,
	props: {
		dataMapper: {
			type: Function
		}
	},
	methods: {
		/**
		 * Set the suggestions
		 *
		 * @param {Array} items List of items
		 * @param {Number} itemsMax Total amount of items from the API
		 */
		setSuggestions(items, itemsMax) {
			const suggestions = this.dataMapper ? items.map(this.dataMapper) : items;
			if (this.offset) {
				this.suggestions.push(...suggestions);
			} else {
				this.suggestions = suggestions;
			}
			this.itemsMax = itemsMax;
		}
	}
};
</script>
