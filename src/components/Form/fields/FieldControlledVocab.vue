<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';
import debounce from 'debounce';

export default {
	name: 'FieldControlledVocab',
	extends: FieldBaseAutosuggest,
	data() {
		return {
			allSuggestions: [],
			suggestionsLoaded: false
		};
	},
	methods: {
		/**
		 * Get suggestions from a remote URL
		 */
		getSuggestions() {
			if (!this.inputValue) {
				this.suggestions = [];
				return;
			}
			if (!this.suggestionsLoaded) {
				const self = this;
				$.ajax({
					url: this.apiUrl,
					type: 'GET',
					data: this.isMultilingual ? {locale: this.localeKey} : {},
					error(r) {
						self.ajaxErrorCallback(r);
					},
					success(r) {
						self.allSuggestions = r.map(v => {
							return {
								value: v,
								label: v
							};
						});
						self.setSuggestions.apply(self);
						self.suggestionsLoaded = true;
					}
				});
			}
			this.setSuggestions();
		},

		/**
		 * Override the parent method to accept any typed
		 * input from the user as an option
		 *
		 * @param {Object|null} suggestion
		 */
		selectSuggestion(suggestion) {
			if (suggestion) {
				this.select(suggestion.item);
			} else if (this.inputValue) {
				this.select({
					value: this.inputValue,
					label: this.inputValue
				});
			}
		},

		/**
		 * Set the suggestions to a filtered set based on the current
		 * input value
		 *
		 * @param {Array} suggestions List of unfiltered suggestions
		 */
		setSuggestions: debounce(function() {
			// Escape the input for regex
			// See: https://stackoverflow.com/a/3561711/1723499
			const regex = new RegExp(
				this.inputValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
				'gi'
			);
			this.suggestions = this.allSuggestions.filter(
				suggestion =>
					!this.inputValue ||
					(this.inputValue !== suggestion.value &&
						suggestion.value.match(regex))
			);
			if (this.inputValue && !this.suggestions.includes(this.inputValue)) {
				this.suggestions.unshift({
					value: this.inputValue,
					label: this.inputValue
				});
			}
		}, 250)
	}
};
</script>
