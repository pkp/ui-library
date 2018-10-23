import ViewBadge from './examples/Badge/ViewBadge.vue';
import BadgeRaw from '!!raw-loader!@/components/Badge/Badge.vue';
import ViewButton from './examples/Button/ViewButton.vue';
import ButtonRaw from '!!raw-loader!@/components/Button/Button.vue';
import ViewForm from './examples/Form/ViewForm.vue';
import FormRaw from '!!raw-loader!@/components/Form/Form.vue';
import ViewHelpButton from './examples/HelpButton/ViewHelpButton.vue';
import HelpButtonRaw from '!!raw-loader!@/components/HelpButton/HelpButton.vue';
import ViewIcon from './examples/Icon/ViewIcon.vue';
import IconRaw from '!!raw-loader!@/components/Icon/Icon.vue';
import ViewList from './examples/List/ViewList.vue';
import ViewListRaw from '!!raw-loader!./examples/List/ViewList.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelRaw from '!!raw-loader!@/components/ListPanel/ListPanel.vue';
import ViewMultilingualProgress from './examples/MultilingualProgress/ViewMultilingualProgress.vue';
import MultilingualProgressRaw from '!!raw-loader!@/components/MultilingualProgress/MultilingualProgress.vue';
import ViewOrderer from './/examples/Orderer/ViewOrderer.vue';
import OrdererRaw from '!!raw-loader!@/components/Orderer/Orderer.vue';
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import SelectListPanelRaw from '!!raw-loader!@/components/SelectListPanel/SelectListPanel.vue';
import ViewTab from './examples/Tab/ViewTab.vue';
import TabRaw from '!!raw-loader!./examples/Tab/ViewTab.vue';
import ViewTooltip from './examples/Tooltip/ViewTooltip.vue';
import TooltipRaw from '!!raw-loader!@/components/Tooltip/Tooltip.vue';

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
	Form: {
		component: ViewForm,
		componentRaw: FormRaw,
		label: 'Form',
		url: '/components/Form',
	},
	HelpButton: {
		component: ViewHelpButton,
		componentRaw: HelpButtonRaw,
		label: 'HelpButton',
		url: '/components/HelpButton',
	},
	Icon: {
		component: ViewIcon,
		componentRaw: IconRaw,
		label: 'Icon',
		url: '/components/Icon',
	},
	List: {
		component: ViewList,
		componentRaw: ViewListRaw,
		label: 'List',
		url: '/components/List',
	},
	ListPanel: {
		component: ListPanel,
		componentRaw: ListPanelRaw,
		label: 'ListPanel',
		url: '/components/ListPanel',
	},
	MultilingualProgress: {
		component: ViewMultilingualProgress,
		componentRaw: MultilingualProgressRaw,
		label: 'MultilingualProgress',
		url: '/components/MultilingualProgress',
	},
	Orderer: {
		component: ViewOrderer,
		componentRaw: OrdererRaw,
		label: 'Orderer',
		url: '/components/Orderer',
	},
	SelectListPanel: {
		component: SelectListPanel,
		componentRaw: SelectListPanelRaw,
		label: 'SelectListPanel',
		url: '/components/SelectListPanel',
	},
	Tab: {
		component: ViewTab,
		componentRaw: TabRaw,
		label: 'Tab',
		url: '/components/Tab',
	},
	Tooltip: {
		component: ViewTooltip,
		componentRaw: TooltipRaw,
		label: 'Tooltip',
		url: '/components/Tooltip',
	},
};
