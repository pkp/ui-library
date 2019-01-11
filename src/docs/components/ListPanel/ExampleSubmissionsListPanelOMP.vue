<script>
import Example from '@/docs/Example.vue';
import BaseListPanel from '@/components/ListPanel/submissions/SubmissionsListPanel.vue';
import fileContent from '!raw-loader!@/components/ListPanel/submissions/SubmissionsListPanel.vue';
import config from './config';

const ListPanel = {
	...BaseListPanel,
	data() {
		return {
			...config.data,
			...config.dataSubmissionsListPanel,
			filters: {
				...config.dataSubmissionsListPanel.filters,
				stageIds: {
					heading: config.dataSubmissionsListPanel.filters.stageIds.heading,
					filters: [
						config.dataSubmissionsListPanel.filters.stageIds.filters[0],
						{
							title: 'Internal Review',
							param: 'stageIds',
							val: 2
						},
						{
							...config.dataSubmissionsListPanel.filters.stageIds.filters[1],
							title: 'External Review'
						},
						config.dataSubmissionsListPanel.filters.stageIds.filters[2],
						config.dataSubmissionsListPanel.filters.stageIds.filters[3]
					]
				}
			}
		};
	}
};

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		return {
			...config,
			dataDocs: [...config.dataDocs, ...config.dataDocsSubmissionsListPanel],
			title: 'ListPanel',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
