import {useSubmission} from '@/composables/useSubmission';

export function useSummarySideNav() {
	function getReviewItems(submission) {
		const reviewMenuItems = [];

		const {getReviewRoundsForStage} = useSubmission();
		const reviewRounds = getReviewRoundsForStage(
			submission,
			pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		);

		reviewRounds.forEach((reviewRound, index) => {
			reviewMenuItems.push({
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}_${reviewRound.id}`,
				label: `Review Round ${index + 1}`,
				action: 'selectStage',
				actionArgs: {
					reviewRoundId: reviewRound.id,
					stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				},
			});
		});

		/*if (submission.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			reviewMenuItems.push({
				label: 'New Review Round',
				action: 'decisionNewExternalRound',
				actionArgs: {
					reviewRoundId: getCurrentReviewRound(
						submission,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
					).id,
					stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				},
			});
		}*/

		return reviewMenuItems;
	}

	function getWorkflowItems(submission) {
		const {getActiveStage} = useSubmission();

		const activeStage = getActiveStage(submission);

		const externalReviewItems = getReviewItems(submission);
		return [
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_SUBMISSION}`,
				label: 'Submission',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION
						? 'border-stage-desk-review'
						: null,
				action: 'selectStage',
				actionArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION},
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
				label: 'Review',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
						? 'border-stage-in-review'
						: null,

				items: externalReviewItems,
				action: !externalReviewItems.length ? 'selectStage' : undefined,
				actionArgs: !externalReviewItems.length
					? {stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}
					: undefined,
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_EDITING}`,
				label: 'Copyediting',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EDITING
						? 'border-stage-copyediting'
						: null,
				action: 'selectStage',
				actionArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_EDITING},
			},
			{
				key: `workflow_${pkp.const.WORKFLOW_STAGE_ID_PRODUCTION}`,
				label: 'Production',
				colorStripe:
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION
						? 'border-stage-copyediting'
						: null,
				action: 'selectStage',
				actionArgs: {stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION},
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
						key: 'publication_titleAbstract',
						label: 'Title & Abstract',
						action: 'selectPublicationMenu',
						actionArgs: {menu: 'titleAbstract'},
					},
					{
						label: 'Contributors',
						link: '#',
					},
					{
						key: 'publication_metadata',
						label: 'Metadata',
						action: 'selectPublicationMenu',
						actionArgs: {menu: 'metadata'},
					},
					{
						key: 'citations',
						label: 'References',
						action: 'selectPublicationMenu',
						actionArgs: {menu: 'citations'},
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
