<script>
import Example from '@/docs/Example.vue';
import PreviewHeaderLegend from './previews/PreviewHeaderLegend.vue';
import fileContent from '!raw-loader!./previews/PreviewHeaderLegend.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHeaderLegend
	},
	data() {
		return {
			...config,
			component: 'preview-header-legend',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
