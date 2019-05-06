export let props = {
	currentPage: 1,
	lastPage: 10,
	showAdjacentPages: 1,
	i18n: {
		goToLabel: 'Go to {$page}',
		nextPageLabel: 'Next page',
		pageLabel: 'Page {$pageNumber}',
		paginationLabel: '{$start}-{$end} of {$total}',
		previousPageLabel: 'Previous page'
	}
};

export const propDocs = [
	{
		key: 'currentPage',
		description: 'The page that is currently being displayed.'
	},
	{
		key: 'lastPage',
		description: 'The last page that is available.'
	},
	{
		key: 'showAdjacentPages',
		description:
			'How many pages to show beside the current one. Default is <code>1</code>.'
	},
	{
		key: 'i18n',
		description: ''
	}
];

export const emitDocs = [
	{
		key: 'set-page',
		description: 'The page that should be selected.',
		value: 1
	}
];

export default {
	props,
	propDocs,
	emitDocs
};
