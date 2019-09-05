<script>
import Example from '@/docs/Example.vue';
import PreviewIcon from './previews/PreviewIcon.vue';
import fileContent from '!raw-loader!./previews/PreviewIcon.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewIcon
	},
	data() {
		return {
			...config,
			component: 'preview-icon',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
