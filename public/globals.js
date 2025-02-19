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
			'Congratulations on your new role in OJS! You might now have access to new options. If you need assistance navigating the system, please click on the \u201cHelp\u201d buttons throughout the interface for guidance',
		'acceptInvitation.modal.title': "You've been assigned a new role in OJS",
		'acceptInvitation.passwordField.description':
			'It should be at least 6 characters long and could be a combination of uppercase letters, lowercase letters, numbers and symbols',
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
		'admin.jobs.failed.action.redispatch': 'Try Again',
		'admin.jobs.failed.action.redispatch.all': 'Requeue All Failed Jobs',
		'admin.version': 'Version',
		'article.article': 'Article',
		'article.metadata': 'Metadata',
		'author.users.contributor.principalContact': 'Primary Contact',
		'author.users.contributor.setPrincipalContact': 'Set Primary Contact',
		'common.add': 'Add',
		'common.addCCBCC': 'Add CC/BCC',
		'common.assign': 'Assign',
		'common.attachFiles': 'Attach Files',
		'common.back': 'Back',
		'common.cancel': 'Cancel',
		'common.clearSearch': 'Clear search phrase',
		'common.close': 'Close',
		'common.commaListSeparator': ', ',
		'common.complete': 'Complete',
		'common.confirm': 'Confirm',
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
		'common.numero': 'No',
		'common.ok': 'OK',
		'common.order': 'Order',
		'common.orderDown': 'Decrease position of {$itemTitle}',
		'common.orderUp': 'Increase position of {$itemTitle}',
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
		'dashboard.actions.finishReview': 'Finish review',
		'dashboard.actions.respondToRequest': 'Respond to request',
		'dashboard.applyFilters': 'Apply Filters',
		'dashboard.assignReviewers': 'Assign Reviewers',
		'dashboard.declinedDuringStage': 'Declined during the {$stageName} stage.',
		'dashboard.newReviewRoundToBeCreated': 'New review round to be created',
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
		'editor.submission.addReviewer': 'Add Reviewer',
		'editor.submission.addStageParticipant': 'Assign Participant',
		'editor.submission.createNewRound': 'Create New Review Round',
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
		'editor.submission.revisions': 'Revisions',
		'editor.submission.roundStatus.recommendationMadeByYou':
			'Recommendation has been made by you.',
		'editor.submission.roundStatus.reviewsCompleted':
			'All reviews are confirmed and a decision is needed.',
		'editor.submission.schedulePublication': 'Schedule For Publication',
		'editor.submission.search':
			'Search submissions, ID, authors, keywords, etc.',
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
		'fileManager.submissionFilesDescription':
			'Files uploaded at the time of submission',
		'form.dataHasChanged':
			'The data on this form has changed. Do you wish to continue without saving?',
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
		'grid.action.addContributor': 'Add Contributor',
		'grid.action.addGalley': 'Add galley',
		'grid.action.delete': 'Delete',
		'grid.action.deleteContributor': 'Delete Contributor',
		'grid.action.deleteContributor.confirmationMessage':
			'Are you sure you want to remove {$name} as a contributor? This action can not be undone.',
		'grid.action.disable': 'Disable',
		'grid.action.edit': 'Edit',
		'grid.action.editFile': 'Edit a file',
		'grid.action.enable': 'Enable',
		'grid.action.logInAs': 'Login As',
		'grid.action.mergeUser': 'Merge user',
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
		'grid.user.currentUsers': 'Current Users',
		'grid.user.disable': 'Disable',
		'grid.user.email': 'Email',
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
			'Not verified. You can verify your ORCID iD from your profile section in OJS',
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
		'manager.people.confirmRemove':
			'Remove this user from this journal? This action will unenroll the user from all roles within this journal.',
		'manager.publication.productionStage': 'Production',
		'manager.publication.reviewStage': 'Review',
		'manager.publication.submissionStage': 'Submission',
		'manager.roles': 'Roles',
		'manager.statistics.counterR5Report.settings': 'Report Settings',
		'manager.statistics.counterR5Reports': 'Counter R5 Reports',
		'manager.statistics.counterR5Reports.description':
			'See <a href="https://cop5.projectcounter.org/en/5.0.3/04-reports/index.html" target="_new">COUNTER 5.0.3 documentation</a> for more information about each report.',
		'manager.statistics.counterR5Reports.usageNotPossible':
			'There are no COUNTER R5 usage statistics available yet.',
		'manager.workflow': 'Workflow',
		'navigation.dashboards': 'Dashboards',
		'navigation.mySubmissions': 'My Submissions',
		'navigation.reviewAssignments': 'Review Assignments',
		'notification.notifications': 'Notifications',
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
		'orcid.field.verification.requested':
			'ORCID Verification has been requested!',
		'orcid.field.verification.resendRequest': 'Resend Verification Email',
		'participantManager.onlyAllowedToRecommend':
			'Only allowed to recommend an editorial decision',
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
		'publication.version.all': 'All Versions',
		'publication.version.confirm':
			'Are you sure you want to create a new version?',
		'reviewer.article.decision.accept': 'Accept Submission',
		'reviewer.article.decision.decline': 'Decline Submission',
		'reviewer.article.decision.pendingRevisions': 'Revisions Required',
		'reviewer.article.decision.resubmitElsewhere': 'Resubmit Elsewhere',
		'reviewer.article.decision.resubmitHere': 'Resubmit for Review',
		'reviewer.article.decision.seeComments': 'See Comments',
		'reviewer.article.recommendation': 'Recommendation',
		'reviewer.competingInterests': 'Competing Interests',
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
		'reviewerManager.reviewerStatus': 'Reviewer status',
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
		'submission.recommendation': 'Recommendation: {$recommendation}',
		'submission.review': 'Review',
		'submission.stage.externalReviewWithRound': 'Review (Round {$round})',
		'submission.stage.internalReviewWithRound':
			'##submission.stage.internalReviewWithRound##',
		'submission.stage.published': 'Published',
		'submission.stage.scheduledForPublication': 'Scheduled For Publication',
		'submission.stageParticipants.notify': 'Notify',
		'submission.status.scheduled': 'Scheduled',
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
		'user.email': 'Email',
		'user.familyName': 'Family Name',
		'user.givenName': 'Given Name',
		'user.gossip': 'Editorial Notes',
		'user.logOut': 'Logout',
		'user.orcid': 'ORCID iD',
		'user.password': 'Password',
		'user.removeRole.message':
			'Are you sure want remove this role permanently?',
		'user.role.reviewer': 'Reviewer',
		'user.role.reviewers': 'Reviewers',
		'user.roles': 'Roles',
		'user.username': 'Username',
		'userAccess.management.options': '##userAccess.management.options##',
		'userAccess.search': 'Search User',
		'userAccess.tableHeader.name': 'Name',
		'userAccess.tableHeader.startDate': 'Start Date',
		'userInvitation.cancel.goBack': 'Go Back',
		'userInvitation.cancel.message':
			'Are you sure want to cancel this invitation?',
		'userInvitation.edit.message':
			'If you edit the existing invitation or add a new role, the current invitation will be canceled and, a new one will be sent. Are you sure you want to proceed?',
		'userInvitation.edit.title': 'Edit Invitation',
		'userInvitation.emailField.description': 'e.g. aeinstein@example.com',
		'userInvitation.modal.button': 'View All Users',
		'userInvitation.modal.message':
			"{$email} has been invited to new role in OJS. You can be updated about the user's decision on the User and Role page, your OJS notification and/or your email",
		'userInvitation.modal.title': 'Invitation Sent',
		'userInvitation.orcidField.description': 'e.g. 0000-0000-0000-0000',
		'userInvitation.roleTable.endDate': 'End Date',
		'userInvitation.roleTable.journalMasthead': 'Journal Masthead',
		'userInvitation.roleTable.role': 'Role',
		'userInvitation.roleTable.startDate': 'Start Date',
		'userInvitation.search.userFound': 'The user already exists in the journal',
		'userInvitation.search.userNotFound':
			'The user does not have a role in this journal',
		'userInvitation.status.invited': 'Invited {$date}',
		'userInvitation.usernameField.description': 'e.g. mickeymouse',
		'validator.required': 'This field is required.',
		'workflow.review.externalReview': 'Review',
		'workflow.review.internalReview': 'Internal Review',
		'workflow.reviewRoundN': 'Review Round {$number}',
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
