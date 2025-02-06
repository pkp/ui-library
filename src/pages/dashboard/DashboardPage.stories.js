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
};

export const Init = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('January 20, 2024 10:00:00'),
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

export const ReviewRoundStatusesEditor = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('February 20, 2024 10:00:00'),
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
	args: PageInitConfigEditorialMock,
};

export const ReviewRoundStatusesDecidingEditor = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('February 20, 2024 10:00:00'),
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = JSON.parse(
							JSON.stringify(EditorialActivityScenario),
						);

						submissions.forEach((submission) => {
							submission.stages[1].currentUserDecidingEditor = true;
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
	args: PageInitConfigEditorialMock,
};

export const ReviewRoundStatusesAuthor = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('February 20, 2024 10:00:00'),
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = JSON.parse(
							JSON.stringify(EditorialActivityScenario),
						);

						submissions.forEach((submission) => {
							submission.stages[1].currentUserDecidingEditor = true;
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
	args: {...PageInitConfigMySubmissionsMock},
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
		<ul>
		
		<DashboardPage v-bind="args" />`,
	}),

	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('February 20, 2024 10:00:00'),
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
