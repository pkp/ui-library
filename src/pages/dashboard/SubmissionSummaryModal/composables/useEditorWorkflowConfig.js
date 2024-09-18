import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {Actions as WorkflowActions} from '../../composables/useWorkflowActions';
import {Actions as DecisionActions} from '../../composables/useWorkflowDecisions';

const {t} = useLocalize();

export function useEditorWorkflowConfig() {
	const {hasSubmissionPassedStage, hasNotSubmissionStartedStage, getStageById} =
		useSubmission();

	function getPrimaryItems({submission, selectedStageId, selectedReviewRound}) {
		const items = [];

		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			if (
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				)
			) {
				items.push({component: 'SubmissionStatus', props: {submission}});
			}

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
				props: {submissionId: submission.id, stageId: selectedStageId},
			});
		} else if (
			selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
		) {
			if (!selectedReviewRound) {
				return [
					{
						component: 'PrimaryBasicMetadata',
						props: {body: t('editor.review.notInitiated')},
					},
				];
			}
			const {getCurrentReviewRound} = useSubmission();

			const currentReviewRound = getCurrentReviewRound(
				submission,
				selectedStageId,
			);

			if (selectedReviewRound.round < currentReviewRound.round) {
				items.push({
					component: 'PrimaryBasicMetadata',
					props: {
						body: t(
							'editor.submission.workflowDecision.submission.reviewRound',
						),
					},
				});
			}

			if (selectedReviewRound.id === currentReviewRound.id) {
				items.push({
					component: 'ReviewRoundStatus',
					props: {reviewRound: selectedReviewRound},
				});
			}

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
					reviewRoundId: selectedReviewRound?.id,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EDITING) {
			if (
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EDITING,
				)
			) {
				items.push({
					component: 'PrimaryBasicMetadata',
					props: {
						body: t('editor.submission.workflowDecision.submission.production'),
					},
				});
			}

			items.push({
				component: 'FileManager',
				props: {
					configName: 'FINAL_DRAFT_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});

			items.push({
				component: 'FileManager',
				props: {
					configName: 'COPYEDITED_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
			if (submission.status === pkp.const.STATUS_PUBLISHED) {
				items.push({
					component: 'PrimaryBasicMetadata',
					props: {
						body: t('editor.submission.workflowDecision.submission.published'),
					},
				});
			}
			items.push({
				component: 'FileManager',
				props: {
					configName: 'PRODUCTION_READY_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});
		}

		return items;
	}

	function getSecondaryItems({
		submission,
		selectedReviewRound,
		selectedStageId,
	}) {
		const items = [];
		// When review stage has not started, show no items
		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			if (!selectedReviewRound) {
				return [];
			}
		}

		items.push({
			component: 'ParticipantManager',
			props: {
				submission,
				submissionStageId: submission.stageId,
			},
		});

		return items;
	}

	function getActionItems({submission, selectedStageId, selectedReviewRound}) {
		const items = [];

		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			if (
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				)
			) {
				return [];
			}

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendSubmissionForReview'),
					isPrimary: true,
					action: DecisionActions.DECISION_EXTERNAL_REVIEW,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptAndSkipReview'),
					isSecondary: true,
					action: DecisionActions.DECISION_SKIP_EXTERNAL_REVIEW,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.declineSubmission'),
					isWarnable: true,
					action: DecisionActions.DECISION_INITIAL_DECLINE,
				},
			});
		} else if (
			selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
		) {
			const {getCurrentReviewRound} = useSubmission();

			const currentReviewRound = getCurrentReviewRound(
				submission,
				selectedStageId,
			);

			// if review stage has not started show no items
			if (
				hasNotSubmissionStartedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				) ||
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				) ||
				selectedReviewRound.round < currentReviewRound.round
			) {
				return [];
			}

			const selectedStage = getStageById(submission, selectedStageId);

			const isRecommendOnlyEditor = selectedStage.currentUserCanRecommendOnly;
			if (isRecommendOnlyEditor) {
				items.push({
					component: 'WorkflowRecommendationControls',
					props: {
						stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						reviewRoundId: selectedReviewRound.id,
					},
				});
			} else {
				const actionArgs = {
					stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
					reviewRoundId: selectedReviewRound.id,
				};

				items.push({
					component: 'ActionButton',
					props: {
						label: t('dashboard.summary.requestRevisions'),
						isSecondary: true,
						action: WorkflowActions.WORKFLOW_REQUEST_REVISION,
						actionArgs,
					},
				});

				items.push({
					component: 'ActionButton',
					props: {
						label: t('dashboard.summary.acceptSubmission'),
						action: DecisionActions.DECISION_ACCEPT,
						isPrimary: true,
						actionArgs,
					},
				});

				items.push({
					component: 'ActionButton',
					props: {
						label: t('editor.submission.createNewRound'),
						action: DecisionActions.DECISION_NEW_EXTERNAL_ROUND,
						actionArgs,
					},
				});

				items.push({
					component: 'ActionButton',
					props: {
						label: t('dashboard.summary.cancelReviewRound'),
						isWarnable: true,
						action: DecisionActions.DECISION_CANCEL_REVIEW_ROUND,
					},
				});

				items.push({
					component: 'ActionButton',
					props: {
						label: t('dashboard.summary.declineSubmission'),
						isWarnable: true,
						action: DecisionActions.DECISION_DECLINE_SUBMISSION,
					},
				});
			}
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EDITING) {
			if (
				hasNotSubmissionStartedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EDITING,
				) ||
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EDITING,
				)
			) {
				return [];
			}

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendToProduction'),
					isPrimary: true,
					action: DecisionActions.DECISION_SEND_TO_PRODUCTION,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.cancelCopyEditing'),
					isWarnable: true,
					action: DecisionActions.DECISION_BACK_FROM_COPYEDITING,
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
			if (
				hasNotSubmissionStartedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				) ||
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				)
			) {
				return [];
			}

			items.push({
				component: 'ActionButton',
				props: {
					label: t('editor.submission.schedulePublication'),
					isPrimary: true,
					action: 'navigateToMenu',
					actionArgs: {key: 'publication_titleAbstract'},
				},
			});

			if (submission.status === pkp.const.STATUS_QUEUED)
				items.push({
					component: 'ActionButton',
					props: {
						label: t('dashboard.summary.backToCopyediting'),
						isWarnable: true,
						action: DecisionActions.DECISION_BACK_FROM_PRODUCTION,
					},
				});
		}
		return items;
	}

	return {getPrimaryItems, getSecondaryItems, getActionItems};
}
