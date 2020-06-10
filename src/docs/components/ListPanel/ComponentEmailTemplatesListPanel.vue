<script>
import Component from '@/docs/Component.vue';
import PreviewEmailTemplatesListPanel from './previews/PreviewEmailTemplatesListPanel.vue';
import PreviewEmailTemplatesListPanelTemplate from '!raw-loader!./previews/PreviewEmailTemplatesListPanel.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'EmailTemplatesListPanel',
			examples: [
				{
					component: PreviewEmailTemplatesListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewEmailTemplatesListPanelTemplate)
				}
			]
		};
	}
};
</script>
