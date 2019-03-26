<script>
import Example from '@/docs/Example.vue';
import PreviewAdjacentPages from './previews/PreviewAdjacentPages.vue';
import fileContent from '!raw-loader!./previews/PreviewAdjacentPages.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewAdjacentPages
	},
	data() {
		return {
			...config,
			props: {
				...config.props,
				showAdjacentPages: 2
			},
			component: 'preview-adjacent-pages',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
