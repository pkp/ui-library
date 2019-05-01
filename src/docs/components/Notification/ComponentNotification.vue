<script>
import Component from '@/docs/Component.vue';
import ExampleNotification from './ExampleNotification.vue';
import ExampleNotificationInfo from './ExampleNotificationInfo.vue';

export default {
	extends: Component,
	components: {
		ExampleNotification,
		ExampleNotificationInfo
	},
	data() {
		return {
			name: 'Notification',
			examples: {
				ExampleNotification: 'Base',
				ExampleNotificationInfo: 'Info Type'
			}
		};
	}
};
</script>
