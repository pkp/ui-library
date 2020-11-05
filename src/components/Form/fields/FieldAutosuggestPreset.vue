<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';

export default {
	name: 'FieldAutosuggestPreset',
	extends: FieldBaseAutosuggest,
	props: {
		options: {
			type: Array,
			required: true
		}
	},
	methods: {
		/**
		 * Get suggestions from the preset options
		 */
		getSuggestions() {
			if (!this.inputValue || !this.options.length) {
				this.suggestions = [];
				return;
			}

			// Escape the input for regex
			// See: https://stackoverflow.com/a/3561711/1723499
			const regex = new RegExp(
				this.inputValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
				'gi'
			);
			this.suggestions = this.options.filter(option => {
				if (this.currentValue.includes(option.value)) {
					return false;
				}
				let valueMatch =
					typeof option.value === 'string'
						? option.value.match(regex)
						: option.value == this.inputValue;
				return valueMatch || option.label.match(regex);
			});
		}
	}
};
</script>
