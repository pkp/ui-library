import DashboardPage from './DashboardPage.vue';
import {http, HttpResponse} from 'msw';
import SubmissionsMock25 from './mocks/submissions25.js';
import PageInitConfigEditorialMock from './mocks/pageInitConfigEditorial.js';
import PageInitConfigReviewAssignmentsMock from './mocks/pageInitConfigReviewAssignments';
import PageInitConfigMySubmissionsMock from './mocks/pageInitConfigMySubmissions';

import {EditorialActivityScenario} from './mocks/submissionScenariosMock';
import {ReviewAssignmentEditorialActivityScenario} from './mocks/reviewAssignmentScenariosMock';

export default {
	title: 'Pages/Dashboard',
	component: DashboardPage,
	render: (args) => ({
		components: {DashboardPage},
		setup() {
			return {args};
		},
		template: '<DashboardPage v-bind="args" />',
	}),
	parameters: {
		date: new Date('February 20, 2024 10:00:00'),
	},
};

export const Init = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions',
					({request}) => {
						const url = new URL(request.url);
						const offset = parseInt(url.searchParams.get('offset') || 0);
						const count = parseInt(url.searchParams.get('count'));
						const submissions = SubmissionsMock25.slice(offset, offset + count);

						return HttpResponse.json({
							itemsMax: SubmissionsMock25.length,
							items: submissions,
						});
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const url = new URL(request.url);
						const offset = parseInt(url.searchParams.get('offset') || 0);
						const count = parseInt(url.searchParams.get('count'));
						const submissions = SubmissionsMock25.slice(offset, offset + count);

						return HttpResponse.json({
							itemsMax: SubmissionsMock25.length,
							items: submissions,
						});
					},
				),
			],
		},
	},
	args: PageInitConfigEditorialMock,
};

const SubmissionScenariosDescription = `<ul class="text-sm-normal">
			<li>1. Incomplete submission</li>
			<li>2. Declined in submission stage</li>
			<li>3. Submission stage</li>
			<li>4. Submission stage - no editors assigned</li>
			<li>5. Review stage - REVIEW_ROUND_STATUS_REVISIONS_REQUESTED: Revisions requested for the same round</li>
			<li>6. Review stage - REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW: Revisions requested, to be used in next round</li>
			<li>7. Review stage - REVIEW_ROUND_STATUS_DECLINED: Declined in review stage</li>
			<li>8. Review stage - REVIEW_ROUND_STATUS_PENDING_REVIEWERS: No reviewers have been assigned</li>
			<li>9. Review stage - REVIEW_ROUND_STATUS_PENDING_REVIEWS: Waiting for reviews to be submitted by reviewers</li>
			<li>10. Review stage - REVIEW_ROUND_STATUS_REVIEWS_READY: One or more reviews is ready for an editor to view</li>
			<li>11. Review stage - REVIEW_ROUND_STATUS_REVIEWS_COMPLETED: All assigned reviews have been confirmed by an editor</li>
			<li>12. Review stage - REVIEW_ROUND_STATUS_REVIEWS_OVERDUE: One or more reviews is overdue</li>
			<li>13. Review stage - REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED: at least one revision file has been uploaded</li>
			<li>14. Review stage - REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED:  at least one revision file has been uploaded.</li>
			<li>15. Review stage - REVIEW_ROUND_STATUS_RETURNED_TO_REVIEW:The following status is set when a submission return back from copyediting stage to last review round again </li>
			<li>16. Review stage - REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS: Waiting for recommendations to be submitted by recommendOnly editors</li>
			<li>17. Review stage - REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY: One or more recommendations are ready for an editor to view</li>
			<li>18. Review stage - REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED: All assigned recommendOnly editors have made a recommendation</li>
			<li>19. Review stage -  Recommend only editor provided recommendation (relevant only for recommend only editor)</li>
			<li>20. Review stage - Open reviews</li>
			<li>21. Copyediting stage </li>
			<li>22. Production stage</li>
		</ul>`;

export const EditorEditorialActivity = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = EditorialActivityScenario;

						return HttpResponse.json({
							itemsMax: 1,
							consts: pkp.const,
							items: submissions,
						});
					},
				),
			],
		},
	},
	render: (args) => ({
		components: {DashboardPage},
		setup() {
			return {args};
		},
		template: `${SubmissionScenariosDescription}
		<DashboardPage v-bind="args" />`,
	}),

	args: PageInitConfigEditorialMock,
};

export const AuthorEditorialActivity = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = JSON.parse(
							JSON.stringify(EditorialActivityScenario),
						);

						return HttpResponse.json({
							itemsMax: submissions.length,
							consts: pkp.const,
							items: submissions,
						});
					},
				),
			],
		},
	},
	render: (args) => ({
		components: {DashboardPage},
		setup() {
			return {args};
		},
		template: `${SubmissionScenariosDescription}
		<DashboardPage v-bind="args" />`,
	}),
	args: {...PageInitConfigMySubmissionsMock},
};

export const DecidingEditorEditorialActivity = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = JSON.parse(
							JSON.stringify(EditorialActivityScenario),
						);

						submissions.forEach((submission) => {
							submission.stages[1].isCurrentUserDecidingEditor = true;
						});

						return HttpResponse.json({
							itemsMax: 1,
							consts: pkp.const,
							items: submissions,
						});
					},
				),
			],
		},
	},
	render: (args) => ({
		components: {DashboardPage},
		setup() {
			return {args};
		},
		template: `${SubmissionScenariosDescription}
		<DashboardPage v-bind="args" />`,
	}),
	args: PageInitConfigEditorialMock,
};

export const RecommendingEditorEditorialActivity = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = JSON.parse(
							JSON.stringify(EditorialActivityScenario),
						);
						submissions.forEach((submission) => {
							submission.stages[1].currentUserCanRecommendOnly = true;
						});

						return HttpResponse.json({
							itemsMax: 1,
							consts: pkp.const,
							items: submissions,
						});
					},
				),
			],
		},
	},
	render: (args) => ({
		components: {DashboardPage},
		setup() {
			return {args};
		},
		template: `${SubmissionScenariosDescription}
		<DashboardPage v-bind="args" />`,
	}),
	args: PageInitConfigEditorialMock,
};

export const ReviewAssignmentStatusesReviewer = {
	render: (args) => ({
		components: {DashboardPage},
		setup() {
			return {args};
		},
		template: `
		<ul class="text-sm-normal">
			<li><b>1.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE</b> - request has been sent but reviewer has not responded </li>
			<li><b>2.REVIEW_ASSIGNMENT_STATUS_DECLINED</b> -  reviewer declined review request</li>
			<li><b>3.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE</b> -  review not responded within due date</li>
			<li><b>4.REVIEW_ASSIGNMENT_STATUS_ACCEPTED</b> - reviewer has agreed to the review</li>
			<li><b>5.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE</b> - review not submitted within due date </li>
			<li><b>6.REVIEW_ASSIGNMENT_STATUS_RECEIVED</b> - review has been submitted</li>
			<li><b>7.REVIEW_ASSIGNMENT_STATUS_COMPLETE</b> - review has been confirmed by an editor</li>
			<li><b>8.REVIEW_ASSIGNMENT_STATUS_THANKED</b> - reviewer has been thanked </li>
			<li><b>9.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND</b> - request resent to reviewer after they declined</li>
			<li><b>10.REVIEW_ASSIGNMENT_STATUS_VIEWED</b> -editor viewed the review, but not confirm</li>
			<li><b>11.REVIEW_ASSIGNMENT_STATUS_CANCELLED</b> - reviewer cancelled review request // should not be displayed </li>
	</ul>
		
		<DashboardPage v-bind="args" />`,
	}),

	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/reviewerAssignments',
					({request}) => {
						const submissions = JSON.parse(
							JSON.stringify(ReviewAssignmentEditorialActivityScenario),
						);

						return HttpResponse.json({
							itemsMax: submissions.length,
							consts: pkp.const,
							items: submissions,
						});
					},
				),
			],
		},
	},
	args: {...PageInitConfigReviewAssignmentsMock},
};
