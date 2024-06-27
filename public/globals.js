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
		apiBaseUrl: '/index.php/publicknowledge/api/v1/',
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
		'article.article': 'Article',
		'common.abstract': 'Abstract',
		'common.addCCBCC': 'Add CC/BCC',
		'common.attachFiles': 'Attach Files',
		'common.attachedFiles': 'Attached Files',
		'common.cancel': 'Cancel',
		'common.clearSearch': 'Clear search phrase',
		'common.close': 'Close',
		'common.commaListSeparator': ', ',
		'common.content': 'Content',
		'common.delete': 'Delete',
		'common.description': 'Description',
		'common.deselect': 'Deselect',
		'common.download': 'Download',
		'common.edit': 'Edit',
		'common.editItem': 'Edit {$name}',
		'common.emailTemplates': 'Email Templates',
		'common.error': 'Error',
		'common.filter': 'Filters',
		'common.filterAdd': 'Add filter: {$filterTitle}',
		'common.filterRemove': 'Clear filter: {$filterTitle}',
		'common.filtersClear': 'Clear Filters',
		'common.findTemplate': 'Find Template',
		'common.insert': 'Insert',
		'common.insertContent': 'Insert Content',
		'common.insertContentSearch': 'Find content to insert',
		'common.keywords': 'Keywords',
		'common.lastActivity': 'Last activity recorded on {$date}.',
		'common.loaded': 'Loaded',
		'common.loading': 'Loading',
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
		'common.remove': 'Remove',
		'common.removeItem': 'Remove {$item}',
		'common.required': 'Required',
		'common.save': 'Save',
		'common.saving': 'Saving',
		'common.search': 'Search',
		'common.searching': 'Searching',
		'common.selectAll': 'Select All',
		'common.selectNone': 'Select None',
		'common.selectWithName': 'Select {$name}',
		'common.showingSteps': '{$current}/{$total} steps',
		'common.showingXofX':
			'Showing <strong>{$start} to {$finish}</strong> of {$total}',
		'common.status': 'Status',
		'common.subtitle': 'Subtitle',
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
		'dashboard.acceptOrDeclineRequestDate':
			'Please accept or decline this request {$date}',
		'dashboard.action': 'Action',
		'dashboard.applyFilters': 'Apply Filters',
		'dashboard.assignEditor': 'Assign Editor',
		'dashboard.assignReviewers': 'Assign Reviewers',
		'dashboard.clearFilters': 'Clear Filters',
		'dashboard.completeReviewByDate': 'Please complete this review by {$date}.',
		'dashboard.dashboards': 'Dashboards',
		'dashboard.deadlineForComplitingReviewHasPassed':
			'Deadline for completing this review has passed. Please complete the review at the earliest.',
		'dashboard.deadlineForRespondingAcceptOrDecline':
			'Deadline for responding to this request has passed. Please accept or decline this request at the earliest.',
		'dashboard.mySubmissions': 'My Submissions',
		'dashboard.newReviewRoundToBeCreated': 'New review round to be created',
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
		'dashboard.revisionsSubmittedByAuthor': 'Revisions submitted by author',
		'dashboard.stage.copyediting': 'Copyediting',
		'dashboard.stage.deskReview': 'Desk Review',
		'dashboard.stage.production': 'Production',
		'dashboard.stage.published': 'Published',
		'dashboard.stage.reviewWithRound': 'Review (Round {$round})',
		'dashboard.stage.scheduledForPublication': 'Scheduled For Publication',
		'dashboard.startNewSubmission': 'Start A New Submission',
		'dashboard.submitRevisions': 'Submit revisions',
		'dashboard.summary.acceptAndSkipReview': 'Accept and skip review',
		'dashboard.summary.acceptReview': 'Accept review',
		'dashboard.summary.acceptSubmission': 'Accept Submission',
		'dashboard.summary.accessReviewForm': 'Access review form',
		'dashboard.summary.assignToIssue': 'Assign To Issue',
		'dashboard.summary.cancelReviewRound': 'Cancel Review Round',
		'dashboard.summary.copyeditedFiles': 'Copyedited Files',
		'dashboard.summary.daysInCopyediting': 'Days in copyediting',
		'dashboard.summary.daysInProduction': 'Days in production',
		'dashboard.summary.daysInReview': 'Days in review',
		'dashboard.summary.daysInSubmission': 'Days in submission',
		'dashboard.summary.daysSinceSubmission': 'Days since submission',
		'dashboard.summary.decline': 'Decline',
		'dashboard.summary.declineSubmission': 'Decline Submission',
		'dashboard.summary.deskReviewFiles': 'Desk Review Files',
		'dashboard.summary.deskReviewFilesDescription':
			'These are the files that will be taken forward to the review stage in the workflow.',
		'dashboard.summary.draftFiles': 'Draft Files',
		'dashboard.summary.draftFilesDescription':
			'These are files from the review stage which are to be copyedited',
		'dashboard.summary.editorsAssigned': 'Editors assigned',
		'dashboard.summary.filesForReview': 'Files for review',
		'dashboard.summary.filesForReviewDescription':
			'These files will be sent to the reviewers to review',
		'dashboard.summary.galleys': 'Galleys',
		'dashboard.summary.issueNo': 'Issue No',
		'dashboard.summary.journalName': 'Journal name',
		'dashboard.summary.notAssigned': 'Not assigned',
		'dashboard.summary.preview': 'Preview',
		'dashboard.summary.productionReadyFiles': 'Production Ready Files',
		'dashboard.summary.productionReadyFilesDescription':
			'These are the files that will be sent for publication',
		'dashboard.summary.requestRevisions': 'Request Revisions',
		'dashboard.summary.reviewer': 'Reviewer',
		'dashboard.summary.reviewerStatus': 'Reviewer status',
		'dashboard.summary.reviewers': 'Reviewers',
		'dashboard.summary.revisionsSubmitted': 'Revisions Submitted',
		'dashboard.summary.revisionsSubmittedDescription':
			'These files have been submitted by the author after visions were requested',
		'dashboard.summary.scheduleForProduction': 'Schedule for Publication',
		'dashboard.summary.sendSubmissionForReview': 'Send submission for review',
		'dashboard.summary.sendToProduction': 'Send to Production',
		'dashboard.summary.submissionLanguage': 'Submission Language',
		'dashboard.summary.submittedOn': 'Submitted on',
		'dashboard.summary.unschedule': 'Unschedule',
		'dashboard.summary.uploadFile': 'Upload File',
		'dashboard.summary.uploadRevisions': 'Upload Revisions',
		'dashboard.summary.viewActivityLog': 'View activity log',
		'dashboard.summary.viewSubmissionInDetail': 'View submission in detail',
		'dashboard.viewSummary': 'Summary',
		'doi.manager.versions.countStatement': 'There are {$count} versions.',
		'doi.manager.versions.modalTitle': 'DOIs for all versions',
		'doi.manager.versions.view': 'View all',
		'editor.review.cancelReviewer': 'Cancel Reviewer',
		'editor.review.resendRequestReviewer': 'Resend Review Request',
		'editor.review.reviewDetails': 'Review Details',
		'editor.review.unassignReviewer': 'Unassign Reviewer',
		'editor.submission.addStageParticipant': 'Assign Participant',
		'editor.submission.decision.requestRevisions': 'Request Revisions',
		'editor.submission.schedulePublication': 'Schedule For Publication',
		'editor.submission.search':
			'Search submissions, ID, authors, keywords, etc.',
		'editor.submissionArchive.confirmDelete':
			'Are you sure you want to permanently delete this submission?',
		'editor.submissionReview.editReview': 'Edit Review',
		'editor.submissionReview.uploadAttachment': 'Upload File',
		'editor.submissionReview.uploadFile': 'Upload Review File',
		'email.bcc': 'BCC',
		'email.cc': 'CC',
		'email.confirmSwitchLocale':
			'Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost.',
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
		'grid.action.sort': 'Sort',
		'help.help': 'Help',
		'invitation.orcid.message': '##invitation.orcid.message##',
		'invitation.role.addRole.button': '##invitation.role.addRole.button##',
		'invitation.role.dateEnd': '##invitation.role.dateEnd##',
		'invitation.role.dateStart': '##invitation.role.dateStart##',
		'invitation.role.masthead': '##invitation.role.masthead##',
		'invitation.role.removeRole.button':
			'##invitation.role.removeRole.button##',
		'invitation.role.selectRole': '##invitation.role.selectRole##',
		'invitation.wizard.completeSteps': '##invitation.wizard.completeSteps##',
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
		'metadata.property.displayName.doi': 'DOI',
		'navigation.backTo': '\u27f5 Back to {$page}',
		'publication.contributors': 'Contributors',
		'orcid.field.verification.request': 'Request verification',
		'orcid.field.verification.requested': 'Verification requested!',
		'orcid.field.authorEmailModal.title': 'Request ORCID verification',
		'orcid.field.authorEmailModal.message':
			'Would you like to send an email to this author requesting they verify their ORCID?',
		'orcid.field.deleteOrcidModal.title': 'Delete ORCID',
		'orcid.field.deleteOrcidModal.message':
			'Are you sure you want to remove this ORCID?',
		'orcid.field.unverified.shouldRequest':
			'This ORCID has not been verified. Please remove this unverified ORCID and request verification from the user/author directly.',
		'publication.jats.autoCreatedMessage':
			'This JATS file is generated automatically by the submission metadata',
		'publication.jats.confirmDeleteFileButton': 'Delete JATS File',
		'publication.jats.confirmDeleteFileMessage':
			'You are about to remove the existing JATS XML File from this publication. Are you sure?',
		'publication.jats.confirmDeleteFileTitle': 'Confirm deleting JATS XML',
		'publication.jats.lastModified':
			'Last Modification at {$modificationDate} by {$username}',
		'publication.selectIssue': 'Select an issue to schedule for publication',
		'publication.status.published': 'Published',
		'publication.status.unpublished': 'Unpublished',
		'publication.unschedule': 'Unschedule',
		'publication.unschedule.confirm':
			"Are you sure you don't want this scheduled for publication?",
		'publication.version': 'Version {$version}',
		'reviewer.article.decision.accept': 'Accept Submission',
		'reviewer.article.decision.decline': 'Decline Submission',
		'reviewer.article.decision.pendingRevisions': 'Revisions Required',
		'reviewer.article.decision.resubmitElsewhere': 'Resubmit Elsewhere',
		'reviewer.article.decision.resubmitHere': 'Resubmit for Review',
		'reviewer.article.decision.seeComments': 'See Comments',
		'reviewer.article.recommendation': 'Recommendation',
		'reviewer.submission.acceptedOn': 'Review Accepted On',
		'reviewer.submission.declineReview': 'Decline Review Request',
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
		'stageParticipants.notify.message': 'Message',
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
		'submission.list.reviewCancelled': 'Review Cancelled',
		'submission.list.reviewComplete': 'Review Submitted',
		'submission.list.reviewDue': 'Review Due: {$date}',
		'submission.list.reviewerWorkflowLink':
			'You have been assigned an editorial role for this submission. Would you like to access the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?',
		'submission.list.reviewsCompleted': 'Assigned reviews completed',
		'submission.list.revisionsSubmitted': 'Revisions submitted',
		'submission.submit.newSubmissionSingle': 'New Submission',
		'submission.upload.percentComplete': 'Uploading {$percent}% complete',
		'submissions.declined': 'Declined',
		'submissions.incomplete': 'Incomplete',
		todo: '##todo##',
		'user.email': 'Email',
		'user.orcid': 'ORCID iD',
		'user.username': 'Username',
		'validator.required': 'This field is required.',
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
