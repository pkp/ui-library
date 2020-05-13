<script>
import FieldBaseAutosuggest from '@/components/Form/fields/FieldBaseAutosuggest.vue';

export default {
	extends: FieldBaseAutosuggest,
	methods: {
		setSuggestions(items) {
			// Escape the search phrase for regex
			// See: https://stackoverflow.com/a/3561711/1723499
			const regex = new RegExp(
				this.inputValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
				'gi'
			);

			const suggestions = items
				.filter(u => u.fullName.match(regex))
				.filter(u => !this.currentValue.includes(u.id))
				.map(u => {
					return {
						value: u.id,
						label: u.fullName
					};
				});

			this.suggestions = [...suggestions];
		}
	}
};
</script>
