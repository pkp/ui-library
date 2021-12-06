<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';

export default {
	name: 'FieldPagedAutosuggest',
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
			this.suggestions = this.dataMapper ? items.map(this.dataMapper) : items;
			this.itemsMax = itemsMax;
		}
	}
};
</script>
