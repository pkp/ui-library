import categories from '../../../data/categories';

export default {
	name: 'categories',
	component: 'field-options',
	label: 'Categories',
	description:
		'Select only the categories that are appropriate for your submission.',
	value: [],
	options: Object.keys(categories).map((id) => {
		return {
			value: id,
			label: categories[id],
		};
	}),
	groupId: 'default',
};
