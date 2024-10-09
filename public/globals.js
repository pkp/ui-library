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
		REVIEW_ASSIGNMENT_STATUS_DECLINED: 1,
		REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE: 4,
		REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE: 6,
		REVIEW_ASSIGNMENT_STATUS_ACCEPTED: 5,
		REVIEW_ASSIGNMENT_STATUS_RECEIVED: 7,
		REVIEW_ASSIGNMENT_STATUS_COMPLETE: 8,
		REVIEW_ASSIGNMENT_STATUS_THANKED: 9,
		REVIEW_ASSIGNMENT_STATUS_CANCELLED: 10,
		REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND: 11,
		REVIEW_ROUND_STATUS_REVISIONS_REQUESTED: 1,
		REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW: 2,
		REVIEW_ROUND_STATUS_SENT_TO_EXTERNAL: 3,
		REVIEW_ROUND_STATUS_ACCEPTED: 4,
		REVIEW_ROUND_STATUS_DECLINED: 5,
		REVIEW_ROUND_STATUS_PENDING_REVIEWERS: 6,
		REVIEW_ROUND_STATUS_PENDING_REVIEWS: 7,
		REVIEW_ROUND_STATUS_REVIEWS_READY: 8,
		REVIEW_ROUND_STATUS_REVIEWS_COMPLETED: 9,
		REVIEW_ROUND_STATUS_REVIEWS_OVERDUE: 10,
		REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED: 11,
		REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS: 12,
		REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY: 13,
		REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED: 14,
		REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED: 15,
		REVIEW_ROUND_STATUS_RETURNED_TO_REVIEW: 16,

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
		default: 'DefaultDocument', // DOCUMENT_TYPE_DEFAULT
		audio: 'FileAudio', // DOCUMENT_TYPE_AUDIO
		epub: 'FileEpub', // DOCUMENT_TYPE_EPUB
		excel: 'FileExcel', // DOCUMENT_TYPE_EXCEL
		html: 'FileHtml', // DOCUMENT_TYPE_HTML
		image: 'FileImage', // DOCUMENT_TYPE_IMAGE
		pdf: 'FilePdf', // DOCUMENT_TYPE_PDF
		word: 'FileDoc', // DOCUMENT_TYPE_WORD
		video: 'FileVideo', // DOCUMENT_TYPE_VIDEO
		zip: 'file-FileZip-o', // DOCUMENT_TYPE_ZIP
	},

	/**
	 * Locale keys loaded on the server-side
	 */
	localeKeys: {
		'admin.jobs.failed.action.redispatch': 'Try Again',
		'admin.jobs.failed.action.redispatch.all': 'Requeue All Failed Jobs',
		'article.article': 'Article',
		'article.metadata': 'Metadata',
		'author.users.contributor.principalContact': 'Primary Contact',
		'author.users.contributor.setPrincipalContact': 'Set Primary Contact',
		'common.addCCBCC': 'Add CC/BCC',
		'common.assign': 'Assign',
		'common.attachFiles': 'Attach Files',
		'common.attachedFiles': 'Attached Files',
		'common.back': 'Back',
		'common.cancel': 'Cancel',
		'common.clearSearch': 'Clear search phrase',
		'common.close': 'Close',
		'common.commaListSeparator': ', ',
		'common.confirmDelete':
			'Are you sure you wish to delete this item? This action cannot be undone.',
		'common.content': 'Content',
		'common.dateUploaded': 'Date uploaded',
		'common.default': 'Default',
		'common.delete': 'Delete',
		'common.description': 'Description',
		'common.deselect': 'Deselect',
		'common.details': 'Details',
		'common.download': 'Download',
		'common.edit': 'Edit',
		'common.editItem': 'Edit {$name}',
		'common.emailTemplates': 'Email Templates',
		'common.error': 'Error',
		'common.fileName': 'File Name',
		'common.filter': 'Filters',
		'common.filterAdd': 'Add filter: {$filterTitle}',
		'common.filterRemove': 'Clear filter: {$filterTitle}',
		'common.filtersClear': 'Clear Filters',
		'common.findTemplate': 'Find Template',
		'common.geographic': 'Geographic',
		'common.id': 'ID',
		'common.insert': 'Insert',
		'common.insertContent': 'Insert Content',
		'common.insertContentSearch': 'Find content to insert',
		'common.language': 'Language',
		'common.lastActivity': 'Last activity recorded on {$date}.',
		'common.loaded': 'Loaded',
		'common.loading': 'Loading',
		'common.moreActions': 'More Actions',
		'common.name': 'Name',
		'common.no': 'No',
		'common.noItemsFound': 'No items found.',
		'common.none': 'None',
		'common.numberedMore': '{$number} more',
		'common.ok': 'OK',
		'common.order': 'Order',
		'common.orderDown': 'Decrease position of {$itemTitle}',
		'common.orderUp': 'Increase position of {$itemTitle}',
		'common.pageNumber': 'Page {$pageNumber}',
		'common.pagination.goToPage': 'Go to {$page}',
		'common.pagination.label': 'View additional pages',
		'common.pagination.next': 'Next',
		'common.pagination.previous': 'Previous',
		'common.payments': 'Payments',
		'common.publications': 'Articles',
		'common.remove': 'Remove',
		'common.removeItem': 'Remove {$item}',
		'common.required': 'Required',
		'common.reset': 'Reset',
		'common.save': 'Save',
		'common.saving': 'Saving',
		'common.search': 'Search',
		'common.searchPhrase': 'Search Phrase',
		'common.searching': 'Searching',
		'common.selectAll': 'Select All',
		'common.selectNone': 'Select None',
		'common.selectWithName': 'Select {$name}',
		'common.showingSteps': '{$current}/{$total} steps',
		'common.showingXofX':
			'Showing <strong>{$start} to {$finish}</strong> of {$total}',
		'common.status': 'Status',
		'common.switchTo': 'Switch to',
		'common.switchToNamedItem': 'Switch to {$name}',
		'common.type': 'Type',
		'common.unknownError':
			'An unexpected error has occurred. Please reload the page and try again.',
		'common.upload': 'Upload',
		'common.uploadedBy': 'Uploaded by {$name}',
		'common.uploadedByAndWhen': 'Uploaded by {$name} on {$date}',
		'common.view': 'View',
		'common.viewWithName': 'View {$name}',
		'common.yes': 'Yes',
		'context.context': 'Journal',
		'contributor.listPanel.preview': 'Preview',
		'contributor.listPanel.preview.abbreviated': 'Abbreviated',
		'contributor.listPanel.preview.description':
			'Contributors to this publication will be identified in the following formats.',
		'contributor.listPanel.preview.display': 'Display',
		'contributor.listPanel.preview.format': 'Format',
		'contributor.listPanel.preview.full': 'Full',
		'contributor.listPanel.preview.publicationLists': 'Publication Lists',
		'dashboard.acceptOrDeclineRequestDate':
			'Please accept or decline this request {$date}',
		'dashboard.applyFilters': 'Apply Filters',
		'dashboard.assignEditor': 'Assign Editor',
		'dashboard.assignReviewers': 'Assign Reviewers',
		'dashboard.clearFilters': 'Clear Filters',
		'dashboard.completeReviewByDate': 'Please complete this review by {$date}.',
		'dashboard.dashboards': 'Dashboards',
		'dashboard.deadlineForCompletingReviewHasPassed':
			'Deadline for completing this review has passed. Please complete the review at the earliest.',
		'dashboard.deadlineForRespondingAcceptOrDecline':
			'Deadline for responding to this request has passed. Please accept or decline this request at the earliest.',
		'dashboard.declinedDuringStage': 'Declined during the {$stageName} stage',
		'dashboard.mySubmissions': 'My Submissions',
		'dashboard.newReviewRoundToBeCreated': 'New review round to be created',
		'dashboard.recommendOnly.pendingRecommendations':
			'Recommending Editors are tasked to advise the next steps for this submission',
		'dashboard.recommendOnly.recommendationsCompleted':
			'All editorial recommendations have been received, and a decision is required.',
		'dashboard.recommendOnly.recommendationsReady':
			'An editorial recommendation has been received',
		'dashboard.reviewAssignment.action.cancelReviewer': 'Cancel Reviewer',
		'dashboard.reviewAssignment.action.editDueDate': 'Edit Due Date',
		'dashboard.reviewAssignment.action.resendReviewRequest':
			'Resend Review Request',
		'dashboard.reviewAssignment.action.unassignReviewer': 'Unassign',
		'dashboard.reviewAssignment.action.viewDetails': 'View details',
		'dashboard.reviewAssignment.action.viewRecommendation':
			'View recommendation',
		'dashboard.reviewAssignment.action.viewUnreadRecommendation':
			'View unread recommendation',
		'dashboard.reviewAssignment.statusAccepted.description':
			'This reviewer has accepted the review request. Their review is due in <b>{$days} days on {$date}.</b>',
		'dashboard.reviewAssignment.statusAccepted.title':
			'Ongoing review - request accepted',
		'dashboard.reviewAssignment.statusAwaitingResponse.description':
			'Review request has been shared with reviewer. Awaiting response in <b>{$days} days on {$date}</b>',
		'dashboard.reviewAssignment.statusAwaitingResponse.title':
			'Awaiting Response from the reviewer',
		'dashboard.reviewAssignment.statusCancelled.description':
			'Reviewer has cancelled the review request on <b>{$date}</b>',
		'dashboard.reviewAssignment.statusCancelled.title':
			'Reviewer cancelled review request',
		'dashboard.reviewAssignment.statusComplete.description':
			'The review was accepted by the editor on {$date}.</b>',
		'dashboard.reviewAssignment.statusComplete.title':
			'Review was confirmed by editor',
		'dashboard.reviewAssignment.statusDeclined.description':
			'Reviewer declined the review request on <b>{$date}</b>',
		'dashboard.reviewAssignment.statusDeclined.title':
			'Review Request declined on {$date}',
		'dashboard.reviewAssignment.statusReceived.description':
			'The review was completed on {$date} with the following recommendation: <b>{$recommendation}</b>',
		'dashboard.reviewAssignment.statusReceived.title':
			'Review completed on {$date}',
		'dashboard.reviewAssignment.statusRequestResend.description':
			'Review request has been reshared with reviewer. Awaiting response in {$days} days on {$date}',
		'dashboard.reviewAssignment.statusRequestResend.title':
			'Awaiting Response from the reviewer',
		'dashboard.reviewAssignment.statusResponseOverdue.description':
			'This reviewer has not responded to the review request. A response was due on <b>{$date}</b>',
		'dashboard.reviewAssignment.statusResponseOverdue.title':
			'Review Request overdue by {$days} days',
		'dashboard.reviewAssignment.statusReviewOverdue.description':
			'This reviewer has not completed their review. A response was due on <b>{$date}.</b>',
		'dashboard.reviewAssignment.statusReviewOverdue.title':
			'Review overdue by {$days} days',
		'dashboard.reviewAssignments': 'Review Assignments',
		'dashboard.reviewUpdateCounts':
			'Review update {$reviewsCompletedCount}/{$reviewsTotalCount}',
		'dashboard.reviewersAssigned': 'Reviewers assigned',
		'dashboard.revisionRequested': 'Revision requested',
		'dashboard.revisionRequestedFromAuthor': 'Revisions requested from author',
		'dashboard.revisionsRequestedFromAuthorNextRound':
			'Revisions requested from the author to be taken to a new review round',
		'dashboard.revisionsSubmitted': 'Revisions submitted',
		'dashboard.stage.copyediting': 'Copyediting',
		'dashboard.stage.production': 'Production',
		'dashboard.stage.published': 'Published',
		'dashboard.stage.review': 'Review',
		'dashboard.stage.reviewWithRound': 'Review (Round {$round})',
		'dashboard.stage.scheduledForPublication': 'Scheduled For Publication',
		'dashboard.stage.submission': 'Submission',
		'dashboard.startNewSubmission': 'Start A New Submission',
		'dashboard.submitRevisions': 'Submit revisions',
		'dashboard.summary.acceptAndSkipReview': 'Accept and skip review',
		'dashboard.summary.acceptSubmission': 'Accept Submission',
		'dashboard.summary.assignToIssue': 'Assign To Issue',
		'dashboard.summary.backToCopyediting': 'Back to Copyediting',
		'dashboard.summary.cancelCopyEditing': 'Cancel Copyediting',
		'dashboard.summary.cancelReviewRound': 'Cancel Review Round',
		'dashboard.summary.copyeditedFiles': 'Copyedited Files',
		'dashboard.summary.copyeditedFilesDescription':
			'These are edited files that will be taken to the production stage',
		'dashboard.summary.declineSubmission': 'Decline Submission',
		'dashboard.summary.deskReviewFiles': 'Desk Review Files',
		'dashboard.summary.deskReviewFilesDescription':
			'These are the files that will be taken forward to the review stage in the workflow.',
		'dashboard.summary.draftFiles': 'Draft Files',
		'dashboard.summary.draftFilesDescription':
			'These are files from the review stage which are to be copyedited',
		'dashboard.summary.filesForReview': 'Files for review',
		'dashboard.summary.issueNo': 'Issue No',
		'dashboard.summary.notAssigned': 'Not assigned',
		'dashboard.summary.preview': 'Preview',
		'dashboard.summary.productionReadyFiles': 'Production Ready Files',
		'dashboard.summary.productionReadyFilesDescription':
			'These are the files that will be sent for publication',
		'dashboard.summary.requestRevisions': 'Request Revisions',
		'dashboard.summary.reviewer': 'Reviewer',
		'dashboard.summary.reviewerStatus': 'Reviewer status',
		'dashboard.summary.reviewers': 'Reviewers',
		'dashboard.summary.revisionsUploaded': 'Revisions Submitted',
		'dashboard.summary.revisionsUploadedDescription':
			'These files have been submitted by the author after revisions were requested',
		'dashboard.summary.sendSubmissionForReview': 'Send submission for review',
		'dashboard.summary.sendToProduction': 'Send to Production',
		'doi.manager.versions.countStatement': 'There are {$count} versions.',
		'doi.manager.versions.modalTitle': 'DOIs for all versions',
		'doi.manager.versions.view': 'View all',
		'editor.activityLog': 'Activity Log',
		'editor.review.cancelReviewer': 'Cancel Reviewer',
		'editor.review.emailReviewer': 'Email Reviewer',
		'editor.review.notInitiated':
			'The review process has not yet been initiated.',
		'editor.review.readReview': 'Read Review',
		'editor.review.reinstateReviewer': 'Reinstate Reviewer',
		'editor.review.reminder': 'Review Reminder',
		'editor.review.resendRequestReviewer': 'Resend Review Request',
		'editor.review.revertDecision': 'Revert Decision',
		'editor.review.reviewDetails': 'Review Details',
		'editor.review.sendReminder': 'Send Reminder',
		'editor.review.thankReviewer': 'Thank Reviewer',
		'editor.review.unassignReviewer': 'Unassign Reviewer',
		'editor.review.unconsiderReview': 'Unconsider this Review',
		'editor.review.unconsiderReviewText':
			'Do you wish to mark this review as unconsidered?  The review history will be preserved.',
		'editor.submission.addReviewer': 'Add Reviewer',
		'editor.submission.addStageParticipant': 'Assign Participant',
		'editor.submission.createNewRound': 'Create New Review Round',
		'editor.submission.decision.requestRevisions': 'Request Revisions',
		'editor.submission.editStageParticipant': 'Edit Assignment',
		'editor.submission.recommend.accept': 'Recommend Accept',
		'editor.submission.recommend.decline': 'Recommend Decline',
		'editor.submission.recommend.revisions': 'Recommend Revisions',
		'editor.submission.recommendation': 'Recommendation',
		'editor.submission.removeStageParticipant': 'Remove Participant',
		'editor.submission.removeStageParticipant.description':
			'You are about to remove this participant from <strong>all</strong> stages.',
		'editor.submission.review.currentFiles':
			'Current Review Files For Round {$round}',
		'editor.submission.revisions': 'Revisions',
		'editor.submission.schedulePublication': 'Schedule For Publication',
		'editor.submission.search':
			'Search submissions, ID, authors, keywords, etc.',
		'editor.submission.stageParticipants': 'Participants',
		'editor.submission.uploadSelectFiles': 'Upload/Select Files',
		'editor.submission.workflowDecision.changeDecision': 'Change decision',
		'editor.submission.workflowDecision.submission.production':
			'Sent to production.',
		'editor.submission.workflowDecision.submission.published':
			'Submission published.',
		'editor.submission.workflowDecision.submission.reviewRound':
			'Sent for a new round of reviews.',
		'editor.submission.workflowDecision.submission.underReview':
			'Submission accepted for review.',
		'editor.submissionArchive.confirmDelete':
			'Are you sure you want to permanently delete this submission?',
		'editor.submissionLibrary': 'Library',
		'editor.submissionReview.editReview': 'Edit Review',
		'editor.submissionReview.uploadFile': 'Upload Review File',
		'email.bcc': 'BCC',
		'email.cc': 'CC',
		'email.confirmSwitchLocale':
			'Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost.',
		'email.email': 'Email',
		'email.subject': 'Subject',
		'email.to': 'To',
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
		'grid.action.addContributor': 'Add Contributor',
		'grid.action.addGalley': 'Add galley',
		'grid.action.delete': 'Delete',
		'grid.action.deleteContributor': 'Delete Contributor',
		'grid.action.deleteContributor.confirmationMessage':
			'Are you sure you want to remove {$name} as a contributor? This action can not be undone.',
		'grid.action.disable': 'Disable User',
		'grid.action.edit': 'Edit',
		'grid.action.editFile': 'Edit a file',
		'grid.action.logInAs': 'Login As',
		'grid.action.moreInformation': 'More Information',
		'grid.action.order': 'Order',
		'grid.action.remove': 'Remove',
		'grid.action.saveOrdering': 'Save Order',
		'grid.action.sort': 'Sort',
		'grid.columns.actions': 'Actions',
		'grid.libraryFiles.submission.title': 'Submission Library',
		'grid.noItems': 'No Items',
		'grid.user.confirmLogInAs':
			'Log in as this user? All actions you perform will be attributed to this user.',
		'grid.user.currentUsers':'Current Users',
		'grid.action.mergeUser':'Merge User',
		'help.help': 'Help',
		'informationCenter.informationCenter': 'Information Center',
		'invitation.role.addRole.button': 'Add Another Role',
		'invitation.role.dateStart': 'Start Date',
		'invitation.role.masthead': 'Journal Masthead',
		'invitation.role.removeRole.button':
			'Remove Role',
		'invitation.role.selectRole': 'Select a new role',
		'invitation.wizard.completeSteps': '##invitation.wizard.completeSteps##',
		'invitation.wizard.errors': '##invitation.wizard.errors##',
		'issue.issue': 'Issue',
		'issue.issues': 'Issues',
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
		'manager.dois.registration.viewRecord.title':
			'Successful Registration Message',
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
		'manager.emails.addEmail': 'Add Template',
		'manager.export.usersToCsv.label': 'Export to Excel/CSV',
		'manager.mailables.addTemplates':
			'Add and edit templates that you would like to make available to the user when they are sending this email. The default will be loaded automatically, and the user will be able to quickly load any other templates you add here.',
		'manager.mailables.editTemplate': 'Edit Template',
		'manager.mailables.templates': 'Templates',
		'manager.publication.reviewStage': 'Review',
		'manager.workflow': 'Workflow',
		'navigation.backTo': '\u27f5 Back to {$page}',
		'notification.type.roundStatusTitle': 'Round {$round} Status',
		'orcid.field.authorEmailModal.message':
			'Would you like to send an email to this author requesting they verify their ORCID?',
		'orcid.field.authorEmailModal.title': 'Request ORCID verification',
		'orcid.field.deleteOrcidModal.message':
			'Are you sure you want to remove this ORCID?',
		'orcid.field.deleteOrcidModal.title': 'Delete ORCID',
		'orcid.field.unverified.shouldRequest':
			'This ORCID has not been verified. Please remove this unverified ORCID and request verification from the user/author directly.',
		'orcid.field.verification.request': 'Request verification',
		'orcid.field.verification.requested': 'Verification requested!',
		'publication.contributors': 'Contributors',
		'publication.createVersion': 'Create New Version',
		'publication.editDisabled':
			'This version has been published and can not be edited.',
		'publication.jats': 'JATS XML',
		'publication.jats.autoCreatedMessage':
			'This JATS file is generated automatically by the submission metadata',
		'publication.jats.confirmDeleteFileButton': 'Delete JATS File',
		'publication.jats.confirmDeleteFileMessage':
			'You are about to remove the existing JATS XML File from this publication. Are you sure?',
		'publication.jats.confirmDeleteFileTitle': 'Confirm deleting JATS XML',
		'publication.jats.lastModified':
			'Last Modification at {$modificationDate} by {$username}',
		'publication.publicationLicense': 'Permissions & Disclosure',
		'publication.selectIssue': 'Select an issue to schedule for publication',
		'publication.status.published': 'Published',
		'publication.status.scheduled': 'Scheduled',
		'publication.status.unpublished': 'Unpublished',
		'publication.status.unscheduled': 'Unscheduled',
		'publication.titleAbstract': 'Title & Abstract',
		'publication.unpublish': 'Unpublish',
		'publication.unpublish.confirm':
			"Are you sure you don't want this to be published?",
		'publication.unschedule': 'Unschedule',
		'publication.unschedule.confirm':
			"Are you sure you don't want this scheduled for publication?",
		'publication.version': 'Version {$version}',
		'publication.version.confirm':
			'Are you sure you want to create a new version?',
		'reviewer.article.decision.accept': 'Accept Submission',
		'reviewer.article.decision.decline': 'Decline Submission',
		'reviewer.article.decision.pendingRevisions': 'Revisions Required',
		'reviewer.article.decision.resubmitElsewhere': 'Resubmit Elsewhere',
		'reviewer.article.decision.resubmitHere': 'Resubmit for Review',
		'reviewer.article.decision.seeComments': 'See Comments',
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
		'reviewer.submission.reviewRound.reviewNotCompleted':
			'The review was not completed.',
		'reviewer.submission.submittedOn': 'Review Submitted On',
		'search.searchResults': 'Search Results',
		semicolon: '{$label}:',
		'stageParticipants.notify.message': 'Message',
		'stats.context.downloadReport.description':
			'Download a CSV/Excel spreadsheet with usage statistics for this journal matching the following parameters.',
		'stats.context.downloadReport.downloadContext': 'Download Journal',
		'stats.context.downloadReport.downloadContext.description':
			"The number of journal's index page views.",
		'stats.countWithYearlyAverage': '{$count} ({$average}/year)',
		'stats.dateRange': 'Date Range',
		'stats.descriptionForStat': 'Description for {$stat}',
		'stats.geographic.ccAttribution':
			"Geolocation provided by <a href='https://db-ip.com'>DB-IP</a>",
		'stats.geographic.tooltip.label': 'About Geolocation',
		'stats.issues.downloadReport.description':
			'Download a CSV/Excel spreadsheet with usage statistics for issues matching the following parameters.',
		'stats.issues.downloadReport.downloadIssues': 'Download Issues',
		'stats.issues.downloadReport.downloadIssues.description':
			'The number of TOC views and issue galley downloads for each issue.',
		'stats.publications.downloadReport.description':
			'Download a CSV/Excel spreadsheet with usage statistics for articles matching the following parameters.',
		'stats.publications.downloadReport.downloadFiles': 'Download Files',
		'stats.publications.downloadReport.downloadFiles.description':
			'The number of downloads for each file.',
		'stats.publications.downloadReport.downloadGeographic':
			'Download Geographic',
		'stats.publications.downloadReport.downloadGeographic.description':
			'The number of views and downloads for each city, region or country.',
		'stats.publications.downloadReport.downloadSubmissions':
			'Download Articles',
		'stats.publications.downloadReport.downloadSubmissions.description':
			'The number of abstract views and file downloads for each article.',
		'stats.timeline': 'Timeline',
		'stats.timeline.downloadReport.downloadTimeline': 'Download Timeline',
		'submission.changeFile': 'Change File',
		'submission.citations': 'References',
		'submission.contributors': 'List of Contributors',
		'submission.files': 'Files',
		'submission.files.downloadAll': 'Download All Files',
		'submission.history': 'History',
		'submission.identifiers': 'Identifiers',
		'submission.layout.galleys': 'Galleys',
		'submission.layout.newGalley': 'Create New Galley',
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
		'submission.list.reviewCancelled': 'Review Cancelled',
		'submission.list.reviewComplete': 'Review Submitted',
		'submission.list.reviewDue': 'Review Due: {$date}',
		'submission.list.reviewerWorkflowLink':
			'You have been assigned an editorial role for this submission. Would you like to access the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?',
		'submission.list.reviewsCompleted': 'Assigned reviews completed',
		'submission.list.revisionsSubmitted': 'Revisions submitted',
		'submission.publication': 'Publication',
		'submission.review': 'Review',
		'submission.stageParticipants.notify': 'Notify',
		'submission.submit.newSubmissionSingle': 'New Submission',
		'submission.submit.uploadSubmissionFile': 'Upload Submission File',
		'submission.upload.percentComplete': 'Uploading {$percent}% complete',
		'submission.upload.productionReady': 'Upload a Production Ready File',
		'submission.upload.proof': 'Upload a File Ready for Publication',
		'submission.versions': 'Versions',
		'submission.wizard.changeSubmission': 'Change Submission Settings',
		'submissions.declined': 'Declined',
		'submissions.incomplete': 'Incomplete',
		todo: '##todo##',
		'about.contact.email': 'Email',
		'user.email': 'Email Address',
		'user.affiliation': 'Affiliation',
		'user.familyName': 'Family Name',
		'user.givenName': 'Given Name',
		'user.gossip': 'Editorial Notes',
		'user.orcid': 'ORCID iD',
		'user.password': 'Password',
		'user.roles': 'Roles',
		'user.startDate': 'Start Date',
		'user.username': 'Username',
		'validator.required': 'This field is required.',
		'invitation.notification.closeBtn':'View all users',
		'invitation.orcid.acceptInvitation.message':'Not verified. You can verify your ORCID iD from your profile section in OJS',
		'userInvitation.emailField.description':'e.g. aeinstein@example.com',
		'userInvitation.usernameField.description':'e.g. mickeymouse',
		'userInvitation.orcidField.description':'e.g. 0000-0000-0000-0000',
		'userInvitation.roleTable.role':'Role',
		'userInvitation.roleTable.startDate':'Start Date',
		'userInvitation.roleTable.endDate':'End Date',
		'userInvitation.roleTable.journalMasthead':'Journal Masthead',
		'userInvitation.modal.title':'Invitation Sent',
		'userInvitation.modal.message':'{$email} has been invited to new role in OJS.You can be updated about users on the User and Roles page, your ojs notification and/ or your email',
		'userInvitation.modal.button':'View All Users',
		'acceptInvitation.usernameField.description':'It should be 10 characters long and could be a combination of uppercase letters, lowercase letters or numbers',
		'acceptInvitation.passwordField.description':'It should be 12 characters long and should be a combination of uppercase letters, lowercase letters, numbers and symbols',
		'acceptInvitation.review.userDetails':'User Details',
		'acceptInvitation.review.accountDetails':'Account Details',
		'acceptInvitation.verifyOrcid':'Verify ORCID iD',
		'acceptInvitation.skipVerifyOrcid':'Skip ORCID verification',
		'acceptInvitation.modal.title':"You've been assigned a new role in OJS",
		'acceptInvitation.modal.message':'Congratulations on your new role in OJS! You might now have access to new options. If you need assistance navigating the system, please click on the “Help” buttons throughout the interface for guidance',
		'acceptInvitation.modal.button':'View All Submissions',
		'acceptInvitation.privacyStatement.btn':'Privacy Statement',
		'acceptInvitation.privacyStatement.label':'Yes, I agree to have my data collected and stored according to the {$url}',
		'invitation.cancel': 'Cancel Invite',
		'invitation.inviteToRole.btn': 'Invite to a role',
		'invitation.header': 'Invitation',
		'invitation.tableHeader.name': 'Name',
		'invitation.searchForm.emptyError': 'At least provide one search criteria.',
		'invitation.cancelInvite.actionName':'Cancel Invite',
		'invitation.cancelInvite.title':'Cancel Invitation',
		'invitation.cancelInvite.message': 'Cancel the invitation sent to {$givenName} {$familyName} will deactivate acceptance link sent via email. Here are the invitation details:',
		'invitation.role.modifyRole.button':'Modify Role',
		'invitation.masthead.show':'Appear on the masthead',
		'invitation.masthead.hidden':'Does not appear on the masthead',
		'invitation.removeRoles':'Remove Role',
		'invitation.management.options':'Invitation management options',
		'userInvitation.cancel.message':'Are you sure wnat to cancel this invitation ?',
		'userInvitation.cancel.keepWorking':'Keep Working',
		'userInvitation.status.invited':'Invited {$date}',
		'userInvitation.search.userNotFound':'The user does not have a role in this journal',
		'userInvitation.search.userFound':'The user already exists in the journal',
		'userInvitation.edit.title':'Edit Invitation',
		'userInvitation.edit.message':'If you edit the existing invitation or add a new role, the current invitation will be canceled and, a new one will be sent. Are you sure you want to proceed?',
		'invitation.step':'STEP',
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
