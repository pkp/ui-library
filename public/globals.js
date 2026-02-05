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
	 * Component styles configuration for utility class injection
	 * Themes can override this to add utility classes to component elements
	 */
	componentStyles: {},

	/**
	 * The current logged-in user
	 */
	currentUser: {
		csrfToken: '1234',
		id: 20,
		roles: [1, 16, 65536, 1048576],
		username: 'dbarnes',
		preferredName: 'Daniel Barnes',
		fullName: 'Daniel Barnes',
		initials: 'DB',
	},

	/**
	 *
	 *
	 */
	context: {
		app: 'ojs2',
		apiBaseUrl: 'https://mock/index.php/publicknowledge/api/v1/',
		pageBaseUrl: 'https://mock/index.php/publicknowledge/',
		currentLocale: 'en',
		primaryLocale: 'en',
		supportedLocales: {
			en: 'English',
			fr_CA: 'français',
		},
		supportedFormLocales: {
			en: 'English',
			fr_CA: 'français',
		},
		timeZone: 'UTC',
		dateFormatShort: 'm/d/Y',
		dateFormatLong: 'F j, Y',
		datetimeFormatShort: 'm/d/Y h:i A',
		datetimeFormatLong: 'F j, Y - h:i A',
		timeFormat: 'h:i A',
		legacyGridBaseUrl:
			'https://mock/index.php/publicknowledge/$$$call$$$/component/action',
		navigationMenuMaxDepth: 2,
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
		REVIEW_ASSIGNMENT_STATUS_VIEWED: 12,
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

		SUBMISSION_FILE_SUBMISSION: 2,
		SUBMISSION_FILE_INTERNAL_REVIEW_FILE: 19,
		SUBMISSION_FILE_REVIEW_FILE: 4,
		SUBMISSION_FILE_REVIEW_REVISION: 15,
		SUBMISSION_FILE_COPYEDIT: 9,
		SUBMISSION_FILE_FINAL: 6,
		SUBMISSION_FILE_PRODUCTION_READY: 11,

		ROLE_ID_MANAGER: 16,
		ROLE_ID_SITE_ADMIN: 1,
		ROLE_ID_AUTHOR: 65536,
		ROLE_ID_REVIEWER: 4096,
		ROLE_ID_ASSISTANT: 4097,
		ROLE_ID_READER: 1048576,
		ROLE_ID_SUB_EDITOR: 17,
		ROLE_ID_SUBSCRIPTION_MANAGER: 2097152,
		STAGE_STATUS_SUBMISSION_UNASSIGNED: 1,
		submission: {
			STATUS_QUEUED: 1,
			STATUS_PUBLISHED: 3,
			STATUS_DECLINED: 4,
			STATUS_SCHEDULED: 5,
		},
		publication: {
			STATUS_QUEUED: 1,
			STATUS_PUBLISHED: 3,
			STATUS_DECLINED: 4,
			STATUS_SCHEDULED: 5,
		},
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

		EDITORIAL_TASK_TYPE_DISCUSSION: 1,
		EDITORIAL_TASK_TYPE_TASK: 2,
		EDITORIAL_TASK_STATUS_PENDING: 1,
		EDITORIAL_TASK_STATUS_IN_PROGRESS: 2,
		EDITORIAL_TASK_STATUS_CLOSED: 3,

		// Reviewer recommendation types (ReviewerRecommendationType enum)
		reviewerRecommendationType: {
			APPROVED: 1,
			NOT_APPROVED: 2,
			REVISIONS_REQUESTED: 3,
			WITH_COMMENTS: 4,
		},

		citationProcessingStatus: {
			NOT_PROCESSED: 0,
			PID_EXTRACTED: 1,
			CROSSREF: 2,
			OPEN_ALEX: 3,
			ORCID: 4,
			PROCESSED: 5,
		},
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
		zip: 'FileZip', // DOCUMENT_TYPE_ZIP
		url: 'Url', // DOCUMENT_TYPE_URL
	},

	/**
	 * Locale keys loaded on the server-side
	 */
	localeKeys: {
		'about.contact.email': 'Email',
		'acceptInvitation.authorization.message':
			'Please log out and sign in with the correct account to accept this invitation.',
		'acceptInvitation.authorization.shouldBeAnonymous':
			"Invitation not accepted. You're logged in as a different user.",
		'acceptInvitation.cancel.message':
			'Are you sure you want to cancel? Canceling now will stop the role acceptance process, and you\u2019ll need to restart from the invitation email to accept the role again. If you\u2019re already a user, you\u2019ll be taken back to the dashboard. If not, you\u2019ll need to access the invitation email to start the process again.',
		'acceptInvitation.cancelInvite.button': 'Cancel Invitation Process',
		'acceptInvitation.cancelInvite.title': 'Cancel Role Invitation Process?',
		'acceptInvitation.modal.button': 'View All Submissions',
		'acceptInvitation.modal.message':
			'Congratulations on your new role in OJS! You might now have access to new options. If you need any assistance in understanding the system, please click on the \u201cHelp\u201d button throughout the system for guidance.',
		'acceptInvitation.modal.title': "You've been assigned a new role in OJS",
		'acceptInvitation.passwordField.description':
			'It should be at least 6 characters long and could be a combination of uppercase letters, lowercase letters, numbers and symbols',
		'acceptInvitation.privacyConsent': 'Privacy Consent',
		'acceptInvitation.privacyStatement.btn': 'Privacy Statement',
		'acceptInvitation.privacyStatement.label':
			'Yes, I agree to have my data collected and stored according to the {$url}',
		'acceptInvitation.privacyStatement.validation':
			'Please confirm that you have read and agree privacy statement',
		'acceptInvitation.review.accountDetails': 'Account Details',
		'acceptInvitation.review.userDetails': 'User Details',
		'acceptInvitation.skipVerifyOrcid': 'Skip ORCID verification',
		'acceptInvitation.usernameField.description':
			'It could be a combination of uppercase letters, lowercase letters or numbers',
		'acceptInvitation.verifyOrcid': 'Verify ORCID iD',
		'admin.citation.reprocess': 'Reprocess',
		'admin.jobs.failed.action.redispatch': 'Try Again',
		'admin.jobs.failed.action.redispatch.all': 'Requeue All Failed Jobs',
		'admin.jobs.list.actions': 'Actions',
		'admin.workflow.email.userGroup.assign.unrestricted':
			'Mark as unrestricted',
		'admin.workflow.email.userGroup.limitAccess':
			'Limit access to specific roles',
		'admin.workflow.email.userGroup.limitAccess.template.note':
			'Select the roles that can access this template.',
		'admin.workflow.email.userGroup.unrestricted.template.note':
			'Unrestricted templates will be accessible to all roles.',
		'article.article': 'Article',
		'article.metadata': 'Metadata',
		'author.users.contributor.principalContact': 'Primary Contact',
		'author.users.contributor.setPrincipalContact': 'Set Primary Contact',
		'common.add': 'Add',
		'common.addCCBCC': 'Add CC/BCC',
		'common.addFiles': 'Add Files',
		'common.assign': 'Assign',
		'common.attachFiles': 'Attach Files',
		'common.attachSelected': 'Attach Selected',
		'common.back': 'Back',
		'common.cancel': 'Cancel',
		'common.changeLanguage': 'Change Language',
		'common.clearSearch': 'Clear search phrase',
		'common.close': 'Close',
		'common.closed': 'Closed',
		'common.commaListSeparator': ', ',
		'common.complete': 'Complete',
		'common.confirm': 'Confirm',
		'common.confirmDelete':
			'Are you sure you wish to delete this item? This action cannot be undone.',
		'common.content': 'Content',
		'common.createdBy': 'Created by',
		'common.dateUploaded': 'Date uploaded',
		'common.default': 'Default',
		'common.delete': 'Delete',
		'common.description': 'Description',
		'common.deselect': 'Deselect',
		'common.details': 'Details',
		'common.download': 'Download',
		'common.dragAndDropHere': 'Drag and drop files here.',
		'common.dragToReorder': 'Drag to reorder',
		'common.dueDate': 'Due Date',
		'common.edit': 'Edit',
		'common.editItem': 'Edit {$name}',
		'common.emailTemplates': 'Email Templates',
		'common.error': 'Error',
		'common.event': 'Event',
		'common.expand': '##common.expand##',
		'common.fileName': 'File Name',
		'common.filter': 'Filters',
		'common.filterAdd': 'Add filter: {$filterTitle}',
		'common.filterRemove': 'Clear filter: {$filterTitle}',
		'common.filtersClear': 'Clear Filters',
		'common.findTemplate': 'Find Template',
		'common.geographic': 'Geographic',
		'common.help': '##common.help##',
		'common.history': 'History',
		'common.id': 'ID',
		'common.inProgress': 'In progress',
		'common.insert': 'Insert',
		'common.insertContent': 'Insert Content',
		'common.insertContentSearch': 'Find content to insert',
		'common.language': 'Language',
		'common.lastActivity': 'Last activity recorded on {$date}.',
		'common.loaded': 'Loaded',
		'common.loading': 'Loading',
		'common.me': 'Me',
		'common.months': 'months',
		'common.moreActions': 'More Actions',
		'common.name': 'Name',
		'common.navigation.user': 'User Navigation',
		'common.new': 'New',
		'common.no': 'No',
		'common.noItemsFound': 'No items found.',
		'common.none': 'None',
		'common.notice': 'Notice',
		'common.numberedMore': '{$number} more',
		'common.numero': 'No',
		'common.ok': 'OK',
		'common.oneMonth': '1 month',
		'common.oneWeek': '1 week',
		'common.order': 'Order',
		'common.orderDown': 'Decrease position of {$itemTitle}',
		'common.orderUp': 'Increase position of {$itemTitle}',
		'common.orUploadFile': 'Or upload a file',
		'common.overdue': 'Overdue',
		'common.pageNumber': 'Page {$pageNumber}',
		'common.pagination.goToPage': 'Go to {$page}',
		'common.pagination.label': 'View additional pages',
		'common.pagination.next': 'Next',
		'common.pagination.previous': 'Previous',
		'common.payments': 'Payments',
		'common.preview': 'Preview',
		'common.publications': 'Articles',
		'common.refreshingData': 'Refreshing data',
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
		'common.semicolonListSeparator': '; ',
		'common.showingSteps': '{$current}/{$total} steps',
		'common.showingXofX':
			'Showing <strong>{$start} to {$finish}</strong> of {$total}',
		'common.startDate': 'Start Date',
		'common.status': 'Status',
		'common.switchTo': 'Switch to',
		'common.switchToNamedItem': 'Switch to {$name}',
		'common.tasks': 'Tasks',
		'common.type': 'Type',
		'common.unknownError':
			'An unexpected error has occurred. Please reload the page and try again.',
		'common.upload': 'Upload',
		'common.upload.addFile': 'Add File',
		'common.upload.addFile.description': 'Upload a file from your computer.',
		'common.uploadedBy': 'Uploaded by {$name}',
		'common.uploadedByAndWhen': 'Uploaded by {$name} on {$date}',
		'common.user': 'User',
		'common.view': 'View',
		'common.viewMoreDetails': 'View more details',
		'common.viewWithName': 'View {$name}',
		'common.warning': 'Warning',
		'common.weeks': 'weeks',
		'common.yes': 'Yes',
		'common.yesContinue': 'Yes, Continue',
		'common.yetToBegin': 'Yet to begin',
		'context.context': 'Journal',
		'contributor.listPanel.preview': 'Preview',
		'contributor.listPanel.preview.abbreviated': 'Abbreviated',
		'contributor.listPanel.preview.description':
			'Contributors to this publication will be identified in the following formats.',
		'contributor.listPanel.preview.display': 'Display',
		'contributor.listPanel.preview.format': 'Format',
		'contributor.listPanel.preview.full': 'Full',
		'contributor.listPanel.preview.publicationLists': 'Publication Lists',
		'dashboard.actions.finishReview': 'Finish review',
		'dashboard.actions.respondToRequest': 'Respond to request',
		'dashboard.applyFilters': 'Apply Filters',
		'dashboard.assignReviewers': 'Assign Reviewers',
		'dashboard.copyEditedFilesUploaded': 'Copyedited Files Uploaded: {$count}',
		'dashboard.declinedDuringStage': 'Declined during the {$stageName} stage.',
		'dashboard.minimumConfirmedReviewsNotMet':
			'The minimum number of confirmed reviews has not been met. Do you still want to proceed with this editorial decision?',
		'dashboard.minimumConfirmedReviewsRequired':
			'Minimum number of confirmed reviews required: {$number}.',
		'dashboard.minimumReviewsConfirmedDecisionNeeded':
			'Minimum required number of reviews have been confirmed. A decision is needed.',
		'dashboard.newReviewRoundToBeCreated': 'New review round to be created',
		'dashboard.noAccessBeingAuthor':
			'You cannot access this submission as a Journal Manager since you are the author. To view it, go to "My Submissions"',
		'dashboard.noAccessBeingReviewer':
			'You cannot access this submission as a Journal Manager since you are the reviewer. To view it, go to "Review Assignments"',
		'dashboard.proceedWithoutMinimumReviews':
			'Proceed Without Minimum Confirmed Reviews?',
		'dashboard.recommendOnly.pendingRecommendations':
			'Recommending Editors are tasked to advise the next steps for this submission',
		'dashboard.recommendOnly.recommendationsCompleted':
			'All editorial recommendations have been received, and a decision is required.',
		'dashboard.recommendOnly.recommendationsReady':
			'An editorial recommendation has been received',
		'dashboard.reviewAssignment.acceptOrDeclineRequestDate':
			'Please accept or decline this request by {$date}',
		'dashboard.reviewAssignment.action.cancelReviewer': 'Cancel Reviewer',
		'dashboard.reviewAssignment.action.editDueDate': 'Edit Due Date',
		'dashboard.reviewAssignment.action.resendReviewRequest':
			'Resend Review Request',
		'dashboard.reviewAssignment.action.sendReviewToOrcid':
			'Send Review To ORCID',
		'dashboard.reviewAssignment.action.sendReviewToOrcid.confirm':
			"Send this review to the reviewer's ORCID?",
		'dashboard.reviewAssignment.action.unassignReviewer': 'Unassign',
		'dashboard.reviewAssignment.action.viewDetails': 'View details',
		'dashboard.reviewAssignment.action.viewRecommendation':
			'View recommendation',
		'dashboard.reviewAssignment.action.viewUnreadRecommendation':
			'View unread recommendation',
		'dashboard.reviewAssignment.completeReviewByDate':
			'Please complete this review by {$date}.',
		'dashboard.reviewAssignment.deadlineForCompletingReviewHasPassed':
			'Deadline for completing this review has passed. Please complete the review at the earliest.',
		'dashboard.reviewAssignment.deadlineForRespondingAcceptOrDecline':
			'Deadline for responding to this request has passed. Please accept or decline this request at the earliest.',
		'dashboard.reviewAssignment.declined': 'Request declined on {$date}',
		'dashboard.reviewAssignment.reviewSubmitted': 'Review submitted on {$date}',
		'dashboard.reviewAssignment.statusAccepted.description':
			'This reviewer has accepted the review request. Their review is due in <b>{$days} days on {$date}.</b>',
		'dashboard.reviewAssignment.statusAccepted.title':
			'Ongoing review - request accepted',
		'dashboard.reviewAssignment.statusAwaitingResponse.description':
			'Review request has been shared with reviewer. Awaiting response in <b>{$days} days on {$date}</b>',
		'dashboard.reviewAssignment.statusAwaitingResponse.title':
			'Awaiting Response from the reviewer',
		'dashboard.reviewAssignment.statusCancelled.description':
			'Reviewer has cancelled the review request on <b>{$date}</b>.',
		'dashboard.reviewAssignment.statusCancelled.title':
			'Reviewer cancelled review request',
		'dashboard.reviewAssignment.statusComplete.description':
			'The review was accepted by the editor on <b>{$date}</b>.',
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
		'dashboard.reviewAssignment.statusReceived.withoutRecommendation.description':
			'The review was completed on {$date}',
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
		'dashboard.reviewUpdateCounts':
			'Review update {$reviewsCompletedCount}/{$reviewsTotalCount}',
		'dashboard.reviewersAssigned': 'Reviewers assigned',
		'dashboard.revisionRequested': 'Revision requested',
		'dashboard.revisionRequestedFromAuthor': 'Revisions requested from author',
		'dashboard.revisionsRequestedFromAuthorNextRound':
			'Revisions requested from the author to be taken to a new review round',
		'dashboard.submissions.incomplete.bulkDelete.body':
			'Are you sure you want to delete the selected items? This action cannot be undone. Please confirm to proceed.',
		'dashboard.submissions.incomplete.bulkDelete.button':
			'Delete Incomplete Submissions',
		'dashboard.submissions.incomplete.bulkDelete.column.description':
			'Select incomplete submissions to be deleted.',
		'dashboard.submissions.incomplete.bulkDelete.confirm':
			'Confirm Delete of Incomplete Submissions',
		'dashboard.submitRevisions': 'Submit revisions',
		'dashboard.toBePublishedInIssue': 'To be published in issue {$issue}',
		'discussion.addNewMessage': 'Add New Message',
		'discussion.addTaskDetails': 'Add Task Details',
		'discussion.closeThisDiscussion': 'Close this Discussion',
		'discussion.confirmCloseDiscussion':
			"Are you sure you want to close this discussion? Closing the discussion won't stop you from sending or receiving messages in this thread - this ensures no message is lost.",
		'discussion.confirmReopenDiscussion':
			'Are you sure you want to reopen this discussion?',
		'discussion.description':
			'Use this space to start discussions, assign tasks to others, or create your personal task list to help you move this submission to the next stage.',
		'discussion.form.createDontStartTask': 'Create Task (Do Not Start)',
		'discussion.form.description':
			'Open for What? Open to What? Beyond Content',
		'discussion.form.detailsDescription':
			'Use this space to share essential information.',
		'discussion.form.detailsNameDescription':
			'Please enter the name for the task and discussion.',
		'discussion.form.detailsParticipantsDescription':
			'You have the option to assign participants or allocate it solely to yourself.',
		'discussion.form.discussionDescription':
			'You can start a discussion thread here by adding a message. This space is also available for providing a brief overview of the task, including any key details, goals, or specific instructions to help guide the assignees.',
		'discussion.form.startTaskUponSaving': 'Begin Task Upon Saving',
		'discussion.form.taskInfoAssigneesDescription':
			'If there is a specific participant designated to complete this task, please assign it to them here.',
		'discussion.form.taskInfoAssigneesLabel':
			'Responsible to complete this task (Task owner)',
		'discussion.form.taskInfoConvertToTask':
			'You can convert this into a task by clicking <strong>Edit</strong>.',
		'discussion.form.taskInfoDescription':
			'Enter the tasks details here to help manage this task effectively, if selected.',
		'discussion.form.taskInfoDueDateDescription':
			'If there is a deadline for this task, you can indicate it here. The due date will be communicated and established for each participant assigned to this task.',
		'discussion.form.taskInfoLabel': 'Enter task information',
		'discussion.form.taskInfoReopenAndConvertToTask':
			'You can convert this into a task by re-opening the discussion and clicking <strong>Edit</strong>.',
		'discussion.form.taskInformation': 'Task Information',
		'discussion.form.templatesLabel': 'Templates to get you started!',
		'discussion.messageFrom': 'Message from {$from}',
		'discussion.name': 'Discussion',
		'discussion.noAccessToAddMessage':
			'To add a new message, please assign yourself as a participant.',
		'discussion.reopenThisDiscussion': 'Reopen this Discussion',
		'discussion.template.discussionDescription':
			'This discussion template pre-fills the name, participants, and starting message. You can adjust the details before starting.',
		'discussion.template.taskDescription':
			'This task template auto-fills the task name, due date, description, and roles. After selecting the template, you can modify any details before saving the task.',
		'discussion.title': 'Desk Review Tasks & Discussions',
		'doi.manager.versions.countStatement': 'There are {$count} versions.',
		'doi.manager.versions.modalTitle': 'DOIs for all versions',
		'doi.manager.versions.view': 'View all',
		'editor.activityLog': 'Activity Log',
		'editor.review.ReviewerResendRequest': 'Request Resent',
		'editor.review.allSections': 'Editor Form Shows All Review Sections',
		'editor.review.authorOnly': 'Author-Only Sections Displayed',
		'editor.review.cancelReviewer': 'Cancel Reviewer',
		'editor.review.download': 'Download Review Form',
		'editor.review.emailReviewer': 'Email Reviewer',
		'editor.review.logResponse': 'Log Response',
		'editor.review.logResponse.for': 'Log Response for',
		'editor.review.readReview': 'Read Review',
		'editor.review.reinstateReviewer': 'Reinstate Reviewer',
		'editor.review.reminder': 'Review Reminder',
		'editor.review.requestAccepted': 'Request Accepted',
		'editor.review.requestCancelled': 'Request Cancelled',
		'editor.review.requestCancelled.tooltip':
			'The editor cancelled this review request.',
		'editor.review.requestDeclined': 'Request Declined',
		'editor.review.requestDeclined.tooltip':
			'The reviewer declined this review request.',
		'editor.review.requestSent': 'Request Sent',
		'editor.review.resendRequestReviewer': 'Resend Review Request',
		'editor.review.responseDue': 'Response due: {$date}',
		'editor.review.revertDecision': 'Revert Decision',
		'editor.review.reviewDetails': 'Review Details',
		'editor.review.reviewDue': 'Review due: {$date}',
		'editor.review.reviewSubmitted': 'Review Submitted',
		'editor.review.reviewViewed': 'Review Viewed',
		'editor.review.reviewerThanked': 'Reviewer Thanked',
		'editor.review.sendReminder': 'Send Reminder',
		'editor.review.thankReviewer': 'Thank Reviewer',
		'editor.review.unassignReviewer': 'Unassign Reviewer',
		'editor.review.unconsiderReview': 'Unconsider this Review',
		'editor.review.unconsiderReviewText':
			'Do you wish to mark this review as unconsidered?  The review history will be preserved.',
		'editor.selectSubmissionFilesStage': 'Select submission stage',
		'editor.submission.addReviewer': 'Add Reviewer',
		'editor.submission.addStageParticipant': 'Assign Participant',
		'editor.submission.createNewRound': 'Create New Review Round',
		'editor.submission.days': 'Days',
		'editor.submission.decision.accept': 'Accept Submission',
		'editor.submission.decision.backFromCopyediting': 'Cancel Copyediting',
		'editor.submission.decision.backToCopyediting': 'Back To Copyediting',
		'editor.submission.decision.cancelReviewRound': 'Cancel Review Round',
		'editor.submission.decision.decline': 'Decline Submission',
		'editor.submission.decision.requestRevisions': 'Request Revisions',
		'editor.submission.decision.revertDecline': 'Revert Decline',
		'editor.submission.decision.sendExternalReview': 'Send for Review',
		'editor.submission.decision.sendToProduction': 'Send To Production',
		'editor.submission.decision.skipReview': 'Accept and Skip Review',
		'editor.submission.editStageParticipant': 'Edit Assignment',
		'editor.submission.production.productionReadyFiles':
			'Production Ready Files',
		'editor.submission.productionFiles': 'Production Files',
		'editor.submission.recommend.accept': 'Recommend Accept',
		'editor.submission.recommend.decline': 'Recommend Decline',
		'editor.submission.recommend.revisions': 'Recommend Revisions',
		'editor.submission.recommend.sendExternalReview':
			'##editor.submission.recommend.sendExternalReview##',
		'editor.submission.recommendation': 'Recommendation',
		'editor.submission.recommendation.noDecidingEditors':
			'You can not make a recommendation until an editor is assigned with permission to record a decision.',
		'editor.submission.removeStageParticipant': 'Remove Participant',
		'editor.submission.removeStageParticipant.description':
			'You are about to remove this participant from <strong>all</strong> stages.',
		'editor.submission.review.currentFiles':
			'Current Review Files For Round {$round}',
		'editor.submission.reviewerSuggestions': 'Reviewers Suggested by Author',
		'editor.submission.revisions': 'Revisions',
		'editor.submission.roundStatus.recommendationMadeByYou':
			'Recommendation has been made by you.',
		'editor.submission.roundStatus.reviewsCompleted':
			'All reviews are confirmed and a decision is needed.',
		'editor.submission.schedulePublication': 'Schedule For Publication',
		'editor.submission.search':
			'Search submissions, ID, authors, keywords, etc.',
		'editor.submission.selectCopyedingFiles': 'Copyediting Files',
		'editor.submission.stageParticipants': 'Participants',
		'editor.submission.uploadSelectFiles': 'Upload/Select Files',
		'editor.submission.workflowDecision.changeDecision': 'Change decision',
		'editor.submission.workflowDecision.submission.published':
			'Submission published.',
		'editor.submissionArchive.confirmDelete':
			'Are you sure you want to permanently delete this submission?',
		'editor.submissionLibrary': 'Library',
		'editor.submissionReview.anonymous': 'Anonymous Reviewer/Disclosed Author',
		'editor.submissionReview.doubleAnonymous':
			'Anonymous Reviewer/Anonymous Author',
		'editor.submissionReview.editReview': 'Edit Review',
		'editor.submissionReview.open': 'Open',
		'editor.submissionReview.uploadFile': 'Upload Review File',
		'email.addAttachment.libraryFiles': 'Library Files',
		'email.addAttachment.libraryFiles.attach': 'Attach Library Files',
		'email.addAttachment.libraryFiles.description':
			'Attach files from the Submission and Publisher Libraries.',
		'email.bcc': 'BCC',
		'email.cc': 'CC',
		'email.confirmSwitchLocale':
			'Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost.',
		'email.email': 'Email',
		'email.subject': 'Subject',
		'email.to': 'To',
		'fileManager.copyeditedFiles': 'Copyedited Files',
		'fileManager.copyeditedFilesDescription':
			'These are edited files that will be taken to the production stage',
		'fileManager.draftFilesDescription':
			'These are files from the review stage which are to be copyedited',
		'fileManager.filesForReview': 'Files for Review',
		'fileManager.filesForReviewDescription':
			'These files will be sent to the reviewers to review',
		'fileManager.productionReadyFilesDescription':
			'These are the files that will be sent for publication',
		'fileManager.revisionsUploaded': 'Revisions Uploaded',
		'fileManager.revisionsUploadedDescription':
			'These files have been submitted by the author after revisions were requested',
		'fileManager.sendFileToTextEditor': 'Send File to Text Editor',
		'fileManager.submissionFilesDescription':
			'Files uploaded at the time of submission',
		'form.dataHasChanged':
			'The data on this form has changed. Do you wish to continue without saving?',
		'form.dropzone.dictDefaultMessage': 'Drop files here to upload',
		'form.dropzone.dictFallbackMessage':
			"Your browser does not support drag'n'drop file uploads.",
		'form.dropzone.dictFallbackText':
			'Please use the fallback form below to upload your files.',
		'form.dropzone.dictFileTooBig':
			'File is too big ({$filesize}mb). Files larger than {$maxFilesize}mb can not be uploaded.',
		'form.dropzone.dictInvalidFileType':
			'Files of this type can not be uploaded.',
		'form.dropzone.dictResponseError':
			'Server responded with {$statusCode} code. Please contact the system administrator if this problem persists.',
		'form.dropzone.dictCancelUpload': 'Cancel upload',
		'form.dropzone.dictUploadCanceled': 'Upload canceled',
		'form.dropzone.dictCancelUploadConfirmation':
			'Are you sure you want to cancel this upload?',
		'form.dropzone.dictRemoveFile': 'Remove file',
		'form.dropzone.dictMaxFilesExceeded': 'You can not upload any more files.',
		'form.errorA11y': 'Go to {$fieldLabel}: {$errorMessage}',
		'form.errorGoTo': 'Jump to next error',
		'form.errorMany': 'Please correct {$count} errors.',
		'form.errorOne': 'Please correct one error.',
		'form.errorSummaryMany':
			'{$count} errors detected! Please correct the errors below before proceeding.',
		'form.errorSummaryOne':
			'1 error detected! Please correct the error below before proceeding.',
		'form.errors':
			'The form was not saved because {$count} error(s) were encountered. Please correct these errors and try again.',
		'form.multilingualLabel': '{$label} in {$localeName}',
		'form.multilingualProgress': '{$count}/{$total} languages completed',
		'form.saved': 'Saved',
		'form.submit': 'Submit',
		'grid.action.addContributor': 'Add Contributor',
		'grid.action.addGalley': 'Add galley',
		'grid.action.addNavigationMenu': 'Add Menu',
		'grid.action.addReviewerRecommendation': 'Add Recommendation',
		'grid.action.addReviewerSuggestion': 'Add Reviewer Suggestion',
		'grid.action.delete': 'Delete',
		'grid.action.deleteContributor': 'Delete Contributor',
		'grid.action.deleteContributor.confirmationMessage':
			'Are you sure you want to remove {$name} as a contributor? This action can not be undone.',
		'grid.action.deleteReviewerRecommendation': 'Delete Recommendation',
		'grid.action.deleteReviewerSuggestion': 'Delete Reviewer Suggestion',
		'grid.action.deleteReviewerSuggestion.confirmationMessage':
			'Are you sure you want to remove this suggestion? This action can not be undone.',
		'grid.action.edit': 'Edit',
		'grid.action.editFile': 'Edit a file',
		'grid.action.editReviewerRecommendation': 'Edit Recommendation',
		'grid.action.logInAs': 'Login As',
		'grid.action.mergeUser': 'Merge user',
		'grid.action.moreInformation': 'More Information',
		'grid.action.order': 'Order',
		'grid.action.saveOrdering': 'Save Order',
		'grid.action.sendToTextEditor': 'Send to Text Editor',
		'grid.action.sort': 'Sort',
		'grid.action.updateFile': 'Update File Details',
		'grid.category.add': 'Add Category',
		'grid.category.categories': 'Categories',
		'grid.category.categoryName': 'Category Name',
		'grid.category.edit': 'Edit Category',
		'grid.columns.actions': 'Actions',
		'grid.libraryFiles.submission.title': 'Submission Library',
		'grid.noItems': 'No Items',
		'grid.user.confirmLogInAs':
			'Log in as this user? All actions you perform will be attributed to this user.',
		'grid.user.currentUsers': 'Current Users',
		'grid.user.disable': 'Disable User',
		'grid.user.email': 'Email',
		'grid.user.enable': 'Enable User',
		'grid.user.logInAs': 'Login As',
		'grid.user.remove': 'Remove User',
		'help.help': 'Help',
		'informationCenter.informationCenter': 'Information Center',
		'invitation.cancelInvite.actionName': 'Cancel Invite',
		'invitation.cancelInvite.message':
			'Canceling the invitation sent to {$givenName} {$familyName} will deactivate acceptance link sent via email. Here are the invitation details: ',
		'invitation.cancelInvite.title': 'Cancel Invitation',
		'invitation.header': 'Invitations',
		'invitation.inviteToRole.btn': 'Invite to a role',
		'invitation.management.options': 'Invitation management options',
		'invitation.masthead.hidden': 'Does not appear on the masthead',
		'invitation.masthead.show': 'Appear on the masthead',
		'invitation.orcid.acceptInvitation.message':
			'Not verified. You can verify your ORCID iD from your profile section in OJS.',
		'invitation.removeRoles': 'User Removed From Role',
		'invitation.role.addRole.button': 'Add Another Role',
		'invitation.role.dateStart': 'Start Date',
		'invitation.role.masthead': 'Journal Masthead',
		'invitation.role.removeRole.button': 'Remove Role',
		'invitation.role.selectRole': 'Select a new role',
		'invitation.searchForm.emptyError': 'Provide at least one search criteria.',
		'invitation.step': 'STEP',
		'invitation.tableHeader.name': 'Name',
		'invitation.wizard.completeSteps': '##invitation.wizard.completeSteps##',
		'invitation.wizard.errors': '##invitation.wizard.errors##',
		'issue.issue': 'Issue',
		'issue.issues': 'Issues',
		'list.collapse': 'Collapse',
		'list.collapseAll': 'Collapse all',
		'list.expand': 'Expand',
		'list.expandAll': 'Expand all',
		'list.viewLess': 'Hide expanded details about {$name}',
		'list.viewMore': 'Show more details about {$name}',
		'manager.category.assignedTo': 'Assigned To',
		'manager.category.backToCategories': 'Back to Categories',
		'manager.category.collapseSubcategories': 'Collapse sub-categories',
		'manager.category.confirmDelete':
			'I understand the consequences, delete this category',
		'manager.category.delete.confirmationTitle':
			'Are you absolutely sure you want to delete "{$title}" category?',
		'manager.category.delete.message': '##manager.category.delete.message##',
		'manager.category.delete.message.body':
			'<div class="font-semibold">Warning: Deleting this category will remove all {$subCategoryCount} sub-categories within it.</div><div class="text-secondary"><p class="mt-6">This action cannot be undone. Deleting the category will:</p><ul role="list" class="list-disc ml-8"><li>Permanently remove all nested sub-categories</li><li>Unassign this category from any submissions currently using it</li></ul><p class="mt-4">This will not delete the submissions themselves \u2014 they will simply be left without a category.</p></div><p class="mt-4 text-primary text-lg-bold">To confirm, please type the name of the category "{$title}" below to proceed</p>',
		'manager.category.deleteCategory': 'Delete Category',
		'manager.category.deleted': 'Category Deleted',
		'manager.category.deleted.description':
			'<p>"{$title}" and its {$subCategoryCount} sub-categories have been successfully deleted.</p><p class="mt-4 text-secondary">All submissions previously tagged under these categories are now unassigned. You can reassign them from the submission details page.</p>',
		'manager.category.expandSubcategories': 'Expand sub-categories',
		'manager.category.saved': 'Category saved',
		'manager.category.toggleSubcategories': 'Expand or collapse sub-categories',
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
		'manager.navigationMenu.assigned': 'Assigned',
		'manager.navigationMenu.noAssignedItems':
			'No items assigned to this menu. Drag items from the right panel.',
		'manager.navigationMenu.noUnassignedItems': 'All items have been assigned.',
		'manager.navigationMenu.unassigned': 'Unassigned',
		'manager.navigationMenus': 'Navigation',
		'manager.navigationMenus.assignedMenuItems': 'Assigned Menu Items',
		'manager.navigationMenus.form.conditionalDisplay':
			'Learn more about when this menu item will be displayed or hidden.',
		'manager.navigationMenus.form.navigationMenuArea':
			'Active Theme Navigation Areas',
		'manager.navigationMenus.form.navigationMenuAreaMessage':
			'Select a navigation area',
		'manager.navigationMenus.form.title': 'Title',
		'manager.navigationMenus.unassignedMenuItems': 'Unassigned Menu Items',
		'manager.people.confirmRemove':
			'Remove this user from this journal? This action will unenroll the user from all roles within this journal.',
		'manager.people.signedInAs': 'You are currently logged in as {$username}',
		'manager.publication.productionStage': 'Production',
		'manager.publication.reviewStage': 'Review',
		'manager.publication.submissionStage': 'Submission',
		'manager.reviewerRecommendations.activate.title':
			'Activate Reviewer Recommendation',
		'manager.reviewerRecommendations.confirmActivate':
			'Are you sure you want to activate the recommendation <b>{$title}</b>',
		'manager.reviewerRecommendations.confirmDeactivate':
			'Are you sure you want to deactivate the recommendation <b>{$title}</b>',
		'manager.reviewerRecommendations.confirmDelete':
			'Are you sure you want to delete the recommendation <b>{$title}</b>',
		'manager.reviewerRecommendations.deactivate.title':
			'Deactivate Reviewer Recommendation',
		'manager.reviewerRecommendations.list.name.title': 'Recommendations',
		'manager.reviewerRecommendations.list.status.title': 'Activate',
		'manager.roles': 'Roles',
		'manager.statistics.counterR5Report.settings': 'Report Settings',
		'manager.statistics.counterR5Reports': 'Counter R5 Reports',
		'manager.statistics.counterR5Reports.description':
			'See <a href="https://cop5.projectcounter.org/en/5.0.3/04-reports/index.html" target="_new">COUNTER 5.0.3 documentation</a> for more information about each report.',
		'manager.statistics.counterR5Reports.usageNotPossible':
			'There are no COUNTER R5 usage statistics available yet.',
		'manager.userComment.all': 'All',
		'manager.userComment.approval.warning':
			'Approving this comment will make it visible to all users on the site',
		'manager.userComment.approveComment': 'Approve Comment',
		'manager.userComment.approved': 'Approved',
		'manager.userComment.approved.note':
			'This comment was approved on {$approvedAt} by {$approvedBy}.',
		'manager.userComment.comment': 'Comment',
		'manager.userComment.commentPreview': 'Comment preview',
		'manager.userComment.commentUpdated':
			'The comment has been updated successfully.',
		'manager.userComment.comments': 'Comments',
		'manager.userComment.dateReported': 'Date Reported',
		'manager.userComment.deleteComment': 'Delete Comment',
		'manager.userComment.deleteComment.confirm':
			'Are you sure you want to delete this comment? This action cannot be undone.',
		'manager.userComment.deleteComment.success':
			'The comment has been deleted successfully.',
		'manager.userComment.deleteReport': 'Delete Report',
		'manager.userComment.deleteReport.confirm':
			'Are you sure you want to delete this report? This action cannot be undone.',
		'manager.userComment.deleteReport.success':
			'The report has been deleted successfully.',
		'manager.userComment.hiddenOrNeedsApproval': 'Hidden/Needs Approval',
		'manager.userComment.hideComment': 'Hide Comment',
		'manager.userComment.report.description':
			'This is the list of all the users who have reported this comment',
		'manager.userComment.report.noReports':
			'No one has reported this comment yet',
		'manager.userComment.report.reason': 'Reason',
		'manager.userComment.reportPreview': 'Report preview',
		'manager.userComment.reported': 'Reported',
		'manager.userComment.reportedBy': 'Reported By',
		'manager.userComment.reports': 'Reports',
		'manager.userComment.userComments': 'User Comments',
		'manager.userComment.viewComment': 'View Comment',
		'manager.userComment.viewDetailsCommentBy': 'View comment details by',
		'manager.userComment.viewReport': 'View Report',
		'manager.userComment.viewReportDetailsBy': 'View report details by',
		'manager.workflow': 'Workflow',
		'navigation.dashboards': 'Editor Dashboard',
		'navigation.mySubmissions': 'My Submissions as Author',
		'navigation.reviewAssignments': 'My Assignments as Reviewer',
		'navigation.skip.main': 'Skip to main content',
		'navigation.skip.nav': 'Skip to main navigation menu',
		'navigation.submissions': 'Submissions',
		'notification.addedNavigationMenu':
			'Navigation menu was successfully added',
		'notification.editedNavigationMenu':
			'Navigation menu was successfully updated',
		'notification.notifications': 'Notifications',
		'notification.type.roundStatusTitle': 'Round {$round} Status',
		'openReview.readResponse': 'Read Response',
		'openReview.readReview': 'Read Review',
		'openReview.reviewCount': '{$count} reviews',
		'openReview.reviewerCount': '{$count} reviewers',
		'openReview.sortBy': 'Sort by',
		'openReview.sortByReviewerName': 'Reviewer Name',
		'orcid.field.authorEmailModal.message':
			'Would you like to send an email to this author requesting they verify their ORCID?',
		'orcid.field.authorEmailModal.message.noAuthor':
			'The email will be sent once the author has been created.',
		'orcid.field.authorEmailModal.title': 'Request ORCID verification',
		'orcid.field.deleteOrcidModal.message':
			'Are you sure you want to remove this ORCID?',
		'orcid.field.deleteOrcidModal.title': 'Delete ORCID',
		'orcid.field.unverified.shouldRequest':
			'This ORCID has not been verified. Please remove this unverified ORCID and request verification from the user/author directly.',
		'orcid.field.verification.request': 'Request verification',
		'orcid.field.verification.requested':
			'ORCID Verification has been requested!',
		'orcid.field.verification.resendRequest': 'Resend Verification Email',
		'participantManager.onlyAllowedToRecommend':
			'Only allowed to recommend an editorial decision',
		'publication.assignToIssue.assignmentType': 'Issue Assignment',
		'publication.assignToIssue.issueDescription':
			'Select the issue to assign this publication to.',
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
		'publication.publish': 'Publish',
		'publication.revisionSignificance.description':
			'Would you like to assign a revision significance to this document, such as minor or major? Based on your selection, the document information will be automatically updated.',
		'publication.revisionSignificance.label': 'Revision Significance',
		'publication.revisionSignificance.major': 'Major Revision',
		'publication.revisionSignificance.minor': 'Minor Revision',
		'publication.scheduledForPublication.reviewDetails.description':
			'Before scheduling this submission for publication, please take a moment to review some of the entered important details. This is your opportunity to assign a version name, confirm the issue it belongs to, and ensure all necessary information is correct.',
		'publication.scheduledForPublication.reviewDetails.label':
			'Review Publishing Details',
		'publication.sendToTextEditor.label':
			'To which version would you like to send this file?',
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
		'publication.versionSource.create.description':
			"The selected version's metadata will be used to pre-fill fields in the new version. You can make edits after importing.",
		'publication.versionSource.create.label':
			'Which version should metadata be copied from?',
		'publication.versionStage.versionOfRecord': 'By Record',
		'publication.versionStage.description':
			"Would you like to assign a stage to this document, such as author's original or version of record? Based on your selection, the document information will be automatically updated.",
		'publication.versionStage.label': 'Publication Stage',
		'reviewer.article.recommendation': 'Recommendation',
		'reviewer.competingInterests': 'Competing Interests',
		'reviewer.submission.acceptedOn': 'Review Accepted On',
		'reviewer.submission.responseDueDate': 'Response Due Date',
		'reviewer.submission.reviewDueDate': 'Review Due Date',
		'reviewer.submission.reviewFiles': 'Review Files',
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
		'reviewerManager.reviewerStatus': 'Reviewer status',
		'search.searchResults': 'Search Results',
		semicolon: '{$label}: ',
		'stage.copyediting': 'Copyediting Stage',
		'stage.production': 'Production Stage',
		'stage.review': 'Review Stage',
		'stage.review.internal': 'Internal Review Stage',
		'stage.review.external': 'External Review Stage',
		'stage.submission': 'Submission Stage',
		'stageParticipants.notify.message': 'Message',
		'stats.context.downloadReport.description':
			'Download a CSV/Excel spreadsheet with usage statistics for this journal matching the following parameters.',
		'stats.context.downloadReport.downloadContext': 'Download Journal',
		'stats.context.downloadReport.downloadContext.description':
			"The number of journal's index page views.",
		'stats.countWithYearlyAverage': '{$count} ({$average}/year)',
		'stats.dateRange': 'Date Range',
		'stats.descriptionForStat': 'Description for {$stat}',
		'stats.editorialActivity': 'Editorial Activity',
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
		'submission.citations.structured': 'Structured References',
		'submission.citations.structured.citationsMetadataLookup.description':
			'Structuring and Metadata Lookup is enabled for this Journal. The system will process your references and retrieve DOIs and other metadata from external sources. This may take some time, but you can continue working on your submission and return to this page later to view the updated structured citations.',
		'submission.citations.structured.collapseAll': 'Collapse All',
		'submission.citations.structured.deleteAllDialog.confirm':
			"This will remove all references currently listed. You'll need to re-enter and process your citations again if you continue.",
		'submission.citations.structured.deleteAllDialog.title':
			'Delete all Structured Citations',
		'submission.citations.structured.deleteAllLink':
			'Delete All Structured References',
		'submission.citations.structured.description':
			'Enter each reference on a new line so that they can be individually processed. You can add one or multiple references at a time. Click "Add" button to process and move them into the table below. To edit existing entries, please use the "Edit" option in the table to modify individual entries.',
		'submission.citations.structured.descriptionTable':
			'The above references have been organised here in a structured format.',
		'submission.citations.structured.disableModal.confirm':
			"This will disable structured citations for this submission. This will also remove all references currently listed. You'll need to re-enter and process your citations again if you continue.",
		'submission.citations.structured.disableModal.title':
			'Disable usage of Structured Citations',
		'submission.citations.structured.editModal.title': 'Edit citation',
		'submission.citations.structured.emptyCitations':
			'The citations list is empty, please add citations above.',
		'submission.citations.structured.enableCitationsMetadataLookup':
			'Enable Metadata Lookup',
		'submission.citations.structured.enableModal.confirm':
			'This will enable structured citations for this submission. ',
		'submission.citations.structured.enableModal.title':
			'Enable usage of Structured Citations',
		'submission.citations.structured.expandAll': 'Expand All',
		'submission.citations.structured.label.authorOrcid':
			'ORCID profile for {$givenName} {$familyName}',
		'submission.citations.structured.label.date': 'Publication Date',
		'submission.citations.structured.label.issueNumber': 'Issue Number',
		'submission.citations.structured.label.openAlex': 'OpenAlex',
		'submission.citations.structured.label.pages': 'Pages',
		'submission.citations.structured.label.volume': 'Volume',
		'submission.citations.structured.label.wikidata': 'Wikidata',
		'submission.citations.structured.noStructuredInformationFound':
			'No structured information found',
		'submission.citations.structured.processed.description':
			'All references have been processed and added below. You can review, edit or remove them at any time.',
		'submission.citations.structured.processed.title':
			'All {$total} references successfully processed',
		'submission.citations.structured.processing.description':
			"We're retrieving metadata for each reference. This may take a few moments. While we aim to match as many references as possible, some entries may not return metadata. Feel free to continue working in the meantime.",
		'submission.citations.structured.processing.title':
			'Processing references - {$processed}/{$total}',
		'submission.citations.structured.reprocessDialog.title':
			'Are you sure you want to reprocess this citation?',
		'submission.citations.structured.search.placeholder':
			'Search references here',
		'submission.contributors': 'List of Contributors',
		'submission.copyediting': 'Copyediting',
		'submission.files': 'Files',
		'submission.files.downloadAll': 'Download All Files',
		'submission.finalDraft': 'Draft Files',
		'submission.history': 'History',
		'submission.identifiers': 'Identifiers',
		'submission.layout.galleys': 'Galleys',
		'submission.layout.newGalley': 'Create New Galley',
		'submission.list.assignEditor': 'Assign Editor',
		'submission.list.changeSubmissionLanguage.buttonLabel': 'Change',
		'submission.list.changeSubmissionLanguage.currentLanguage':
			'Current Submission Language:',
		'submission.list.changeSubmissionLanguage.metadataDescription.abstract':
			'Including the abstract in {$language} is recommended. This helps ensure that the content is accessible',
		'submission.list.changeSubmissionLanguage.metadataDescription.title':
			'Enter submission title here in {$language}. You can format your title as needed',
		'submission.list.changeSubmissionLanguage.title':
			'Change Submission Language For',
		'submission.list.completeSubmission': 'Complete submission',
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
		'submission.production': 'Production',
		'submission.publication': 'Publication',
		'submission.query.activityName': 'Activity',
		'submission.query.closed': 'Closed',
		'submission.query.started': 'Started',
		'submission.query.task': 'Task',
		'submission.review': 'Review',
		'submission.reviewRound.authorResponse': "Author's Response",
		'submission.stage.externalReviewWithRound': 'Review (Round {$round})',
		'submission.stage.internalReviewWithRound':
			'##submission.stage.internalReviewWithRound##',
		'submission.stage.published': 'Published',
		'submission.stageParticipants.notify': 'Notify',
		'submission.status.scheduled': 'Scheduled',
		'submission.status.unassigned': 'Unassigned',
		'submission.submission': 'Submission',
		'submission.submit.creditRoles.button.add': 'Add Another Role',
		'submission.submit.creditRoles.button.remove': 'Remove Role',
		'submission.submit.creditRoles.degree': 'Degree',
		'submission.submit.creditRoles.description':
			'Select the CRediT roles of the contributor and the degrees of contribution.',
		'submission.submit.creditRoles.role': 'Role',
		'submission.submit.creditRoles.selectDegree': 'Degree',
		'submission.submit.creditRoles.selectRole': 'Select a new role (required)',
		'submission.submit.creditRoles.title':
			'CRediT roles and the degrees of contribution',
		'submission.submit.newSubmissionSingle': 'New Submission',
		'submission.submit.submissionFiles': 'Submission Files',
		'submission.submit.uploadSubmissionFile': 'Upload Submission File',
		'submission.upload.percentComplete': 'Uploading {$percent}% complete',
		'submission.upload.productionReady': 'Upload a Production Ready File',
		'submission.upload.proof': 'Upload a File Ready for Publication',
		'submission.wizard.cancel.confirmation':
			'Are you sure you wish to cancel this submission? This will delete the submission and all associated data. This action cannot be undone.',
		'submission.wizard.changeSubmission': 'Change Submission Settings',
		'submission.wizard.submissionCancel': 'Cancel submission',
		'submissions.declined': 'Declined',
		'submissions.incomplete': 'Incomplete',
		'task.closeThisTask': 'Close this Task',
		'task.completeThisTask': 'Complete this task',
		'task.confirmCloseTask':
			"Are you sure you want to close this task? Closing the task won't end the discussion - you can still send messages on it.",
		'task.confirmReopenTask': 'Are you sure you want to reopen this task?',
		'task.confirmStartTask': 'Are you sure you want to start this task?',
		'task.owner': 'Task Owner',
		'task.reopenThisTask': 'Reopen this task',
		'task.startThisTask': 'Start this task',
		'task.startedBy': 'Task started by',
		'taskTemplate.apply': 'Apply Template',
		'taskTemplate.applyConfirmation':
			"Applying this template will replace information in related fields on the form. These changes won't be saved unless you choose to save. Continue?",
		'taskTemplates.add': 'Add template',
		'taskTemplates.addInStage': 'Add Task and Discussion Template in {$stage}',
		'taskTemplates.confirmAutoAdd': 'Confirm Automatic Addition',
		'taskTemplates.confirmAutoAddDisable':
			'Are you sure you want to stop automatically adding this task/discussion template when a submission reaches the <b>{$stage}</b>?',
		'taskTemplates.confirmAutoAddEnable':
			'Are you sure you want this task/discussion template to be automatically added when a submission reaches the <b>{$stage}</b>?',
		'taskTemplates.confirmEmailTemplate':
			'Applying this email template will replace the discussion text in the form. The changes will not be saved unless you choose to save. Do you want to continue?',
		'taskTemplates.description':
			'Use this space to create templates for tasks and discussions. These templates automatically fill in the task name, due date, description, and roles, giving you a head start.',
		'taskTemplates.dueDateFromCreationDate':
			'{$dueDate} from the creation date',
		'taskTemplates.edit': 'Edit Task and Discussion Template',
		'taskTemplates.templateAutoAdd':
			'Automatically add this task and discussion when a submission reaches a specific stage',
		'taskTemplates.templateAutoAddAtStage': 'Auto-add at stage',
		'taskTemplates.templateAutoAddInStage':
			'Automatically add this task and/or discussion when a submission reaches the stage',
		'taskTemplates.templateName': 'Template name',
		'taskTemplates.title': 'Tasks and Discussions Templates',
		'user.affiliation': 'Affiliation',
		'user.affiliations': 'Affiliations',
		'user.affiliations.deleteModal.message':
			'The affiliation <strong>{$affiliation}</strong> will be deleted.',
		'user.affiliations.deleteModal.title': 'Are you sure?',
		'user.affiliations.description':
			'Enter the full name of the institution below, avoiding any acronyms. Select the name from the dropdown and click "Add" to include the affiliation in your profile. (e.g. "Simon Fraser University")',
		'user.affiliations.institution': 'Institution',
		'user.affiliations.primaryLocaleRequired':
			'The primary language {$primaryLocale} is required',
		'user.affiliations.searchPhraseLabel':
			'Type the institute name in {$language}',
		'user.affiliations.translation': 'More information',
		'user.affiliations.translationActionsAriaLabel': 'Click to edit or delete',
		'user.affiliations.translationDeleteActionLabel': 'Remove institution',
		'user.affiliations.translationEditActionLabel': 'Edit institution name',
		'user.affiliations.translationsAllAvailable': 'All translations available',
		'user.affiliations.translationsSomeAvailable':
			'{$count} of {$total} languages completed',
		'user.affiliations.typeTranslationNameInLanguageLabel':
			'Type the institute name in {$language}',
		'user.authorization.accessibleWorkflowStage':
			"You don't currently have access to that stage of the workflow.",
		'user.bioStatement': 'Bio Statement',
		'user.disabledModal.description': 'Current Roles : {$roles}',
		'user.disabledModal.title': 'Disable {$fullName}',
		'user.email': 'Email',
		'user.enabledModal.title': 'Enable {$fullName}',
		'user.familyName': 'Family Name',
		'user.givenName': 'Given Name',
		'user.gossip': 'Editorial Notes',
		'user.interests': 'Reviewing interests',
		'user.logOut': 'Logout',
		'user.logOutAs': 'Logout as {$username}',
		'user.mailingAddress': 'Mailing Address',
		'user.orcid': 'ORCID iD',
		'user.password': 'Password',
		'user.phone': 'Phone',
		'user.profile.editProfile': 'Edit Profile',
		'user.removeRole.message':
			"Are you sure you want to permanently remove this role? This action will revoke the user's access to all information and permissions associated with this role.",
		'user.removeRole.roleRemainMessage':
			'You cannot remove the role. At least one role must be assigned to the user.',
		'user.role.reviewer': 'Reviewer',
		'user.role.reviewers': 'Reviewers',
		'user.roles': 'Roles',
		'user.signature': 'Signature',
		'user.url': 'Homepage URL',
		'user.username': 'Username',
		'user.workingLanguages': 'Working Languages',
		'userAccess.management.options': '##userAccess.management.options##',
		'userAccess.search':
			"Enter a user's name, role (e.g Journal editor), or affiliation",
		'userAccess.tableHeader.name': 'Name',
		'userAccess.tableHeader.startDate': 'Start Date',
		'userInvitation.cancel.goBack': 'Go Back',
		'userInvitation.cancel.message':
			'Are you sure want to cancel this invitation?',
		'userInvitation.edit.message':
			'If you edit the existing invitation or add a new role, the current invitation will be canceled and, a new one will be sent. Are you sure you want to proceed?',
		'userInvitation.edit.title': 'Edit Invitation',
		'userInvitation.modal.button': 'View All Users',
		'userInvitation.modal.message':
			"{$email} has been invited to new role in OJS. You can be updated about the user's decision on the Users & Roles page, your OJS notifications and/or your email",
		'userInvitation.modal.title': 'Invitation Sent',
		'userInvitation.roleTable.endDate': 'End Date',
		'userInvitation.roleTable.journalMasthead': 'Journal Masthead',
		'userInvitation.roleTable.role': 'Role',
		'userInvitation.roleTable.startDate': 'Start Date',
		'userInvitation.search.userFound': 'The user already exists in the journal',
		'userInvitation.search.userNotFound':
			'The user does not have a role in this journal',
		'userInvitation.searchField':
			'Search for a user by email address, username, or ORCID iD. Enter only one to get started!',
		'userInvitation.searchField.description':
			'e.g. aeinstein@example.com or aeinstein or 0000-0002-1825-0097',
		'userInvitation.status.invited': 'Invited {$date}',
		'userInvitation.user.disableMessage':
			'The user was disabled. You cannot assign them a role while they are disabled. Please enable the user first to invite them to a role.',
		'userInvitation.user.disableTitle': 'The user is currently disabled.',
		'userComment.addYourComment': 'Add your comment',
		'userComment.allComments': '{$commentCount} comments',
		'userComment.awaitingApprovalNotice': 'Your comment is awaiting approval.',
		'userComment.deleteComment': 'Delete comment',
		'userComment.deleteCommentConfirmation':
			'Are you sure you want to delete this comment?',
		'userComment.discussionClosed': 'Discussion is closed for this version.',
		'userComment.login': 'Log in to comment',
		'userComment.report': 'Report',
		'userComment.report.reason': 'Reason for report',
		'userComment.reportComment': 'Report comment',
		'userComment.reportCommentBy': 'Comment by {$userName}',
		'userComment.reportCommentByUserWithAffiliation':
			'Comment by {$userName}, {$affiliation}',
		'userComment.versionWithCount':
			'Version {$versionLabel} ({$versionCommentsCount})',
		'validator.filled': 'This field is required.',
		'validator.required': 'This field is required.',
		'workflow.attachUploadedFiles':
			'Attach files uploaded during the submission workflow, such as revisions or files to be reviewed.',
		'workflow.attachWorkflowFiles': 'Attach Workflow Files',
		'workflow.files': 'Workflow Files',
		'workflow.review.externalReview': 'Review',
		'workflow.review.internalReview': 'Internal Review',
		'workflow.reviewRoundN': 'Review Round {$number}',
		'workflow.stage': 'Stage',
		'workflow.stageNotStarted':
			'The {$stage} stage has not yet been initiated.',
		'workflow.submissionInFutureStage':
			'The submission is currently in the {$stage} stage.',
		'workflow.submissionInNextReviewRound':
			'The submission has been advanced to the next round of review',
		'workflow.submissionNextReviewRoundInFutureStage':
			'The submission advanced to the next review round, was accepted, and is currently in the {$stage} stage.',
		'workflow.uploadRevisions': 'Upload revisions',
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
