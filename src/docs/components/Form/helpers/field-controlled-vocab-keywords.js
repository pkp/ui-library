export default {
	name: 'keywords',
	component: 'field-controlled-vocab',
	label: 'Keywords',
	description:
		'Keywords are typically one- to three-word phrases that are used to indicate the main topics of a submission.',
	value: [],
	apiUrl: 'controlled-vocab.json',
	deselectLabel: 'Remove {$item}',
	noneLabel: 'None',
	selectedLabel: 'Selected',
};
