<script type="text/javascript">
import WorkflowPage from './WorkflowPage.vue';

export default {
	name: 'WorkflowPageOPS',
	extends: WorkflowPage,
	data() {
		return {
			sectionWordLimits: {}
		};
	},
	methods: {
		/**
		 * Update the relation form to match a particular publication
		 *
		 * @param Object publication
		 */
		setRelationForm(publication) {
			let form = {...this.components[pkp.const.FORM_ID_RELATION]};
			form.action =
				this.submissionApiUrl + '/publications/' + publication.id + '/relate';
			form.fields = form.fields.map(field => {
				if (Object.keys(publication).includes(field.name)) {
					field.value = publication[field.name];
				}
				return field;
			});
			this.components[pkp.const.FORM_ID_RELATION] = {};
			this.components[pkp.const.FORM_ID_RELATION] = form;
		}
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
			if (newVal === oldVal) {
				return;
			}
			this.setRelationForm(newVal);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';
.pkpWorkflow__relation .pkpDropdown__content {
	min-width: 25em;
	max-width: 25em;
}
</style>
