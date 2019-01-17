import listPanelConfig from '@/docs/components/ListPanel/config';

export let props = {...listPanelConfig.props};

export let data = {
	...listPanelConfig.data,
	inputName: 'exampleInputName',
	inputType: 'checkbox',
	selected: [],
	showSelectAll: false,
	initializeAllSelected: false,
	i18n: {
		title: 'Select List Panel'
	}
};

export const propDocs = [...listPanelConfig.propDocs];

export const dataDocs = [
	...listPanelConfig.dataDocs,
	{
		key: 'inputName',
		description:
			'Name of the input field for selection: `<input name="inputName">`'
	},
	{
		key: 'inputType',
		description:
			'Type of input field. Supports `checkbox` or `radio`. Default: `checkbox`.'
	},
	{
		key: 'selected',
		description: 'Array of selected item ids.'
	},
	{
		key: 'showSelectAll',
		description: 'Add a checkbox to select all items.'
	},
	{
		key: 'initializeAllSelected',
		description: 'Select all items when the component is created.'
	}
];

export default {
	props,
	data,
	propDocs,
	dataDocs
};
