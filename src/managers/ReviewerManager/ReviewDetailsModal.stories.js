import {http, HttpResponse} from 'msw';
import {within, userEvent} from 'storybook/test';

import ReviewDetailsModal from './ReviewDetailsModal.vue';
import ReviewDetailsEditModal from './ReviewDetailsEditModal.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useModal} from '@/composables/useModal';
import {allModes} from '../../../.storybook/modes.js';

import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getReviewAssignmentFullMock} from '@/mockFactories/reviewAssignmentsMock';
import {getFileMock} from '@/mockFactories/fileMock';
import {reviewFormConfig, reviewFormResponses} from '@/mocks/reviewForm';

const API = 'https://mock/index.php/publicknowledge/api/v1';
const SUBMISSION_ID = 19;
const REVIEW_ID = 17;
const REVIEW_URL = `${API}/submissions/${SUBMISSION_ID}/reviewAssignments/${REVIEW_ID}`;

/** A completed review awaiting the editor's confirmation */
const reviewAssignment = getReviewAssignmentFullMock({
	id: REVIEW_ID,
	submissionId: SUBMISSION_ID,
	statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
	reviewerFullName: 'Julie Janssen',
	reviewerRecommendationId: 2,
	considered: pkp.const.REVIEW_ASSIGNMENT_NEW,
	dateConsidered: null,
	quality: 4,
});

const confirmedReviewAssignment = {
	...reviewAssignment,
	status: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	considered: pkp.const.REVIEW_ASSIGNMENT_CONSIDERED,
	dateConsidered: '2024-01-25 10:12:00',
};

const unrecommendedReviewAssignment = {
	...reviewAssignment,
	reviewerRecommendationId: null,
};

const freeTextReview = {
	reviewAssignmentId: REVIEW_ID,
	reviewFormId: null,
	reviewerRecommendationId: 2,
	comments: '<p>The analysis is careful and full of insight.</p>',
	commentsPrivate: '<p>Happy to review a revised version.</p>',
};

const reviewFormReview = {
	reviewAssignmentId: REVIEW_ID,
	reviewFormId: 3,
	reviewerRecommendationId: 2,
	reviewFormConfig,
	reviewFormResponses,
};

const modalProps = {
	submission: getSubmissionMock({
		stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		// The file manager's actions need the editor assigned to the stage
		stages: [
			{
				id: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				currentUserAssignedRoles: [
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
				],
			},
		],
	}),
	submissionStageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
	reviewRoundId: 10,
	reviewAssignment,
	recommendations: [
		{reviewerRecommendationId: 1, title: {en: 'Accept Submission'}},
		{reviewerRecommendationId: 2, title: {en: 'Revisions Required'}},
		{reviewerRecommendationId: 3, title: {en: 'Resubmit for Review'}},
		{reviewerRecommendationId: 4, title: {en: 'Decline Submission'}},
	],
};

function handlers({
	review = freeTextReview,
	assignment = reviewAssignment,
} = {}) {
	return [
		http.get(REVIEW_URL, () => HttpResponse.json(assignment)),
		http.get(`${REVIEW_URL}/review`, () => HttpResponse.json(review)),

		// useFetch rewrites PUT to POST with an X-Http-Method-Override header, so
		// these are mocked as POST — an http.put handler is never reached
		http.post(`${REVIEW_URL}/review`, async ({request}) => {
			const body = await request.json();
			console.log('[ReviewDetails] save review', body);

			return HttpResponse.json({...assignment, ...body});
		}),
		http.post(`${REVIEW_URL}/consider`, async ({request}) => {
			const {considered} = await request.json();

			return HttpResponse.json(
				considered === pkp.const.REVIEW_ASSIGNMENT_VIEWED
					? {
							...assignment,
							status: pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
							considered,
						}
					: confirmedReviewAssignment,
			);
		}),
		http.post(REVIEW_URL, async ({request}) => {
			const body = await request.json();

			return HttpResponse.json({...assignment, ...body});
		}),

		http.get(
			`${API}/submissions/${SUBMISSION_ID}/files/review/${REVIEW_ID}`,
			() =>
				HttpResponse.json({
					items: [
						getFileMock({
							id: 41,
							name: 'reviewer-annotated-manuscript.pdf',
							fileStage: pkp.const.SUBMISSION_FILE_REVIEW_ATTACHMENT,
						}),
					],
					itemsMax: 1,
				}),
		),

		/** Download Review Form: an export call, then a fetch of the temp file */
		http.get(`${API}/reviews/${SUBMISSION_ID}/${REVIEW_ID}/:op`, () =>
			HttpResponse.json({temporaryFileId: 900}),
		),
		http.get(`${API}/reviews/${SUBMISSION_ID}/exports/900`, () =>
			HttpResponse.text('Stubbed review form export'),
		),
	];
}

/** Opens the Modify Review modal, which View opens over itself */
const renderEditModal = (args) => ({
	components: {PkpButton},
	setup() {
		const {openSideModal} = useModal();

		function modifyReview() {
			openSideModal(ReviewDetailsEditModal, args.modalProps);
		}
		return {modifyReview};
	},
	template: '<PkpButton @click="modifyReview">Modify Review</PkpButton>',
});

const openModifyReview = async ({canvasElement}) => {
	const user = userEvent.setup();

	await user.click(within(canvasElement).getByText('Modify Review'));
};

export default {
	title: 'Managers/ReviewerManager/ReviewDetails',
	component: ReviewDetailsModal,
	render: (args) => ({
		components: {PkpButton},
		setup() {
			const {openSideModal} = useModal();

			function reviewDetails() {
				openSideModal(ReviewDetailsModal, args.modalProps);
			}
			return {reviewDetails};
		},
		template: '<PkpButton @click="reviewDetails">Review Details</PkpButton>',
	}),
	args: {modalProps},
	play: async ({canvasElement}) => {
		const user = userEvent.setup();

		await user.click(within(canvasElement).getByText('Review Details'));
	},
	decorators: [
		() => ({
			template: '<div style="height: 1600px"><story/></div>',
		}),
	],
	parameters: {
		chromatic: {
			modes: {
				desktop: {disable: true},
				'desktop rtl': {disable: true},
				desktopLargeHeight: allModes['desktopLargeHeight'],
				'desktopLargeHeight rtl': allModes['desktopLargeHeight rtl'],
			},
		},
	},
};

export const ReviewDetails = {
	parameters: {msw: {handlers: handlers()}},
};

export const ReviewDetailsWithReviewForm = {
	parameters: {msw: {handlers: handlers({review: reviewFormReview})}},
};

export const ReviewDetailsConfirmed = {
	args: {
		modalProps: {...modalProps, reviewAssignment: confirmedReviewAssignment},
	},
	parameters: {
		msw: {handlers: handlers({assignment: confirmedReviewAssignment})},
	},
};

export const ReviewDetailsWithoutRecommendation = {
	args: {
		modalProps: {
			...modalProps,
			reviewAssignment: unrecommendedReviewAssignment,
		},
	},
	parameters: {
		msw: {handlers: handlers({assignment: unrecommendedReviewAssignment})},
	},
};

export const ModifyReview = {
	render: renderEditModal,
	parameters: {msw: {handlers: handlers()}},
	play: openModifyReview,
};

export const ModifyReviewWithReviewForm = {
	render: renderEditModal,
	parameters: {msw: {handlers: handlers({review: reviewFormReview})}},
	play: openModifyReview,
};
