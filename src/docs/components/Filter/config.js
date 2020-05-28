export let props = {
	isFilterActive: false,
	param: 'stageIds',
	title: 'Submission',
	value: 1,
	i18n: {
		filterRemove: 'Clear filter: {$filterTitle}'
	}
};

export const propDocs = [
	{
		key: 'isFilterActive',
		description: 'Whether or not this is filter is currently on or off.'
	},
	{
		key: 'param',
		description:
			'The query parameter to use when submitting API requests for this filter. For example, a filter for getting all submissions in a particular stage would be `stageIds`.'
	},
	{
		key: 'title',
		description: 'The label for this filter.'
	},
	{
		key: 'value',
		description:
			'The value to use when submitting API requests for this filter. For example, a filter for getting all submissions currently in the Submission stage would have a `param` of `stageIds` and a `value` of `1`.'
	},
	{
		key: 'i18n',
		description: ''
	}
];

export const emitDocs = [
	{
		key: 'add-filter',
		description:
			'When the filter should be added to the list of active filters.',
		value: ['stageIds', 1]
	},
	{
		key: 'remove-filter',
		description:
			'When the filter should be removed from the list of active filters.',
		value: ['stageIds', 1]
	}
];

export const propSliderDocs = [
	{
		key: 'lessThanLabel',
		description:
			'An accessible label for the maximum range input in a multirange slider. Recommended: `Less than`.'
	},
	{
		key: 'max',
		description: 'The highest allowed value in the slider.'
	},
	{
		key: 'min',
		description: 'The lowest allowed value in the slider.'
	},
	{
		key: 'moreThanLabel',
		description:
			'An accessible label for the minimum range input in a multirange slider. Recommended: `More than`.'
	},
	{
		key: 'useStars',
		description:
			'Whether or not to replace the current value bubble with a star rating.'
	},
	{
		key: 'valueLabel',
		description:
			'A label for the current value bubble, such as `{$value} or less`. Default: `{$value}`.'
	}
];

export const emitSliderDocs = [
	{
		key: 'update-filter',
		description:
			'This event is only emitted by the <code>FilterSlider</code> and <code>FilterSliderMultirange</code> components when the value is updated.',
		value: ['stageIds', 1]
	}
];

export default {
	props,
	propDocs,
	emitDocs,
	propSliderDocs,
	emitSliderDocs
};
