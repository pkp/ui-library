import {useLocalize} from '@/composables/useLocalize';
import {Actions} from '../../composables/useWorkflowActions';
import {useSubmission} from '@/composables/useSubmission';
import {Actions as WorkflowActions} from '../../composables/useWorkflowActions';
import {Actions as DecisionActions} from '../../composables/useWorkflowDecisions';

const {hasSubmissionPassedStage, hasNotSubmissionStartedStage, getStageById} =
	useSubmission();
const {t} = useLocalize();

function getHeaderItems({
	submission,
	selectedPublication,
	publicationSettings,
}) {
	if (!submission) {
		return [];
	}
	const {t} = useLocalize();
	const actions = [];

	if (publicationSettings.submissionPaymentsEnabled) {
		actions.push({
			component: 'WorkflowPaymentDropdown',
			props: {submission, selectedPublication},
		});
	}

	actions.push({
		component: 'ActionButton',
		props: {
			label: t('editor.activityLog'),
			action: Actions.WORKFLOW_VIEW_ACTIVITY_LOG,
		},
	});
	actions.push({
		component: 'ActionButton',
		props: {
			label: t('editor.submissionLibrary'),
			action: Actions.WORKFLOW_VIEW_LIBRARY,
		},
	});

	return actions;
}

export const WorkflowConfig = {
	common: {
		getSecondaryItems: ({submission, selectedReviewRound, selectedStageId}) => {
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
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];

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

			items.push({
				component: 'DiscussionManager',
				props: {submissionId: submission.id, stageId: selectedStageId},
			});

			return items;
		},
		getActionItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];
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
			return items;
		},
	},

	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];
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

			return items;
		},
		getActionItems: ({submission, selectedStageId, selectedReviewRound}) => {
			console.log('getActionItems!! in workflow');
			const items = [];
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
			return items;
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];

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

			return items;
		},
		getActionItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];
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

			return items;
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];
			if (submission.status === pkp.const.STATUS_PUBLISHED) {
				items.push({
					component: 'PrimaryBasicMetadata',
					props: {
						body: t('editor.submission.workflowDecision.submission.published'),
					},
				});
			}

			items.push({
				component: 'WorkflowNotificationDisplay',
				props: {submission: submission},
			});

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

			return items;
		},
		getActionItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];
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

			if (submission.status === pkp.const.STATUS_QUEUED) {
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
		},
	},
};

export const PublicationConfig = {
	common: {
		getPrimaryItems: ({
			submission,
			selectedPublicationId,
			selectedPublication,
		}) => {
			const items = [];
			if (selectedPublication.status === pkp.const.STATUS_PUBLISHED) {
				items.push({
					component: 'PublicationEditDisabled',
					props: {},
				});
			}
			return items;
		},
		getPublicationControlsLeft: ({
			submission,
			selectedPublicationId,
			selectedPublication,
		}) => {
			const items = [];

			items.push({
				component: 'PublicationVersionControl',
				props: {
					submission,
					selectedPublicationId: selectedPublicationId,
				},
			});

			return items;
		},
		getPublicationControlsRight: ({
			submission,
			selectedPublicationId,
			selectedPublication,
		}) => {
			const items = [];
			const {t} = useLocalize();

			if (selectedPublication.status === pkp.const.STATUS_QUEUED) {
				items.push({
					component: 'ActionButton',
					props: {
						label: t('dashboard.summary.preview'),
						isSecondary: true,
						action: Actions.WORKFLOW_PREVIEW_PUBLICATION,
					},
				});

				items.push({
					component: 'ActionButton',
					props: {
						label: t('editor.submission.schedulePublication'),
						isSecondary: true,
						action:
							Actions.WORKFLOW_ASSIGN_TO_ISSUE_AND_SCHEDULE_FOR_PUBLICATION,
					},
				});
			} else if (selectedPublication.status === pkp.const.STATUS_SCHEDULED) {
				items.push({
					component: 'ActionButton',
					props: {
						label: t('dashboard.summary.preview'),
						isSecondary: true,
						action: Actions.WORKFLOW_PREVIEW_PUBLICATION,
					},
				});

				items.push({
					component: 'ActionButton',
					props: {
						label: t('publication.unschedule'),
						isWarnable: true,
						action: Actions.WORKFLOW_UNSCHEDULE_PUBLICATION,
					},
				});
			} else if (selectedPublication.status === pkp.const.STATUS_PUBLISHED) {
				items.push({
					component: 'ActionButton',
					props: {
						label: t('publication.unpublish'),
						isWarnable: true,
						action: Actions.WORKFLOW_UNPUBLISH_PUBLICATION,
					},
				});

				const {getLatestPublication} = useSubmission();
				const latestPublication = getLatestPublication(submission);

				if (latestPublication.id === selectedPublication.id) {
					items.push({
						component: 'ActionButton',
						props: {
							label: t('publication.createVersion'),
							isSecondary: true,
							action: Actions.WORKFLOW_CREATE_NEW_VERSION,
						},
					});
				}
			}

			return items;
		},
	},
	titleAbstract: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'titleAbstract',
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	contributors: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'ContributorManager',
					props: {
						submission: submission,
						publication: selectedPublication,
						contributorForm: pageInitConfig.contributorForm,
					},
				},
			];
		},
	},
	metadata: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'metadata',
						submission,
						publication: selectedPublication,
						noFieldsMessage: 'No metadata fields are currently enabled.',
					},
				},
			];
		},
	},
	citations: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'reference',
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	identifiers: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'identifier',
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	jats: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationJats',
					props: {
						canEditPublication: true,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	galleys: {
		getPrimaryItems: ({submission, selectedPublication}) => {
			return [
				{
					component: 'GalleyManager',
					props: {
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	license: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'permissionDisclosure',
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	issue: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'issue',
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
};

export function useWorkflowEditorialConfig() {
	function _getItems(
		getterFnName,
		{
			selectedMenuState,
			submission,
			pageInitConfig,
			selectedPublication,
			selectedPublicationId,
			selectedReviewRound,
		},
	) {
		if (selectedMenuState.stageId) {
			const itemsArgs = {
				submission,
				selectedPublication,
				selectedPublicationId,
				selectedStageId: selectedMenuState.stageId,
				selectedReviewRound,
			};
			if (!submission) {
				return [];
			}
			return [
				...(WorkflowConfig?.common?.[getterFnName]?.(itemsArgs) || []),
				...(WorkflowConfig[selectedMenuState.stageId]?.[getterFnName]?.(
					itemsArgs,
				) || []),
			];
		} else if (selectedMenuState.publicationMenu) {
			const itemsArgs = {
				submission,
				pageInitConfig: pageInitConfig,
				selectedPublication,
				selectedPublicationId,
			};
			if (!submission || !selectedPublication) {
				return [];
			}

			return [
				...(PublicationConfig?.common?.[getterFnName]?.(itemsArgs) || []),
				...(PublicationConfig[selectedMenuState.publicationMenu]?.[
					getterFnName
				]?.(itemsArgs) || []),
			];
		}
	}

	function getPrimaryItems(args) {
		return _getItems('getPrimaryItems', args);
	}

	function getSecondaryItems(args) {
		return _getItems('getSecondaryItems', args);
	}

	function getActionItems(args) {
		return _getItems('getActionItems', args);
	}

	function getPublicationControlsLeft(args) {
		return _getItems('getPublicationControlsLeft', args);
	}

	function getPublicationControlsRight(args) {
		return _getItems('getPublicationControlsRight', args);
	}

	return {
		getHeaderItems,
		getPrimaryItems,
		getSecondaryItems,
		getActionItems,
		getPublicationControlsLeft,
		getPublicationControlsRight,
	};
}
