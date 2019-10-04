<script>
import FieldAutosuggest from './FieldAutosuggest.vue';

export default {
	name: 'FieldControlledVocab',
	extends: FieldAutosuggest,
	methods: {
		/**
		 * Get suggestions from a remote URL
		 */
		getSuggestions() {
			if (!this.suggestionsLoaded) {
				const self = this;
				$.ajax({
					url: this.suggestionsUrl,
					type: 'GET',
					data: this.isMultilingual ? {locale: this.localeKey} : {},
					error(r) {
						self.ajaxErrorCallback(r);
					},
					success(r) {
						self.suggestions = r;
						self.suggestionsLoaded = true;
					}
				});
			}
		}
	}
};
</script>
