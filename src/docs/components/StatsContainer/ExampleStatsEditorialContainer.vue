<script>
import Example from '@/docs/Example.vue';
import PreviewStatsEditorialContainer from './previews/PreviewStatsEditorialContainer.vue';
import fileContent from '!raw-loader!./previews/PreviewStatsEditorialContainer.vue';

export default {
	extends: Example,
	components: {
		PreviewStatsEditorialContainer
	},
	data() {
		return {
			component: 'preview-stats-editorial-container',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
