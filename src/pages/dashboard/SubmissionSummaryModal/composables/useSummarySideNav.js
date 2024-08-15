import {useSubmission} from '@/composables/useSubmission';

export function useSummarySideNav() {
	function getReviewItems(submission) {
		const reviewMenuItems = [];
		submission.reviewRounds.forEach((reviewRound, index) => {
			reviewMenuItems.push({
				key: reviewRound.id,
				label: `Review Round ${index + 1}`,
				action: 'selectStage',
				actionsArgs: {
					reviewRoundId: reviewRound.id,
					stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				},
			});
		});

		reviewMenuItems.push({
			label: 'New Review Round',
		});

		return reviewMenuItems;
	}

	function getWorkflowItems(submission) {
		const {getActiveStage} = useSubmission();

		const activeStage = getActiveStage(submission);
		return [
			{
				key: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				label: 'Submission',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION
						? 'border-stage-desk-review'
						: null,
				action: 'selectStage',
				actionsArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION},
			},
			{
				key: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				label: 'Review',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
						? 'border-stage-in-review'
						: null,
				items: getReviewItems(submission),
			},
			{
				key: pkp.const.WORKFLOW_STAGE_ID_EDITING,
				label: 'Copyediting',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EDITING
						? 'border-stage-copyediting'
						: null,
				action: 'selectStage',
				actionsArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_EDITING},
			},
			{
				key: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				label: 'Production',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION
						? 'border-stage-copyediting'
						: null,
				action: 'selectStage',
				actionsArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION},
			},
		];
	}

	function getMenuItems(submission) {
		const menuItems = [
			{
				key: 'workflow',
				label: 'Workflow',
				icon: 'Dashboard',
				items: getWorkflowItems(submission),
			},
			{
				key: 'publication',
				label: 'Publication',
				icon: 'MySubmissions',
				items: [
					{
						label: 'Title & Abstract',
						link: '#',
					},
					{
						label: 'Contributors',
						link: '#',
					},
					{
						label: 'Metadata',
						link: '#',
					},
					{
						label: 'References',
						link: '#',
					},
					{
						label: 'Galleys',
						link: '#',
					},
					{
						label: 'Permissions & Disclosure',
						link: '#',
					},
					{
						label: 'Issue',
						link: '#',
					},
				],
			},
		];

		return menuItems;
	}

	return {getMenuItems};
}
