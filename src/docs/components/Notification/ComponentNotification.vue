<script>
import Component from '@/docs/Component.vue';
import PreviewNotification from './previews/PreviewNotification.vue';
import PreviewNotificationTemplate from '!raw-loader!./previews/PreviewNotification.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewNotificationTemplate)
				}
			]
		};
	}
};
</script>
