<script>
/**
 * Override the Composer component's API methods to
 * fake API requests. This way the UI Library can show
 * how the Composer would work in the application.
 */
import Composer from '@/components/Composer/Composer.vue';

export default {
	extends: Composer,
	methods: {
		search() {
			if (!this.emailTemplatesApiUrl) {
				return;
			}
			if (!this.searchPhrase) {
				this.searchResults = [];
				return;
			}
			this.isSearching = true;
			this.latestSearchRequest = $.pkp.classes.Helper.uuid();
			var self = this;

			setTimeout(() => {
				self.searchResults = [
					{
						key: 'EDITOR_DECISION_ACCEPT',
						subject: {
							en_US: 'Editor Decision'
						}
					},
					{
						key: 'EXAMPLE_ONE',
						subject: {
							en_US: 'Example One'
						}
					},
					{
						key: 'EXAMPLE_TWO',
						subject: {
							en_US: 'Example Two'
						}
					}
				];
				self.isSearching = false;
			}, 1000);
		}
	}
};
</script>
