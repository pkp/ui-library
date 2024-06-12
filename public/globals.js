/**
 * Set up the globals that originate from the main application (OJS/OMP) and
 * are not part of the UI Library's responsibilities
 */
window.pkp = {
	/**
	 * Event bus. This will be a Vue instance but must be registered in main.js
	 * where Vue can be imported
	 */
	eventBus: null,

	/**
	 * The current logged-in user
	 */
	currentUser: {
		csrfToken: '1234',
		id: 20,
		roles: [1, 16, 65536, 1048576],
		username: 'dbarnes',
		preferredName: 'Daniel Barnes',
	},

	/**
	 *
	 *
	 */
	context: {
		apiBaseUrl: 'https://mock/index.php/publicknowledge/api/v1/',
		pageBaseUrl: 'https://mock/index.php/publicknowledge/',
	},
	/**
	 * Dummy constants required by components
	 */
	const: {
		ASSOC_TYPE_PRESS: 512,
		ASSOC_TYPE_CATEGORY: 525,
		ASSOC_TYPE_SECTION: 530,
		ASSOC_TYPE_SERIES: 530, // OMP - always matches ASSOC_TYPE_SECTION
		REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE: 0,
		REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE: 4,
		REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE: 6,
		REVIEW_ASSIGNMENT_STATUS_ACCEPTED: 5,
		REVIEW_ASSIGNMENT_STATUS_RECEIVED: 7,
		REVIEW_ASSIGNMENT_STATUS_COMPLETE: 8,
		REVIEW_ASSIGNMENT_STATUS_THANKED: 9,
		REVIEW_ASSIGNMENT_STATUS_CANCELLED: 10,
		REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND: 11,
		REVIEW_ROUND_STATUS_PENDING_REVIEWERS: 6,
		REVIEW_ROUND_STATUS_REVIEWS_READY: 8,
		REVIEW_ROUND_STATUS_REVIEWS_COMPLETED: 9,
		REVIEW_ROUND_STATUS_REVIEWS_OVERDUE: 10,
		REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED: 11,
		REVIEW_ROUND_STATUS_REVISIONS_REQUESTED: 1,
		SUBMISSION_REVIEW_METHOD_ANONYMOUS: 1,
		SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS: 2,
		SUBMISSION_REVIEW_METHOD_OPEN: 3,

		SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT: 1,
		SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS: 2,
		SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE: 3,
		SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_ELSEWHERE: 4,
		SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE: 5,
		SUBMISSION_REVIEWER_RECOMMENDATION_SEE_COMMENTS: 6,

		ROLE_ID_MANAGER: 16,
		ROLE_ID_SITE_ADMIN: 1,
		ROLE_ID_AUTHOR: 65536,
		ROLE_ID_REVIEWER: 4096,
		ROLE_ID_ASSISTANT: 4097,
		ROLE_ID_READER: 1048576,
		ROLE_ID_SUB_EDITOR: 17,
		ROLE_ID_SUBSCRIPTION_MANAGER: 2097152,
		STAGE_STATUS_SUBMISSION_UNASSIGNED: 1,
		STATUS_QUEUED: 1,
		STATUS_PUBLISHED: 3,
		STATUS_DECLINED: 4,
		STATUS_SCHEDULED: 5,
		WORKFLOW_STAGE_ID_SUBMISSION: 1,
		WORKFLOW_STAGE_ID_INTERNAL_REVIEW: 2,
		WORKFLOW_STAGE_ID_EXTERNAL_REVIEW: 3,
		WORKFLOW_STAGE_ID_EDITING: 4,
		WORKFLOW_STAGE_ID_PRODUCTION: 5,
		DOI_STATUS_UNREGISTERED: 1,
		DOI_STATUS_SUBMITTED: 2,
		DOI_STATUS_REGISTERED: 3,
		DOI_STATUS_ERROR: 4,
		DOI_STATUS_STALE: 5,
	},

	/**
	 * Icon map for document types
	 */
	documentTypeIcons: {
		default: 'file-o', // DOCUMENT_TYPE_DEFAULT
		audio: 'file-audio-o', // DOCUMENT_TYPE_AUDIO
		epub: 'file-text-o', // DOCUMENT_TYPE_EPUB
		excel: 'file-excel-o', // DOCUMENT_TYPE_EXCEL
		html: 'file-code-o', // DOCUMENT_TYPE_HTML
		image: 'file-image-o', // DOCUMENT_TYPE_IMAGE
		pdf: 'file-pdf-o', // DOCUMENT_TYPE_PDF
		word: 'file-word-o', // DOCUMENT_TYPE_WORD
		video: 'file-video-o', // DOCUMENT_TYPE_VIDEO
		zip: 'file-archive-o', // DOCUMENT_TYPE_ZIP
	},

	/**
	 * Locale keys loaded on the server-side
	 */
	localeKeys: {
		'article.article': 'Article',
		'common.attachFiles': 'Attach Files',
		'common.cancel': 'Cancel',
		'common.clearSearch': 'Clear search phrase',
		'common.close': 'Close',
		'common.commaListSeparator': ', ',
		'common.delete': 'Delete',
		'common.description': 'Description',
		'common.download': 'Download',
		'common.edit': 'Edit',
		'common.editItem': 'Edit {$name}',
		'common.error': 'Error',
		'common.filter': 'Filters',
		'common.filterAdd': 'Add filter: {$filterTitle}',
		'common.filterRemove': 'Clear filter: {$filterTitle}',
		'common.filtersClear': 'Clear Filters',
		'common.inParenthesis': '({$text})',
		'common.insertContent': 'Insert Content',
		'common.lastActivity': 'Last activity recorded on {$date}.',
		'common.loaded': 'Loaded',
		'common.loading': 'Loading',
		'common.no': 'No',
		'common.noItemsFound': 'No items found.',
		'common.none': 'None',
		'common.ok': 'OK',
		'common.order': 'Order',
		'common.orderDown': 'Decrease position of {$itemTitle}',
		'common.orderUp': 'Increase position of {$itemTitle}',
		'common.pageNumber': 'Page {$pageNumber}',
		'common.pagination.goToPage': 'Go to {$page}',
		'common.pagination.label': 'View additional pages',
		'common.pagination.next': 'Next',
		'common.pagination.previous': 'Previous',
		'common.remove': 'Remove',
		'common.required': 'Required',
		'common.reviewRoundNumber': 'Round {$round}',
		'common.save': 'Save',
		'common.saving': 'Saving',
		'common.search': 'Search',
		'common.selectAll': 'Select All',
		'common.selectNone': 'Select None',
		'common.selectWithName': 'Select {$name}',
		'common.showingXofX':
			'Showing <strong>{$start} to {$finish}</strong> of {$total}',
		'common.status': 'Status',
		'common.type': 'Type',
		'common.unknownError':
			'An unexpected error has occurred. Please reload the page and try again.',
		'common.upload': 'Upload',
		'common.uploadedBy': 'Uploaded by {$name}',
		'common.uploadedByAndWhen': 'Uploaded by {$name} on {$date}',
		'common.view': 'View',
		'common.viewWithName': 'View {$name}',
		'common.yes': 'Yes',
		'doi.manager.versions.countStatement': 'There are {$count} versions.',
		'doi.manager.versions.modalTitle': 'DOIs for all versions',
		'doi.manager.versions.view': 'View all',
		'editor.submission.search':
			'Search submissions, ID, authors, keywords, etc.',
		'editor.submission.viewSummary': 'Summary',
		'editor.submissionArchive.confirmDelete':
			'Are you sure you want to permanently delete this submission?',
		'form.dataHasChanged':
			'The data on this form has changed. Do you wish to continue without saving?',
		'form.errorA11y': 'Go to {$fieldLabel}: {$errorMessage}',
		'form.errorGoTo': 'Jump to next error',
		'form.errorMany': 'Please correct {$count} errors.',
		'form.errorOne': 'Please correct one error.',
		'form.errors':
			'The form was not saved because {$count} error(s) were encountered. Please correct these errors and try again.',
		'form.multilingualLabel': '{$label} in {$localeName}',
		'form.multilingualProgress': '{$count}/{$total} languages completed',
		'form.saved': 'Saved',
		'grid.action.sort': 'Sort',
		'help.help': 'Help',
		'issue.issue': 'Issue',
		'list.collapseAll': 'Collapse all',
		'list.expandAll': 'Expand all',
		'list.viewLess': 'Hide expanded details about {$name}',
		'list.viewMore': 'Show more details about {$name}',
		'manager.dois.actions.assign.label': 'Assign DOIs',
		'manager.dois.actions.assign.prompt':
			'You are about to assign new DOIs to {$count} item(s) for any eligible item that does not already have a DOI assigned. Are you sure you want to assign DOIs to these items?',
		'manager.dois.actions.bulkActions': 'Bulk Actions',
		'manager.dois.actions.deposit.all': 'Deposit All',
		'manager.dois.actions.deposit.label': 'Deposit DOIs',
		'manager.dois.actions.deposit.prompt':
			'You are about to send DOI metadata records for {$count} item(s) to {$registrationAgency}. Are you sure you want to deposit these records?',
		'manager.dois.actions.depositAll.label': 'Deposit all DOIs',
		'manager.dois.actions.depositAll.prompt':
			"You are about to schedule all outstanding DOI metadata records to be deposited with {$registrationAgency}. Only published items with a DOI will be deposited. Each item's status will be updated when a response is received. Are you sure you want to schedule deposits for all of these items?",
		'manager.dois.actions.description':
			'Take action on {$count} selected item(s).',
		'manager.dois.actions.export.label': 'Export DOIs',
		'manager.dois.actions.export.prompt':
			'You are about to export DOI metadata records for {$count} item(s) for {$registrationAgency}. Are you sure you want to export these records?',
		'manager.dois.actions.markRegistered.label': 'Mark DOIs Registered',
		'manager.dois.actions.markRegistered.prompt':
			'You are about to mark DOI metadata records for {$count} item(s) as registered. Are you sure you want to mark these records as registered?',
		'manager.dois.actions.markStale.label': 'Mark DOIs Needs Sync',
		'manager.dois.actions.markStale.prompt':
			'You are about to mark DOI metadata records for {$count} item(s) as needing to be synced. The Needs Sync status can only be applied to previously submitted DOIs. Are you sure you want to mark these records as stale?',
		'manager.dois.actions.markUnregistered.label': 'Mark DOIs Unregistered',
		'manager.dois.actions.markUnregistered.prompt':
			'You are about to mark DOI metadata records for {$count} item(s) as unregistered. Are you sure you want to mark these records as unregistered?',
		'manager.dois.filters.doiAssigned': 'DOI Assigned',
		'manager.dois.filters.doiAssigned.description': 'All items assigned a DOI.',
		'manager.dois.help.statuses.title': 'DOI Statuses',
		'manager.dois.notification.assignDoisSuccess':
			'Items successfully assigned new DOIs',
		'manager.dois.notification.depositQueuedSuccess':
			'Items successfully submitted for deposit',
		'manager.dois.notification.exportSuccess': 'Items successfully exported',
		'manager.dois.notification.markRegisteredSuccess':
			'Items successfully marked registered',
		'manager.dois.notification.markStaleSuccess':
			'Items successfully marked needs sync',
		'manager.dois.notification.markUnregisteredSuccess':
			'Items successfully marked unregistered',
		'manager.dois.registration.depositDois': 'Deposit DOI(s)',
		'manager.dois.registration.manuallyMarkedRegistered':
			'This item has been manually registered with a registration agency.',
		'manager.dois.registration.notPublishedDescription':
			'This item cannot be deposited until it has been published.',
		'manager.dois.registration.notSubmittedDescription':
			'The metadata for this item has not been submitted to {$registrationAgency}.',
		'manager.dois.registration.submittedDescription':
			'The metadata for this item has been submitted to {$registrationAgency}.',
		'manager.dois.registration.viewError': 'View Error',
		'manager.dois.registration.viewError.title': 'Registration Error Message',
		'manager.dois.registration.viewRecord': 'View Record',
		'manager.dois.status.error': 'Error',
		'manager.dois.status.error.description':
			'All items that have encountered an error in the registration process.',
		'manager.dois.status.error.filterTitle': 'Has Error',
		'manager.dois.status.needsDoi': 'Needs DOI',
		'manager.dois.status.needsDoi.description': 'All items missing a DOI.',
		'manager.dois.status.registered': 'Registered',
		'manager.dois.status.registered.description':
			'All items that have been registered with a registration agency or manually marked as registered.',
		'manager.dois.status.stale': 'Needs Sync',
		'manager.dois.status.stale.description':
			'All items that have been republished since they were last deposited with a registration agency. They need to be resubmitted to the registration agency to update their metadata records.',
		'manager.dois.status.submitted': 'Submitted',
		'manager.dois.status.submitted.description':
			'All items that have been submitted to a registration agency.',
		'manager.dois.status.unregistered': 'Unregistered',
		'manager.dois.status.unregistered.description':
			'All items with a DOI that have been published but not yet deposited with a registration agency.',
		'manager.dois.title': 'DOIs',
		'manager.dois.update.failedCreation': 'DOI Updates Failed',
		'manager.dois.update.partialFailure': 'Some DOI(s) could not be updated',
		'manager.dois.update.success': 'DOI(s) successfully updated',
		'navigation.backTo': '\u27f5 Back to {$page}',
		'navigation.submissions': 'Submissions',
		'publication.jats.autoCreatedMessage':
			'This JATS file is generated automatically by the submission metadata',
		'publication.jats.confirmDeleteFileButton': 'Delete JATS File',
		'publication.jats.confirmDeleteFileMessage':
			'You are about to remove the existing JATS XML File from this publication. Are you sure?',
		'publication.jats.confirmDeleteFileTitle': 'Confirm deleting JATS XML',
		'publication.jats.lastModified':
			'Last Modification at {$modificationDate} by {$username}',
		'publication.status.published': 'Published',
		'publication.status.unpublished': 'Unpublished',
		'publication.version': 'Version {$version}',
		'reviewer.article.recommendation': 'Recommendation',
		'reviewer.submission.acceptedOn': 'Review Accepted On',
		'reviewer.submission.responseDueDate': 'Response Due Date',
		'reviewer.submission.reviewDueDate': 'Review Due Date',
		'reviewer.submission.reviewRequestDate': "Editor's Request",
		'reviewer.submission.reviewRound.attachments': 'Attachments',
		'reviewer.submission.reviewRound.attachments.description':
			'These are files that you attached along with your review',
		'reviewer.submission.reviewRound.comments': 'Reviewer Comments',
		'reviewer.submission.reviewRound.comments.authorAndEditor':
			'For editors and authors',
		'reviewer.submission.reviewRound.comments.editorOnly': 'For editors only',
		'reviewer.submission.reviewRound.comments.prefix': 'Comment {$index}: ',
		'reviewer.submission.reviewRound.emailLog': 'Decline reason sent by email',
		'reviewer.submission.reviewRound.emailLog.defaultMessage':
			'No reason given to the decline of the review invitation.',
		'reviewer.submission.reviewRound.reviewNotCompleted':
			'The review was not completed.',
		'reviewer.submission.reviewRound.files': 'Files For Review',
		'reviewer.submission.reviewRound.files.description':
			'These files were sent to you for review',
		'reviewer.submission.reviewRound.general': 'General Information',
		'reviewer.submission.reviewRound.info': 'Previous Reviews',
		'reviewer.submission.reviewRound.info.modal.title':
			'Round {$round} Review submitted by you for',
		'reviewer.submission.reviewRound.info.read': 'Read Round {$round} Review',
		'reviewer.submission.reviewRound.info.submittedOn':
			'Round {$round} Review Submitted on {$submittedOn}',
		'reviewer.submission.reviewRound.metadata': 'Article Metadata',
		'reviewer.submission.reviewRound.metadata.abstract': 'Abstract',
		'reviewer.submission.reviewRound.metadata.keywords': 'Keywords',
		'reviewer.submission.reviewRound.metadata.type': 'Type',
		'reviewer.submission.reviewRound.reviewDeclineDate': 'Declined Date',
		'reviewer.submission.submittedOn': 'Review Submitted On',
		'stats.countWithYearlyAverage': '{$count} ({$average}/year)',
		'stats.descriptionForStat': 'Description for {$stat}',
		'submission.list.assignEditor': 'Assign Editor',
		'submission.list.copyeditsSubmitted': 'Copyedited files submitted',
		'submission.list.currentStage': 'Currently in the {$stage} stage.',
		'submission.list.discussions': 'Open discussions',
		'submission.list.dualWorkflowLinks':
			'You have been assigned multiple roles for this submission. Would you like to access the <a href="{$urlAuthorWorkflow}">Author\'s workflow</a>  or the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?',
		'submission.list.empty': 'No submissions found.',
		'submission.list.galleysCreated': 'Production galleys created',
		'submission.list.infoCenter': 'Activity Log & Notes',
		'submission.list.responseDue': 'Response Due: {$date}',
		'submission.list.reviewAssignment': 'Review Assignment',
		'submission.list.reviewAssignment.action.cancelReviewer': 'Cancel Reviewer',
		'submission.list.reviewAssignment.action.editDueDate': 'Edit Due Date',
		'submission.list.reviewAssignment.action.resendReviewRequest':
			'Resend Review Request',
		'submission.list.reviewAssignment.action.unassignReviewer': 'Unassign',
		'submission.list.reviewAssignment.action.viewDetails': 'View details',
		'submission.list.reviewAssignment.action.viewRecommendation':
			'View recommendation',
		'submission.list.reviewAssignment.action.viewUnreadRecommendation':
			'View unread recommendation',
		'submission.list.reviewAssignment.statusAccepted.description':
			'This reviewer has accepted the review request. Their review is due in <b>{$days} days on {$date}.</b>',
		'submission.list.reviewAssignment.statusAccepted.title':
			'Ongoing review - request accepted',
		'submission.list.reviewAssignment.statusAwaitingResponse.description':
			'Review request has been shared with Reviewer. Response is awaited in <b>{$days} days on {$date}</b>',
		'submission.list.reviewAssignment.statusAwaitingResponse.title':
			'Awaiting Response from the Reviewer',
		'submission.list.reviewAssignment.statusCancelled.description':
			'Reviewer has cancelled the review request on <b>{$date}</b>',
		'submission.list.reviewAssignment.statusCancelled.title':
			'Reviewer cancelled review request',
		'submission.list.reviewAssignment.statusComplete.description':
			'The review was accepted by the editor on {$date}.</b>',
		'submission.list.reviewAssignment.statusComplete.title':
			'Review was confirmed by editor',
		'submission.list.reviewAssignment.statusDeclined.description':
			'Reviewer declined the review request on <b>{$date}</b>',
		'submission.list.reviewAssignment.statusDeclined.title':
			'Review Request declined on {$date}',
		'submission.list.reviewAssignment.statusReceived.description':
			'The review was completed on {$date} with the following recommendation: <b>{$recommendation}</b>',
		'submission.list.reviewAssignment.statusReceived.title':
			'Review completed on {$date}',
		'submission.list.reviewAssignment.statusRequestResend.description':
			'Review request has been reshared with reviewer. Response is awaited in {$days} days on {$date}',
		'submission.list.reviewAssignment.statusRequestResend.title':
			'Awaiting Response from the Reviewer',
		'submission.list.reviewAssignment.statusResponseOverdue.description':
			'This reviewer has not responded to the review request. A response was due on <b>{$date}</b>',
		'submission.list.reviewAssignment.statusResponseOverdue.title':
			'Review Request overdue by {$days} days',
		'submission.list.reviewAssignment.statusReviewOverdue.description':
			'This reviewer has not completed their review. A response was due on <b>{$date}.</b>',
		'submission.list.reviewAssignment.statusReviewOverdue.title':
			'Review overdue by {$days} days',
		'submission.list.reviewCancelled': 'Review Cancelled',
		'submission.list.reviewComplete': 'Review Submitted',
		'submission.list.reviewDue': 'Review Due: {$date}',
		'submission.list.reviewerWorkflowLink':
			'You have been assigned an editorial role for this submission. Would you like to access the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?',
		'submission.list.reviewsCompleted': 'Assigned reviews completed',
		'submission.list.revisionsSubmitted': 'Revisions submitted',
		'submission.round': 'Round&nbsp;{$round}',
		'submission.submit.newSubmissionSingle': 'New Submission',
		'submission.upload.percentComplete': 'Uploading {$percent}% complete',
		'submissions.incomplete': 'Incomplete',
		'validator.required': 'This field is required.',
		'invitation.notification.title': 'Invitation sent',
		'invitation.wizard.success': "{$email} has been invited to a new role in OJS. You can be updated about the user's decision on the User & Role page, your OJS notification and/or your email",
		'user.email': 'Email',
		'user.username': 'Username',
		'user.orcid': 'ORCID iD',
		'invitation.notification.closeBtn':'View all users',
		'user.password': 'Password',
		'invitation.role.selectRole':'Select a new role',
		'invitation.role.dateEnd' : 'End Date',
  		'invitation.role.dateStart' : 'Start Date',
  		'invitation.role.masthead' : 'Journal Masthead',
  		'invitation.role.removeRole.button' : 'Remove Role',
		'invitation.role.addRole.button':'Add Another Role',
		'invitation.orcid.message':'Add Another Role',

	},

	tinyMCE: {
		skinUrl: '/styles/tinymce',
	},
};

/**
 * Spoof some of the variables in the $.pkp object from the app
 */
window.$.pkp = {
	app: {
		currentLocale: 'en',
		primaryLocale: 'en',
		rtlLocales: ['ar'],
		tinyMceContentCSS: '/styles/content.css',
		tinyMceOneLineContentCSS: '/styles/content_oneline.css',
	},
	pkpHandler() {
		alert(
			'This action can not be completed in the UI library because it requires a legacy JS component that is part of the OJS, OMP or OPS application.',
		);
	},
	classes: {
		Helper: {
			// A fake uuid generator to mock the one in the Helper component of
			// OJS, OMP and OPS. This is not guaranteed to be unique and should
			// not be used in production
			uuid() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16);
			},
		},
	},
};
