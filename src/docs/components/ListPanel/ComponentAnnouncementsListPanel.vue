<script>
import Component from '@/docs/Component.vue';
import PreviewAnnouncementsListPanel from './previews/PreviewAnnouncementsListPanel.vue';
import PreviewAnnouncementsListPanelTemplate from './previews/PreviewAnnouncementsListPanel.vue?raw';
import readme from './readme-announcements.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'AnnouncementsListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewAnnouncementsListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewAnnouncementsListPanelTemplate),
				},
			],
		};
	},
};
</script>
