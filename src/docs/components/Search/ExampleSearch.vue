<script>
import Example from '@/docs/Example.vue';
import PreviewSearch from './previews/PreviewSearch.vue';
import fileContent from '!raw-loader!./previews/PreviewSearch.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewSearch
	},
	data() {
		return {
			...config,
			component: 'preview-search',
			props: config.props,
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
