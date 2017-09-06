import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelRaw from '!!raw-loader!@/components/ListPanel/ListPanel.vue';
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import SelectListPanelRaw from '!!raw-loader!@/components/SelectListPanel/SelectListPanel.vue';

export default {
	ListPanel: {
		component: ListPanel,
		componentRaw: ListPanelRaw,
		label: 'ListPanel',
		url: '/components/ListPanel',
	},
	SelectListPanel: {
		component: SelectListPanel,
		componentRaw: SelectListPanelRaw,
		label: 'SelectListPanel',
		url: '/components/SelectListPanel',
	},
};
