<script>
import Example from '@/docs/Example.vue';
import PreviewEmailTemplatesListPanel from './previews/PreviewEmailTemplatesListPanel.vue';
import fileContent from '!raw-loader!./previews/PreviewEmailTemplatesListPanel.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewEmailTemplatesListPanel
	},
	data() {
		return {
			...config,
			component: 'preview-email-templates-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
