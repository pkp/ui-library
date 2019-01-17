export let props = {
	icon: 'bug',
	inline: false
};

export const propDocs = [
	{
		key: 'icon',
		description:
			'Which <a href="https://fontawesome.com/">FontAwesome</a> icon to use. Drop the `fa-` prefix from the class name. If you want to use `fa-bug`, the value of this prop should be `bug`.'
	},
	{
		key: 'inline',
		description:
			'Use when an icon sits alongside text to ensure adequate spacing between the icon and text.'
	}
];

export default {
	props,
	propDocs
};
