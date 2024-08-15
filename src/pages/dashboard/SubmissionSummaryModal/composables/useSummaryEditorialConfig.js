import {useLocalize} from '@/composables/useLocalize';
//import {useSubmission} from '@/composables/useSubmission';

//const {getActiveStage} = useSubmission();

const {t} = useLocalize();

export function useSummaryEditorialConfig() {
	function getPrimaryItems({
		submission,
		currentPublication,
		selectedStageId,
		selectedReviewRound,
	}) {
		//const activeStage = getActiveStage(submission);

		//const isSelectedStageActive = selectedStageId === activeStage.id;

		const items = [];

		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			items.push({
				component: 'FileManager',
				props: {
					configName: 'SUBMISSION_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			// TODO refine not sure if there are different discussions in different stages
			items.push({
				component: 'DiscussionManager',
				props: {submissionId: submission.id, stageId: submission.stageId},
			});
		} else if (
			selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
		) {
			items.push({
				component: 'FileManager',
				props: {
					configName: 'WORKFLOW_REVIEW_REVISIONS',
					submission: submission,
					submissionStageId: submission.stageId,
					reviewRoundId: selectedReviewRound?.id,
				},
			});

			items.push({
				component: 'FileManager',
				props: {
					configName: 'EDITOR_REVIEW_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
					reviewRoundId: selectedReviewRound?.id,
				},
			});

			items.push({
				component: 'ReviewerManager',
				props: {
					submission: submission,
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EDITING) {
			items.push({
				component: 'FileManager',
				props: {
					configName: 'COPYEDITED_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			items.push({
				component: 'FileManager',
				props: {
					configName: 'FINAL_DRAFT_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
			items.push({
				component: 'FileManager',
				props: {
					configName: 'PRODUCTION_READY_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});
		}
		console.log('primary items:', items);
		return items;
	}

	function getSecondaryItems({submission}) {
		const items = [];

		items.push({
			component: 'ParticipantManager',
			props: {
				submission,
				submissionStageId: submission.stageId,
			},
		});

		return items;
	}

	function getActionItems({submission, selectedStageId}) {
		//const activeStage = getActiveStage(submission);

		//const isSelectedStageActive = selectedStageId === activeStage.id;

		const items = [];

		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendSubmissionForReview'),
					isPrimary: true,
					action: 'decisionExternalReview',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptAndSkipReview'),
					isSecondary: true,
					action: 'decisionSkipExternalReview',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.declineSubmission'),
					isWarnable: true,
					action: 'decisionInitialDecline',
				},
			});
		} else if (
			selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
		) {
			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.requestRevisions'),
					isSecondary: true,
					action: 'requestRevisions',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptSubmission'),
					action: 'decisionAccept',
					isPrimary: true,
				},
			});

			/*items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.cancelReviewRound'),
					isWarnable: true,
					action: 'decisionCancelReviewRound',
				},
			});*/

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.declineSubmission'),
					isWarnable: true,
					action: 'decisionDecline',
				},
			});

			// TODO cancel copyediting
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EDITING) {
			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendToProduction'),
					isPrimary: true,
					action: 'decisionSendToProduction',
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.scheduleForPublication'),
					isPrimary: true,
					action: 'scheduleForPublication',
				},
			});
		}
		return items;
	}

	return {getPrimaryItems, getSecondaryItems, getActionItems};
}
