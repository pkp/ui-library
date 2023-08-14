<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewSubmissionWizardPage.vue';
import Template from './previews/PreviewSubmissionWizardPage.vue?raw';
import readme from './readme.md?raw';

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
