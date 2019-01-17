export default {
	name: 'options-orderable',
	component: 'field-options',
	label: 'Sidebar',
	description: 'Select which sidebar blocks to display and change their order.',
	type: 'checkbox',
	isOrderable: true,
	value: ['languagetoggleblockplugin', 'developedbyblockplugin'],
	options: [
		{
			value: 'informationblockplugin',
			label: 'Information Block'
		},
		{
			value: 'languagetoggleblockplugin',
			label: 'Language Toggle Block'
		},
		{
			value: 'developedbyblockplugin',
			label: '"Developed By" Block'
		}
	]
};
