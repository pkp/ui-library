import ListPanelData from '../ListPanel/data.js';

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
	implementations: {},
};
