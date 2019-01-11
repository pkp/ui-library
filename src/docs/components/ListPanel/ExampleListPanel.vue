<script>
import Example from '@/docs/Example.vue';
import BaseListPanel from '@/components/ListPanel/ListPanel.vue';
import fileContent from '!raw-loader!@/components/ListPanel/ListPanel.vue';
import config from './config';
import items from './helpers/items';

const ListPanel = {
	...BaseListPanel,
	data() {
		return {
			...config.data,
			items: items
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
			title: 'ListPanel',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
