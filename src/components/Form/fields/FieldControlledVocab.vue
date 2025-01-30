<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';
import debounce from 'debounce';

function setSuggestion(value) {
	const {name, label = null, identifier = null, ...extraItems} = value;
	const suggestion = {
		value: value,
		label: label ?? name,
		identifier: identifier,
		...(extraItems ? {extraItems: extraItems} : {}),
	};
	return suggestion;
}

export default {
	name: 'FieldControlledVocab',
	extends: FieldBaseAutosuggest,
	props: {
		/** An array of options to suggest. */
		allowCustom: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			allSuggestions: [],
			suggestionsLoading: false,
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
			this.loadSuggestions(this.setSuggestions);
			this.setSuggestions();
		},

		/**
		 * Load suggestions from the API
		 */
		loadSuggestions: debounce(function (successCallback) {
			this.suggestionsLoading = true;
			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				context: this,
				data: {
					term: this.inputValue ?? null,
					...(this.isMultilingual ? {locale: this.localeKey} : {}),
				},
				error(r) {
					this.ajaxErrorCallback(r);
				},
				success(r) {
					this.allSuggestions = r.map((v) => setSuggestion(v));
					this.suggestionsLoading = false;
					if (successCallback) {
						successCallback.apply(this);
					}
				},
			});
		}, 250),

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
					value: {name: this.inputValue},
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
					(this.inputValue !== suggestion.value.name &&
						suggestion.value.name.match(regex)),
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
