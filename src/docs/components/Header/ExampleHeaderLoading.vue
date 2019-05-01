<script>
import Example from '@/docs/Example.vue';
import PreviewHeaderLoading from './previews/PreviewHeaderLoading.vue';
import fileContent from '!raw-loader!./previews/PreviewHeaderLoading.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHeaderLoading
	},
	data() {
		return {
			...config,
			props: {
				...config.props,
				showAdjacentPages: 2
			},
			component: 'preview-header-loading',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
