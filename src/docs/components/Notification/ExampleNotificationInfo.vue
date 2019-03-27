<script>
import Example from '@/docs/Example.vue';
import PreviewNotificationInfo from './previews/PreviewNotificationInfo.vue';
import fileContent from '!raw-loader!./previews/PreviewNotificationInfo.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewNotificationInfo
	},
	data() {
		return {
			...config,
			props: {
				...config.props,
				type: 'info'
			},
			component: 'preview-notification-info',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
