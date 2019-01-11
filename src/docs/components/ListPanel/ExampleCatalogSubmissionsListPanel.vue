<script>
import Example from '@/docs/Example.vue';
import BaseListPanel from '@/components/ListPanel/submissions/CatalogSubmissionsListPanel.vue';
import fileContent from '!raw-loader!@/components/ListPanel/submissions/CatalogSubmissionsListPanel.vue';
import config from './config';

const ListPanel = {
	...BaseListPanel,
	data() {
		return {
			...config.data,
			...config.dataCatalogSubmissionsListPanel
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
			dataDocs: [
				...config.dataDocs,
				...config.dataDocsCatalogSubmissionsListPanel
			],
			title: 'ListPanel',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
