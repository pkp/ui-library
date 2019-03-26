<script>
import Example from '@/docs/Example.vue';
import PreviewSpinner from './previews/PreviewSpinner.vue';
import fileContent from '!raw-loader!./previews/PreviewSpinner.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewSpinner
	},
	data() {
		return {
			...config,
			component: 'preview-spinner',
			props: config.props,
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
