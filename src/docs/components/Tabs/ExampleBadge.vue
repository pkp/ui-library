<script>
import Example from '@/docs/Example.vue';
import PreviewBadge from './previews/PreviewBadge.vue';
import fileContent from '!raw-loader!./previews/PreviewBadge.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewBadge
	},
	data() {
		return {
			...config,
			component: 'preview-badge',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
