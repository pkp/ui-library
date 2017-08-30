import ListPanelData from '../ListPanel/data.js';
import SelectSubmissionsListPanel from './implementations/ExampleSelectSubmissionsListPanel.vue';
import SelectSubmissionsListPanelRaw from '!!raw-loader!./../../../components/SelectListPanel/submissions/SelectSubmissionsListPanel.vue';

export default {
	baseData: function () {
		return Object.assign(ListPanelData.baseData(), {
			id: 'ExampleSelectListPanel',
			inputName: 'exampleInputName',
			inputType: 'checkbox',
			i18n: {
				title: 'Example Select List Panel',
			},
		});
	},
	dataDesc: Object.assign(ListPanelData.dataDesc, {
		inputName: 'Name of the input field for selection: `<input name="inputName">`',
		inputType: 'Type of input field. Supports `checkbox` or `radio`. Default: `checkbox`.',
	}),
	examples: {},
	implementations: {
		'SelectSubmissionsListPanel': {
			label: 'SelectSubmissionsListPanel',
			component: SelectSubmissionsListPanel,
			componentRaw: SelectSubmissionsListPanelRaw,
		},
	},
};
