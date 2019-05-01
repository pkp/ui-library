<script>
import Example from '@/docs/Example.vue';
import PreviewFilterSlider from './previews/PreviewFilterSlider.vue';
import fileContent from '!raw-loader!./previews/PreviewFilterSlider.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewFilterSlider
	},
	data() {
		return {
			...config,
			props: {
				...config.props,
				...config.propsSlider
			},
			propDocs: [...config.propDocs, ...config.propSliderDocs],
			emitDocs: [...config.emitDocs, ...config.emitSliderDocs],
			component: 'preview-filter-slider',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
