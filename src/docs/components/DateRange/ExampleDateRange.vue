<script>
import Example from '@/docs/Example.vue';
import PreviewDateRange from './previews/PreviewDateRange.vue';
import fileContent from '!raw-loader!./previews/PreviewDateRange.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewDateRange
	},
	data() {
		return {
			...config,
			component: 'preview-date-range',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
