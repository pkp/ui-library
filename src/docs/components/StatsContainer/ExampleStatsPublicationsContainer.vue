<script>
import Example from '@/docs/Example.vue';
import PreviewStatsPublicationsContainer from './previews/PreviewStatsPublicationsContainer.vue';
import fileContent from '!raw-loader!./previews/PreviewStatsPublicationsContainer.vue';

export default {
	extends: Example,
	components: {
		PreviewStatsPublicationsContainer
	},
	data() {
		return {
			component: 'preview-stats-publications-container',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
