<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';
import debounce from 'debounce';

export default {
	name: 'FieldControlledVocab',
	extends: FieldBaseAutosuggest,
	data() {
		return {
			allSuggestions: [],
			suggestionsLoaded: false,
			suggestionsLoading: false,
			allowCustom: true,
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
			if (this.suggestionsLoading) {
				return;
			}
			if (!this.suggestionsLoaded) {
				this.loadSuggestions(this.setSuggestions);
			}
			this.setSuggestions();
		},

		/**
		 * Load suggestions from the API
		 */
		loadSuggestions(successCallback) {
			this.suggestionsLoading = true;
			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				context: this,
				data: this.isMultilingual ? {locale: this.localeKey} : {},
				error(r) {
					this.ajaxErrorCallback(r);
				},
				success(r) {
					this.allSuggestions = r.map((v) => {
						return {
							value: v,
							label: v,
						};
					});
					this.suggestionsLoaded = true;
					this.suggestionsLoading = false;
					if (successCallback) {
						successCallback.apply(this);
					}
				},
			});
		},

		/**
		 * Override the parent method to accept any typed
		 * input from the user as an option
		 *
		 * @param {Object|null} suggestion
		 */
		selectSuggestion(suggestion) {
			if (suggestion) {
				this.select(suggestion);
			} else if (this.inputValue) {
				this.select({
					value: this.inputValue,
					label: this.inputValue,
				});
			}
		},

		/**
		 * Set the suggestions to a filtered set based on the current
		 * input value
		 *
		 * @param {Array} suggestions List of unfiltered suggestions
		 */
		setSuggestions: debounce(function () {
			// Escape the input for regex
			// See: https://stackoverflow.com/a/3561711/1723499
			const regex = new RegExp(
				this.inputValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
				'gi',
			);
			this.suggestions = this.allSuggestions.filter(
				(suggestion) =>
					!this.inputValue ||
					(this.inputValue !== suggestion.value &&
						suggestion.value.match(regex)),
			);
		}, 250),
	},
	watch: {
		/**
		 * Update the selected property when the value
		 * is changed outside of the field.
		 */
		value(newVal, oldVal) {
			if (!newVal || newVal === oldVal) {
				return;
			}
			// Check for duplicate object and array values
			if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
				return;
			}
			this.loadSuggestions(() => {
				const localizedValue = this.isMultilingual
					? newVal[this.localeKey]
					: newVal;
				// Empty values will come back in the API as a string
				if (!Array.isArray(localizedValue)) {
					this.setSelected([]);
					return;
				}
				this.setSelected(
					this.allSuggestions.filter((s) => localizedValue.includes(s.value)),
				);
			});
		},
	},
};
</script>
