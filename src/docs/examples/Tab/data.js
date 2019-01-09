import ViewTab from './ViewTab.vue';
import NestedTabs from './NestedTabs.vue';
import NestedTabsRaw from '!!raw-loader!./NestedTabs.vue';
import NestedSideTabs from './NestedSideTabs.vue';
import NestedSideTabsRaw from '!!raw-loader!./NestedSideTabs.vue';
import NestedTabsForm from './NestedTabsForm.vue';
import NestedTabsFormRaw from '!!raw-loader!./NestedTabsForm.vue';
import NestedSideTabsForm from './NestedSideTabsForm.vue';
import NestedSideTabsFormRaw from '!!raw-loader!./NestedSideTabsForm.vue';

export default {
	viewComponent: ViewTab,
	baseComponent: ViewTab,
	dataDesc: {
	},
	propDescription: {
	},
	examples: {
		'nested-tabs': {
			label: 'Nested Tabs',
			component: NestedTabs,
			componentRaw: NestedTabsRaw,
		},
		'nested-side-tabs': {
			label: 'Nested Tabs (Side)',
			component: NestedSideTabs,
			componentRaw: NestedSideTabsRaw,
		},
		'nested-tabs-form': {
			label: 'Nested Tabs (Form)',
			component: NestedTabsForm,
			componentRaw: NestedTabsFormRaw,
		},
		'nested-side-tabs-form': {
			label: 'Nested Tabs (Side + Form)',
			component: NestedSideTabsForm,
			componentRaw: NestedSideTabsFormRaw,
		},
	},
};
