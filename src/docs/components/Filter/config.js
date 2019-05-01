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

export const propsSlider = {
	formatter: '{value} or more',
	isVisible: true,
	max: 25,
	min: 1,
	starLabel: '',
	useStars: false
};

export const propSliderDocs = [
	{
		key: 'formatter',
		description:
			'Format how the value is displayed in the tooltip. See [vue-slider-component docs](https://github.com/NightCatSama/vue-slider-component/tree/v2#props).'
	},
	{
		key: 'isVisible',
		description:
			'Use this prop when the filter is shown or hidden, to ensure that the slider is properly resized when it comes into view.'
	},
	{
		key: 'max',
		description:
			'The highest allowed value in the slider. See [vue-slider-component docs](https://github.com/NightCatSama/vue-slider-component/tree/v2#props).'
	},
	{
		key: 'min',
		description:
			'The lowest allowed value in the slider. See [vue-slider-component docs](https://github.com/NightCatSama/vue-slider-component/tree/v2#props).'
	},
	{
		key: 'starLabel',
		description:
			'A label to use when the slider tooltip shows a star rating. This should usually be something like "Reviewer rating: {rating}".'
	},
	{
		key: 'useStars',
		description:
			'Whether or not to replace the slider tooltip with a star rating.'
	}
];

export const emitSliderDocs = [
	{
		key: 'update-filter',
		description:
			'This event is only emitted by <code>FilterSlider</code> components when the value is updated.',
		value: ['stageIds', 1]
	}
];

export default {
	props,
	propDocs,
	emitDocs,
	propsSlider,
	propSliderDocs,
	emitSliderDocs
};
