<script>
import Example from '@/docs/Example.vue';
import PreviewTooltip from './previews/PreviewTooltip.vue';
import fileContent from '!raw-loader!./previews/PreviewTooltip.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewTooltip
	},
	data() {
		return {
			...config,
			component: 'preview-tooltip',
			props: config.props,
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
