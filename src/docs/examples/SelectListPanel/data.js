import ListPanelData from '@/docs/examples/ListPanel/data.js';
import SelectListPanelRaw from '!!raw-loader!@/components/SelectListPanel/SelectListPanel.vue';
import WithRadio from './WithRadio.vue';
import WithSelectAll from './WithSelectAll.vue';
import SelectSubmissionsListPanel from './implementations/ExampleSelectSubmissionsListPanel.vue';
import SelectSubmissionsListPanelRaw from '!!raw-loader!@/components/SelectListPanel/submissions/SelectSubmissionsListPanel.vue';

export default {
	baseData: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ExampleSelectListPanel',
			inputName: 'exampleInputName',
			inputType: 'checkbox',
			selected: [],
			showSelectAll: false,
			initializeAllSelected: false,
			i18n: {
				title: 'Example Select List Panel',
			},
		});
	},
	dataDesc: Object.assign(ListPanelData.dataDesc, {
		inputName: 'Name of the input field for selection: `<input name="inputName">`',
		inputType: 'Type of input field. Supports `checkbox` or `radio`. Default: `checkbox`.',
		selected: 'Array of selected item ids.',
		showSelectAll: 'Add a checkbox to select all items in the collection.',
		initializeAllSelected: 'Select all items when the component is created.',
	}),
	examples: {
		'with-radio': {
			label: 'with Radio Buttons',
			component: WithRadio,
			componentRaw: SelectListPanelRaw,
		},
		'with-select-all': {
			label: 'with Select All',
			component: WithSelectAll,
			componentRaw: SelectListPanelRaw,
		},
	},
	implementations: {
		'SelectSubmissionsListPanel': {
			label: 'SelectSubmissionsListPanel',
			component: SelectSubmissionsListPanel,
			componentRaw: SelectSubmissionsListPanelRaw,
		},
	},
};
