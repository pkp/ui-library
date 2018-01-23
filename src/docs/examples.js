import ViewBadge from './examples/Badge/ViewBadge.vue';
import BadgeRaw from '!!raw-loader!@/components/Badge/Badge.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelRaw from '!!raw-loader!@/components/ListPanel/ListPanel.vue';
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import SelectListPanelRaw from '!!raw-loader!@/components/SelectListPanel/SelectListPanel.vue';

export default {
	Badge: {
		component: ViewBadge,
		componentRaw: BadgeRaw,
		label: 'Badge',
		url: '/components/Badge',
	},
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
