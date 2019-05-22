<script>
import Example from '@/docs/Example.vue';
import PreviewStatsContainer from './previews/PreviewStatsContainer.vue';
import fileContent from '!raw-loader!./previews/PreviewStatsContainer.vue';

export default {
	extends: Example,
	components: {
		PreviewStatsContainer
	},
	data() {
		return {
			component: 'preview-stats-container',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
