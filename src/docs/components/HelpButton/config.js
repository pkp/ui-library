export let props = {
	topic: 'settings',
	section: 'workflow-library',
	label: 'Learn more about the Publisher Library'
};

export const propDocs = [
	{
		key: 'topic',
		description:
			'Which topic to open in the help panel. This will correspond with one of the `.md` files used in the help panel. Do not include the `.md` extension.'
	},
	{
		key: 'section',
		description:
			'Open the help panel to a particular section of the topic. This must match one of the named anchors in the topic page, such as `<a name="workflow-library"></a>`.'
	},
	{
		key: 'label',
		description:
			'A localized label for screen readers. In English this should be "Help".'
	}
];

export default {
	props,
	propDocs
};
