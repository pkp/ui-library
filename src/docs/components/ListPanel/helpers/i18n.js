export const count = {
	itemsOfTotal: '{$count} of {$total} items',
	itemCount: '{$count} items'
};

export const loadMore = {
	loadMore: 'Load more',
	loading: 'Loading'
};

export const search = {
	search: 'Search',
	clearSearch: 'Clear search phrase'
};

export const notice = {
	notice:
		'Example notice which can be used to display additional information on using the control.'
};

export const expandable = {
	viewMore: 'Show more details about {$name}',
	viewLess: 'Hide expanded details about {$name}'
};

export const orderable = {
	orderItems: 'Order',
	saveItemOrder: 'Save Order',
	cancel: 'Cancel',
	orderUp: 'Increase position of {$itemTitle}',
	orderDown: 'Decrease position of {$itemTitle}'
};

export const filter = {
	filter: 'Filter',
	filterRemove: 'Clear filter: {$filterTitle}'
};

export const submissionsListPanel = {
	add: 'New Submission',
	incomplete: 'Incomplete',
	delete: 'Delete',
	infoCenter: 'Activity Log & Notes',
	yes: 'Yes',
	no: 'No',
	deleting: 'Deleting',
	currentStage: 'Currently in the {$stage} stage.',
	confirmDelete: 'Delete submission?',
	responseDue: 'Response due',
	reviewDue: 'Review due',
	viewSubmission: 'View Submission',
	reviewsCompleted: 'Assigned reviews completed',
	revisionsSubmitted: 'Revisions submitted',
	copyeditsSubmitted: 'Copyedited files submitted',
	filesPrepared: 'Files prepared',
	discussions: 'Open discussions',
	assignEditor: 'Assign Editor',
	galleysCreated: 'Production galleys created',
	dualWorkflowLinks:
		'You have been assigned multiple roles for this submission. Would you like to access the <a href="{$urlAuthorWorkflow}">Author\'s workflow</a>  or the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?',
	reviewerWorkflowLink:
		'You have been assigned an editorial role for this submission. Would you like to access the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?'
};

export const catalogSubmissionsListPanel = {
	add: 'Add Entry',
	featured: 'Featured',
	newRelease: 'New Release',
	featuredCategory: 'Featured in category',
	featuredSeries: 'Feeatured in series',
	newreleaseSeries: 'New release in series',
	catalogEntry: 'Catalog Entry',
	editCatalogEntry: 'Entry',
	saving: 'Saving',
	orderFeatures: 'Order Features',
	orderingFeatures:
		'Drag-and-drop or tap the up and down buttons to change the order of features on the homepage.',
	orderingFeaturesSection:
		'Drag-and-drop or tap the up and down buttons to change the order of features in {$title}.',
	saveFeatureOrder: 'Save Order'
};

export default {
	count,
	loadMore,
	search,
	notice,
	expandable,
	orderable,
	filter,
	submissionsListPanel,
	catalogSubmissionsListPanel
};
