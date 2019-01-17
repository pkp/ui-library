<script>
import Example from '@/docs/Example.vue';
import PreviewDraggable from './previews/PreviewDraggable.vue';
import fileContent from '!raw-loader!./previews/PreviewDraggable.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewDraggable
	},
	data() {
		return {
			...config,
			component: 'preview-draggable',
			props: config.props,
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
