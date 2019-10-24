<script type="text/javascript">
import WorkflowContainer from './WorkflowContainer.vue';

export default {
	name: 'WorkflowContainerOJS',
	extends: WorkflowContainer,
	data() {
		return {
			issueApiUrl: ''
		};
	},
	watch: {
		workingPublication(newVal, oldVal) {
			// Update the issue volume and number used in the DOI
			// field when the issue changes
			if (newVal.issueId === oldVal.issueId) {
				return;
			}
			var self = this;
			$.ajax({
				url: this.issueApiUrl.replace('__issueId__', newVal.issueId),
				type: 'GET',
				error(r) {
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.publicationFormIds.forEach(formId => {
						if (formId !== pkp.const.FORM_PUBLICATION_IDENTIFIERS) {
							return;
						}
						let form = {...self.components[formId]};
						form.fields = form.fields.map(field => {
							if (field.name === 'pub-id::doi') {
								field.issueNumber = r.number || '';
								field.issueVolume = r.volume || '';
								if (!self.workingPublication.datePublished) {
									field.year = r.year || '';
								}
							}
							return field;
						});
						self.components[formId] = {};
						self.components[formId] = form;
					});
				}
			});
		}
	}
};
</script>
