export const pagination = {
	paginationLabel: 'View additional pages',
	goToLabel: 'Go to {$page}',
	pageLabel: 'Page {$pageNumber}',
	nextPageLabel: 'Next page',
	previousPageLabel: 'Previous page'
};

export const search = {
	search: 'Search',
	clearSearch: 'Clear search phrase'
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
	filter: 'Filters',
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

export const catalogListPanel = {
	add: 'Add Entry',
	featured: 'Featured',
	newRelease: 'New Release',
	featuredCategory: 'Featured in category',
	featuredSeries: 'Featured in series',
	newReleaseCategory: 'New release in category',
	newReleaseSeries: 'New release in series',
	catalogEntry: 'Catalog Entry',
	editCatalogEntry: 'Entry',
	saving: 'Saving',
	orderFeatures: 'Order Features',
	orderingFeatures:
		'Drag-and-drop or tap the up and down buttons to change the order of features on the homepage.',
	orderingFeaturesSection:
		'Drag-and-drop or tap the up and down buttons to change the order of features in {$title}.',
	saveFeatureOrder: 'Save Order',
	isFeatured: 'This monograph is featured. Make this monograph not featured.',
	isNotFeatured:
		'This monograph is not featured. Make this monograph featured.',
	isNewRelease:
		'This monograph is a new release. Make this monograph not a new release.',
	isNotNewRelease:
		'This monograph is not a new release. Make this monograph a new release.',
	viewSubmission: 'View Submission'
};

export const selectSubmissionsListPanel = {
	listSeparator: ', ',
	viewSubmission: 'View Submission'
};

export const selectReviewerListPanel = {
	filterRating: 'Rated at least',
	activeReviews: '{$count} active',
	activeReviewsDescription: 'Active reviews currently assigned',
	completedReviews: 'Reviews completed',
	declinedReviews: 'Reviews declined',
	cancelledReviews: 'Reviews cancelled',
	empty: 'No reviewers found',
	reviewerRating: 'Reviewer rating: {$rating}',
	daysSinceLastAssignment: '{$days} days ago',
	daySinceLastAssignment: 'Yesterday',
	daysSinceLastAssignmentDescription: 'Days since last review assigned',
	averageCompletion: 'Average days to complete review',
	neverAssigned: 'Never assigned',
	currentlyAssigned:
		'This reviewer has already been assigned to review this submission.',
	warnOnAssign:
		"This reviewer is locked because they have been assigned a role which allows them to view the author's identity. Blind peer review can not be guaranteed. Would you like to unlock this reviewer anyway?",
	warnOnAssignUnlock: 'Unlock',
	reviewInterests: 'Reviewing Interests',
	gossip: 'Editorial Notes',
	biography: 'Biography',
	listSeparator: ', ',
	viewMore: 'Show more details about {$name}',
	viewLess: 'Hide expanded details about {$name}'
};

export const emailTemplatesListPanel = {
	add: 'Add Template',
	cancel: 'Cancel',
	delete: 'Delete',
	deleteConfirm: 'Are you sure you want to delete this email template?',
	disable: 'Disable',
	disabled: 'Disabled',
	edit: 'Edit',
	editTemplate: 'Edit Email',
	enable: 'Enable',
	from: 'From: {$value}',
	ok: 'Ok',
	reset: 'Reset',
	resetAll: 'Reset All',
	resetAllConfirm:
		'If you reset all templates, all modifications to the email templates will be lost.  Do you want to confirm this operation?',
	resetConfirm:
		'Are you sure you want to reset this email template to its default values?',
	subjectLabel: 'Subject: {$subject}',
	to: 'To: {$value}'
};

export default {
	pagination,
	search,
	expandable,
	orderable,
	filter,
	submissionsListPanel,
	catalogListPanel,
	selectSubmissionsListPanel,
	selectReviewerListPanel,
	emailTemplatesListPanel
};
