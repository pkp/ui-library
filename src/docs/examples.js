import ViewBadge from './examples/Badge/ViewBadge.vue';
import BadgeRaw from '!!raw-loader!@/components/Badge/Badge.vue';
import ViewButton from './examples/Button/ViewButton.vue';
import ButtonRaw from '!!raw-loader!@/components/Button/Button.vue';
import ViewIcon from './examples/Icon/ViewIcon.vue';
import IconRaw from '!!raw-loader!@/components/Icon/Icon.vue';
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
	Button: {
		component: ViewButton,
		componentRaw: ButtonRaw,
		label: 'Button',
		url: '/components/Button',
	},
	Icon: {
		component: ViewIcon,
		componentRaw: IconRaw,
		label: 'Icon',
		url: '/components/Icon',
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
