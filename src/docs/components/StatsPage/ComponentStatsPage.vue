<script>
import Component from '@/docs/Component.vue';
import PreviewStatsEditorialPage from './previews/PreviewStatsEditorialPage.vue';
import PreviewStatsEditorialPageTemplate from '!raw-loader!./previews/PreviewStatsEditorialPage.vue';
import PreviewStatsPublicationsPage from './previews/PreviewStatsPublicationsPage.vue';
import PreviewStatsPublicationsPageTemplate from '!raw-loader!./previews/PreviewStatsPublicationsPage.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'StatsPage',
			readme: readme,
			examples: [
				{
					component: PreviewStatsEditorialPage,
					name: 'Editorial Stats',
					template: this.extractTemplate(PreviewStatsEditorialPageTemplate)
				},
				{
					component: PreviewStatsPublicationsPage,
					name: 'Publication Stats',
					template: this.extractTemplate(PreviewStatsPublicationsPageTemplate)
				}
			]
		};
	}
};
</script>
