export let props = {
	searchPhrase: '',
	searchLabel: 'Search',
	clearSearchLabel: 'Clear search'
};

export const propDocs = [
	{
		key: 'searchPhrase',
		description: 'The current search phrase.'
	},
	{
		key: 'searchLabel',
		description:
			'The label for the search input field. Usually `Search`, but could be `Search submissions`, `Search issues`, etc.'
	},
	{
		key: 'clearSearchLabel',
		description:
			'A label for the button to clear the search input field. Usually `Clear search`.'
	}
];

export const emitDocs = [
	{
		key: 'search-phrase-changed',
		description:
			'This event will be emitted when the search phrase changes. The event is debounced so that it will only be emitted when the user stops typing for 250ms.',
		value: 'The new search phrase'
	}
];

export default {
	props,
	propDocs,
	emitDocs
};
