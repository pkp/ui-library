<script>
import Example from '@/docs/Example.vue';
import PreviewHelpButton from './previews/PreviewHelpButton.vue';
import fileContent from '!raw-loader!./previews/PreviewHelpButton.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHelpButton
	},
	data() {
		return {
			...config,
			component: 'preview-help-button',
			props: config.props,
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
