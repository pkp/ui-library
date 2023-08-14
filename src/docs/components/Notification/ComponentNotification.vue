<script>
import Component from '@/docs/Component.vue';
import PreviewNotification from './previews/PreviewNotification.vue';
import PreviewNotificationTemplate from './previews/PreviewNotification.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Notification',
			readme: readme,
			examples: [
				{
					component: PreviewNotification,
					name: 'Base',
					template: this.extractTemplate(PreviewNotificationTemplate),
				},
			],
		};
	},
};
</script>
