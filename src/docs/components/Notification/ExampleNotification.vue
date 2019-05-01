<script>
import Example from '@/docs/Example.vue';
import PreviewNotification from './previews/PreviewNotification.vue';
import fileContent from '!raw-loader!./previews/PreviewNotification.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewNotification
	},
	data() {
		return {
			...config,
			component: 'preview-notification',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
