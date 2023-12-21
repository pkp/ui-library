import SubmissionsListPanel from './SubmissionsListPanel.vue';

import SubmissionsMock from '@/mocks/submissions';
import FieldBaseMock from '@/components/Form/mocks/field-base';
import FieldBaseAutosuggestMock from '@/components/Form/mocks/field-autosuggest';

export default {
	title: 'ListPanel/SubmissionsListPanel',
	component: SubmissionsListPanel,
};

export const Base = {
	render: (args) => ({
		components: {SubmissionsListPanel},
		setup() {
			function setData(id, newData) {
				Object.keys(newData).forEach((key) => {
					if (args[key]) {
						args[key] = newData[key];
					}
				});
			}

			/**
			 * Add required locale keys
			 */
			pkp.localeKeys['common.lastActivity'] =
				'Last activity recorded on {$date}.';
			pkp.localeKeys['submission.list.empty'] = 'No submissions found.';
			pkp.localeKeys['submission.submit.newSubmissionSingle'] =
				'New Submission';
			pkp.localeKeys['submission.review'] = 'Review';
			pkp.localeKeys['submissions.incomplete'] = 'Incomplete';
			pkp.localeKeys['submission.list.assignEditor'] = 'Assign Editor';
			pkp.localeKeys['submission.list.copyeditsSubmitted'] =
				'Copyedited files submitted';
			pkp.localeKeys['submission.list.currentStage'] =
				'Currently in the {$stage} stage.';
			pkp.localeKeys['submission.list.discussions'] = 'Open discussions';
			pkp.localeKeys['submission.list.dualWorkflowLinks'] =
				`You have been assigned multiple roles for this submission. Would you like to access the <a href="{$urlAuthorWorkflow}">Author's workflow</a>  or the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?`;
			pkp.localeKeys['submission.list.galleysCreated'] =
				'Copyedited files submitted';
			pkp.localeKeys['submission.list.infoCenter'] = 'Activity Log & Notes';
			pkp.localeKeys['submission.list.reviewAssignment'] = 'Review Assignment';
			pkp.localeKeys['submission.list.responseDue'] = 'Response Due: {$date}';
			pkp.localeKeys['submission.list.reviewCancelled'] = 'Review Cancelled';
			pkp.localeKeys['submission.list.reviewComplete'] = 'Review Submitted';
			pkp.localeKeys['submission.list.reviewDue'] = 'Review Due: {$date}';
			pkp.localeKeys['submission.list.reviewerWorkflowLink'] =
				`You have been assigned an editorial role for this submission. Would you like to access the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?`;
			pkp.localeKeys['submission.list.reviewsCompleted'] =
				'Assigned reviews completed';
			pkp.localeKeys['submission.list.revisionsSubmitted'] =
				'Production galleys created';
			pkp.localeKeys['submission.list.viewSubmission'] = 'View Submission';

			return {args, setData};
		},
		template: `
			<SubmissionsListPanel
				v-bind="args"
			/>
		`,
	}),

	args: {
		id: 'previewSubmissionsListPanel',
		addUrl: 'https://httbin.org/publicknowledge/submission/wizard',
		apiUrl: 'http://httpbin.org/get',
		infoUrl: 'http://httbin.org/get',
		title: 'Submissions',
		filters: [
			{
				filters: [
					{
						title: 'Overdue',
						param: 'isOverdue',
						value: true,
					},
					{
						title: 'Incomplete',
						param: 'isIncomplete',
						value: true,
					},
				],
			},
			{
				heading: 'Stages',
				filters: [
					{
						title: 'Submission',
						param: 'stageIds',
						value: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
					},
					{
						title: 'Review',
						param: 'stageIds',
						value: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
					},
					{
						title: 'Copyediting',
						param: 'stageIds',
						value: pkp.const.WORKFLOW_STAGE_ID_EDITING,
					},
					{
						title: 'Production',
						param: 'stageIds',
						value: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					},
				],
			},
			{
				heading: 'Activity',
				filters: [
					{
						title: 'Days since last activity',
						param: 'daysInactive',
						value: 30,
						min: 1,
						max: 180,
						filterType: 'pkp-filter-slider',
					},
				],
			},
			{
				heading: 'Sections',
				filters: [
					{
						title: 'Articles',
						param: 'sectionIds',
						value: 1,
					},
					{
						title: 'Reviews',
						param: 'sectionIds',
						value: 2,
					},
				],
			},
			{
				filters: [
					{
						title: 'Editors',
						param: 'assignedTo',
						value: [],
						component: 'field-select-users',
						autosuggestProps: {
							...FieldBaseMock,
							...FieldBaseAutosuggestMock,
							apiUrl: 'usernames.json',
							name: 'assignedTo',
							label: 'Assigned To Editors',
							selectedLabel: 'Assigned',
						},
						filterType: 'pkp-filter-autosuggest',
					},
				],
			},
			{
				filters: [
					{
						title: 'Issues',
						param: 'issueIds',
						value: [],
						component: 'field-select-issues',
						autosuggestProps: {
							...FieldBaseMock,
							...FieldBaseAutosuggestMock,
							apiUrl: 'issues.json',
							name: 'issueIds',
							label: 'Assigned To Issues',
							selectedLabel: 'Assigned',
						},
						filterType: 'pkp-filter-autosuggest',
					},
				],
			},
		],
		items: [...SubmissionsMock],
		itemsMax: SubmissionsMock.length,
	},
};
