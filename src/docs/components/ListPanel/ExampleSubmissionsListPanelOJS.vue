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
				sectionIds: {
					heading: 'Sections',
					filters: [
						{
							title: 'Articles',
							param: 'sectionIds',
							val: '1'
						},
						{
							title: 'Reviews',
							param: 'sectionIds',
							val: '2'
						}
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
