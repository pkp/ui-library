export let props = {
	defaultTab: '',
	isSideTabs: false,
	label: ''
};

export const propDocs = [
	{
		key: 'defaultTab',
		description: "Select one of the tabs by default. Pass the tab's `id` prop."
	},
	{
		key: 'isSideTabs',
		description:
			'Displays the tabs on the side with content on the right when `true`.'
	},
	{
		key: 'label',
		description:
			'Sets an `aria-label` for the tabs. See the [Accessible label](#accessible-label) section below.'
	}
];

export default {
	props,
	propDocs
};
