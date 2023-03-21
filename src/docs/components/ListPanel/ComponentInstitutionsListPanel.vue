<script>
import Component from '@/docs/Component.vue';
import PreviewInstitutionsListPanel from './previews/PreviewInstitutionsListPanel.vue';
import PreviewInstitutionsListPanelTemplate from '!raw-loader!./previews/PreviewInstitutionsListPanel.vue';
import readme from '!raw-loader!./readme-institutions.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'InstitutionsListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewInstitutionsListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewInstitutionsListPanelTemplate),
				},
			],
		};
	},
};
</script>
