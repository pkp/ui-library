<script>
import Example from '@/docs/Example.vue';
import PreviewFilterSliderMultirange from './previews/PreviewFilterSliderMultirange.vue';
import fileContent from '!raw-loader!./previews/PreviewFilterSliderMultirange.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewFilterSliderMultirange
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
			component: 'preview-filter-slider-multirange',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
