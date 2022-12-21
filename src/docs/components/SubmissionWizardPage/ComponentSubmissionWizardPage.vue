<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewSubmissionWizardPage.vue';
import Template from '!raw-loader!./previews/PreviewSubmissionWizardPage.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'SubmissionWizardPage',
			readme: readme,
			examples: [
				{
					component: Preview,
					name: 'Base',
					template: this.extractTemplate(Template),
				},
			],
		};
	},
};
</script>
