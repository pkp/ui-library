<script>
import Component from '@/docs/Component.vue';
import PreviewAnnouncementsListPanel from './previews/PreviewAnnouncementsListPanel.vue';
import PreviewAnnouncementsListPanelTemplate from '!raw-loader!./previews/PreviewAnnouncementsListPanel.vue';
import readme from '!raw-loader!./readme-announcements.md';

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
