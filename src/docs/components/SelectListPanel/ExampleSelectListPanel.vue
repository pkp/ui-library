<script>
import Example from '@/docs/Example.vue';
import BaseSelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import fileContent from '!raw-loader!@/components/SelectListPanel/SelectListPanel.vue';
import config from './config';
import items from '@/docs/components/ListPanel/helpers/items';

const SelectListPanel = {
	...BaseSelectListPanel,
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
		SelectListPanel
	},
	data() {
		return {
			...config,
			component: 'select-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
