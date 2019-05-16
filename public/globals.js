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
	 * Dummy global function used by components
	 */
	userHasRole: function(roles) {
		return true;
	},

	/**
	 * Dummy constants required by components
	 */
	const: {
		ROLE_ID_MANAGER: 16,
		ROLE_ID_SITE_ADMIN: 1,
		ROLE_ID_AUTHOR: 65536,
		ROLE_ID_REVIEWER: 4096,
		ROLE_ID_ASSISTANT: 4097,
		ROLE_ID_READER: 1048576,
		ROLE_ID_SUB_EDITOR: 17,
		ROLE_ID_SUBSCRIPTION_MANAGER: 2097152,
		WORKFLOW_STAGE_ID_SUBMISSION: 1,
		WORKFLOW_STAGE_ID_INTERNAL_REVIEW: 2,
		WORKFLOW_STAGE_ID_EXTERNAL_REVIEW: 3,
		WORKFLOW_STAGE_ID_EDITING: 4,
		WORKFLOW_STAGE_ID_PRODUCTION: 5,
		STAGE_STATUS_SUBMISSION_UNASSIGNED: 1,
		REVIEW_ROUND_STATUS_PENDING_REVIEWERS: 6,
		REVIEW_ROUND_STATUS_REVIEWS_READY: 8,
		REVIEW_ROUND_STATUS_REVIEWS_COMPLETED: 9,
		REVIEW_ROUND_STATUS_REVIEWS_OVERDUE: 10,
		REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED: 11,
		REVIEW_ROUND_STATUS_REVISIONS_REQUESTED: 1,
		REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE: 0,
		REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE: 4,
		REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE: 6,
		REVIEW_ASSIGNMENT_STATUS_ACCEPTED: 5,
		REVIEW_ASSIGNMENT_STATUS_RECEIVED: 7,
		REVIEW_ASSIGNMENT_STATUS_COMPLETE: 8,
		REVIEW_ASSIGNMENT_STATUS_THANKED: 9,
		REVIEW_ASSIGNMENT_STATUS_CANCELLED: 10,
		ASSOC_TYPE_PRESS: 512,
		ASSOC_TYPE_CATEGORY: 525,
		ASSOC_TYPE_SECTION: 530,
		ASSOC_TYPE_SERIES: 530 // OMP - always matches ASSOC_TYPE_SECTION
	}
};

/**
 * Spoof some of the variables in the $.pkp object from the app
 */
window.$.pkp = {
	app: {
		currentLocale: 'en_US',
		primaryLocale: 'en_US',
		cdnEnabled: true
	},
	currentUser: {
		csrfToken: '1234'
	},
	locale: {
		ok: 'Ok'
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
