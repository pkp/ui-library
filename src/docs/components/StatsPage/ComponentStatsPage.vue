<script>
import Component from '@/docs/Component.vue';
import PreviewStatsEditorialPage from './previews/PreviewStatsEditorialPage.vue';
import PreviewStatsEditorialPageTemplate from './previews/PreviewStatsEditorialPage.vue?raw';
import PreviewStatsPublicationsPage from './previews/PreviewStatsPublicationsPage.vue';
import PreviewStatsPublicationsPageTemplate from './previews/PreviewStatsPublicationsPage.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewStatsEditorialPageTemplate),
				},
				{
					component: PreviewStatsPublicationsPage,
					name: 'Publication Stats',
					template: this.extractTemplate(PreviewStatsPublicationsPageTemplate),
				},
			],
		};
	},
};
</script>
