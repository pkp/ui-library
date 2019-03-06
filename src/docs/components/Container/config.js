export let props = {};

export let data = {
	components: []
};

export const propDocs = [];

export const dataDocs = [
	{
		key: 'components',
		description:
			'A key/value object with all the nested component data to be managed by this container. Components can update their data by emitting a `set` event. See the description below.'
	}
];

export default {
	props,
	data,
	propDocs,
	dataDocs
};
