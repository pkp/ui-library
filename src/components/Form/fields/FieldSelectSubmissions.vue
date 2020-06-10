<script>
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';

export default {
	name: 'FieldSelectSubmissions',
	extends: FieldBaseAutosuggest,
	methods: {
		/**
		 * Set the suggestions from an API response
		 *
		 * Maps the API response when searching for submissions
		 * to an object with value and label props.
		 *
		 * @param {Array} newItems List of submissions
		 */
		setSuggestions(newItems) {
			const suggestions = newItems
				.filter(item => {
					return !this.selected.find(s => s.id === item.id);
				})
				.map(item => {
					const currentPublication = item.publications.find(publication => {
						return publication.id === item.currentPublicationId;
					});
					if (!currentPublication) {
						return {
							value: 0,
							label: ''
						};
					} else {
						return {
							value: item.id,
							label: this.localize(currentPublication.fullTitle)
						};
					}
				});
			this.suggestions = suggestions;
		}
	}
};
</script>
