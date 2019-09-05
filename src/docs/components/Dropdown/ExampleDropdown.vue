<script>
import Example from '@/docs/Example.vue';
import PreviewDropdown from './previews/PreviewDropdown.vue';
import fileContent from '!raw-loader!./previews/PreviewDropdown.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewDropdown
	},
	data() {
		return {
			...config,
			component: 'preview-dropdown',
			props: config.props,
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
