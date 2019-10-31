<script type="text/javascript">
import WorkflowContainer from './WorkflowContainer.vue';

export default {
	name: 'WorkflowContainerOJS',
	extends: WorkflowContainer,
	data() {
		return {
			issueApiUrl: '',
			sectionWordLimits: {}
		};
	},
	watch: {
		workingPublication(newVal, oldVal) {
			// Update the abstract word count when the section changes
			if (
				newVal.sectionId !== oldVal.sectionId &&
				this.components[pkp.const.FORM_TITLE_ABSTRACT]
			) {
				const wordLimit = this.sectionWordLimits[newVal.sectionId] || 0;
				let form = {...this.components[pkp.const.FORM_TITLE_ABSTRACT]};
				form.fields = form.fields.map(field => {
					if (field.name === 'abstract') {
						field.wordLimit = wordLimit;
					}
					return field;
				});
				this.components[pkp.const.FORM_TITLE_ABSTRACT] = {};
				this.components[pkp.const.FORM_TITLE_ABSTRACT] = form;
			}

			// Update the issue volume and number used in the DOI
			// field when the issue changes
			if (newVal.issueId !== oldVal.issueId) {
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
	}
};
</script>
