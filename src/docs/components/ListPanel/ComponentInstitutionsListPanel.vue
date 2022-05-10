<script>
import Component from '@/docs/Component.vue';
import PreviewInstitutionsListPanel from './previews/PreviewInstitutionsListPanel.vue';
import PreviewInstitutionsListPanelTemplate from '!raw-loader!./previews/PreviewInstitutionsListPanel.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'InstitutionsListPanel',
			examples: [
				{
					component: PreviewInstitutionsListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewInstitutionsListPanelTemplate)
				}
			]
		};
	}
};
</script>
