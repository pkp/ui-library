<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewInstitutionsListPanel from './previews/PreviewInstitutionsListPanel.vue';
import PreviewInstitutionsListPanelTemplate from './previews/PreviewInstitutionsListPanel.vue?raw';
import readme from './readme-institutions.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'InstitutionsListPanel',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewInstitutionsListPanel),
					name: 'Base',
					template: this.extractTemplate(PreviewInstitutionsListPanelTemplate),
				},
			],
		};
	},
};
</script>
