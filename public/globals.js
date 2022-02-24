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
		id: 1,
		roles: [1, 16, 65536, 1048576],
		username: 'dbarnes',
		preferredName: 'Daniel Barnes'
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
		REVIEW_ROUND_STATUS_PENDING_REVIEWERS: 6,
		REVIEW_ROUND_STATUS_REVIEWS_READY: 8,
		REVIEW_ROUND_STATUS_REVIEWS_COMPLETED: 9,
		REVIEW_ROUND_STATUS_REVIEWS_OVERDUE: 10,
		REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED: 11,
		REVIEW_ROUND_STATUS_REVISIONS_REQUESTED: 1,
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
		DOI_STATUS_STALE: 5
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
		zip: 'file-archive-o' // DOCUMENT_TYPE_ZIP
	},

	/**
	 * Locale keys loaded on the server-side
	 */
	localeKeys: {
		'common.cancel': 'Cancel',
		'common.clearSearch': 'Clear search',
		'common.close': 'Close',
		'common.commaListSeparator': ', ',
		'common.confirm': 'Confirm',
		'common.delete': 'Delete',
		'common.edit': 'Edit',
		'common.editItem': 'Edit {$name}',
		'common.error': 'Error',
		'common.filter': 'Filters',
		'common.filterAdd': 'Add filter: {$filterTitle}',
		'common.filterRemove': 'Clear filter: {$filterTitle}',
		'common.loading': 'Loading',
		'common.no': 'No',
		'common.noItemsFound': 'No items found.',
		'common.none': 'None',
		'common.ok': 'Ok',
		'common.orderUp': 'Increase position of {$itemTitle}',
		'common.orderDown': 'Decrease position of {$itemTitle}',
		'common.pageNumber': 'Page {$pageNumber}',
		'common.pagination.goToPage': 'Go to {$page}',
		'common.pagination.label': 'View additional pages',
		'common.pagination.next': 'Next page',
		'common.pagination.previous': 'Previous page',
		'common.remove': 'Remove',
		'common.required': 'Required',
		'common.save': 'Save',
		'common.saving': 'Saving',
		'common.search': 'Search',
		'common.selectWithName': 'Select {$name}',
		'common.unknownError':
			'An unexpected error has occurred. Please reload the page and try again.',
		'common.view': 'View',
		'list.viewLess': 'Hide expanded details about {$name}',
		'list.viewMore': 'Show more details about {$name}',
		'common.viewWithName': 'View {$name}',
		'common.yes': 'Yes',
		'form.dataHasChanged':
			'The data on this form has changed. Do you wish to continue without saving?',
		'form.errorA11y': 'Go to {$fieldLabel}: {$errorMessage}',
		'form.errorGoTo': 'View Next Error',
		'form.errorMany': 'There are {$count} errors that must be corrected.',
		'form.errorOne': 'There is one error that must be corrected.',
		'form.errors':
			'The form was not saved because {$count} error(s) were encountered. Please correct these errors and try again.',
		'form.multilingualLabel': '{$label} in {$localeName}',
		'form.multilingualProgress': '{$count}/{$total} languages completed',
		'form.saved': 'Saved',
		'help.help': 'Help',
		'validator.required': 'This field is required.',
		'common.order': 'Order',
		'author.users.contributor.setPrincipalContact': 'Set Primary Contact',
		'author.users.contributor.principalContact': 'Primary Contact',
		'submission.contributors': 'Contributors',
		'grid.action.saveOrdering': 'Save Order',
		'grid.action.order': 'Order',
		'contributor.listPanel.preview': 'Preview'
	}
};

/**
 * Spoof some of the variables in the $.pkp object from the app
 */
window.$.pkp = {
	app: {
		currentLocale: 'en_US',
		primaryLocale: 'en_US',
		rtlLocales: []
	},
	pkpHandler() {
		alert(
			'This action can not be completed in the UI library because it requires a legacy JS component that is part of the OJS or OMP application.'
		);
	},
	classes: {
		Helper: {
			// A fake uuid generator to mock the one in the Helper component of the
			// OJS/OMP applications. This is not guaranteed to be unique and should
			// not be used in production
			uuid() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16);
			}
		}
	}
};
