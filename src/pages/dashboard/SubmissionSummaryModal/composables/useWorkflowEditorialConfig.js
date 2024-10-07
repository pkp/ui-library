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
	permissions,
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

	if (submission.status === pkp.const.STATUS_PUBLISHED) {
		actions.push({
			component: 'ActionButton',
			props: {
				label: t('common.view'),
				action: Actions.WORKFLOW_VIEW_PUBLISHED_SUBMISSION,
			},
		});
	}

	if (permissions.canAccessEditorialHistory) {
		actions.push({
			component: 'ActionButton',
			props: {
				label: t('editor.activityLog'),
				action: Actions.WORKFLOW_VIEW_ACTIVITY_LOG,
			},
		});
	}
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
		getPrimaryItems: ({submission, permissions}) => {
			return [
				{
					component: 'WorkflowChangeSubmissionLanguage',
					props: {
						submission,
						canChangeSubmissionLanguage: false,
					},
				},
			];
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
					namespace: 'SUBMISSION_FILES',
					submission: submission,
					submissionStageId: selectedStageId,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {submissionId: submission.id, stageId: selectedStageId},
			});

			return items;
		},
		getSecondaryItems: ({submission, selectedReviewRound, selectedStageId}) => {
			const items = [];
			items.push({
				component: 'ParticipantManager',
				props: {
					submission,
					submissionStageId: selectedStageId,
				},
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
					label: t('editor.submission.decision.sendExternalReview'),
					isPrimary: true,
					action: DecisionActions.DECISION_EXTERNAL_REVIEW,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('editor.submission.decision.skipReview'),
					isSecondary: true,
					action: DecisionActions.DECISION_SKIP_EXTERNAL_REVIEW,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('editor.submission.decision.decline'),
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
					namespace: 'WORKFLOW_REVIEW_REVISIONS',
					submission: submission,
					submissionStageId: selectedStageId,
					reviewRoundId: selectedReviewRound?.id,
				},
			});

			items.push({
				component: 'FileManager',
				props: {
					namespace: 'EDITOR_REVIEW_FILES',
					submission: submission,
					submissionStageId: selectedStageId,
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
		getSecondaryItems: ({submission, selectedReviewRound, selectedStageId}) => {
			const items = [];

			// TODO add isDecidingEditor boolean to api to make it more accurate
			const selectedStage = getStageById(submission, selectedStageId);
			const isRecommendOnlyEditor = selectedStage.currentUserCanRecommendOnly;
			if (!isRecommendOnlyEditor) {
				items.push({
					component: 'WorkflowRecommendOnlyListingRecommendations',
					props: {
						submission: submission,
						stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						reviewRoundId: selectedReviewRound.id,
					},
				});
			}
			items.push({
				component: 'ParticipantManager',
				props: {
					submission,
					submissionStageId: selectedStageId,
				},
			});

			return items;
		},
		getActionItems: ({submission, selectedStageId, selectedReviewRound}) => {
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
					component: 'WorkflowRecommendOnlyControls',
					props: {
						submission: submission,
						userId: pkp.currentUser.id,
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
						label: t('editor.submission.decision.accept'),
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
						label: t('editor.submission.decision.cancelReviewRound'),
						isWarnable: true,
						action: DecisionActions.DECISION_CANCEL_REVIEW_ROUND,
					},
				});

				items.push({
					component: 'ActionButton',
					props: {
						label: t('editor.submission.decision.decline'),
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
					namespace: 'FINAL_DRAFT_FILES',
					submission: submission,
					submissionStageId: selectedStageId,
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
					namespace: 'COPYEDITED_FILES',
					submission: submission,
					submissionStageId: selectedStageId,
				},
			});

			return items;
		},
		getSecondaryItems: ({submission, selectedReviewRound, selectedStageId}) => {
			const items = [];
			items.push({
				component: 'ParticipantManager',
				props: {
					submission,
					submissionStageId: selectedStageId,
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
					label: t('editor.submission.decision.sendToProduction'),
					isPrimary: true,
					action: DecisionActions.DECISION_SEND_TO_PRODUCTION,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('editor.submission.decision.backFromCopyediting'),
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
					namespace: 'PRODUCTION_READY_FILES',
					submission: submission,
					submissionStageId: selectedStageId,
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
		getSecondaryItems: ({submission, selectedReviewRound, selectedStageId}) => {
			const items = [];
			items.push({
				component: 'ParticipantManager',
				props: {
					submission,
					submissionStageId: selectedStageId,
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
						label: t('editor.submission.decision.backToCopyediting'),
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
			permissions,
		}) => {
			const items = [];

			if (
				submission.status !== pkp.const.STATUS_PUBLISHED &&
				submission.publications.length < 2
			) {
				items.push({
					component: 'WorkflowChangeSubmissionLanguage',
					props: {
						submission,
						canChangeSubmissionLanguage:
							permissions.canChangeSubmissionLanguage,
					},
				});
			}

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
			permissions,
		}) => {
			const items = [];
			const {t} = useLocalize();

			if (!permissions.canPublish) {
				return [];
			}
			if (selectedPublication.status === pkp.const.STATUS_QUEUED) {
				if (
					hasSubmissionPassedStage(
						submission,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
					)
				) {
					items.push({
						component: 'ActionButton',
						props: {
							label: t('common.preview'),
							isSecondary: true,
							action: Actions.WORKFLOW_PREVIEW_PUBLICATION,
						},
					});
				}

				items.push({
					component: 'ActionButton',
					props: {
						// 	{{ submission.status === getConstant('STATUS_PUBLISHED') ? publishLabel : schedulePublicationLabel }}

						label:
							submission.status === pkp.const.STATUS_PUBLISHED
								? t('publication.publish')
								: t('editor.submission.schedulePublication'),
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
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'titleAbstract',
						submission,
						publication: selectedPublication,
						canEditPublication: permissions.canEditPublication,
					},
				},
			];
		},
	},
	contributors: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'ContributorManager',
					props: {
						submission: submission,
						publication: selectedPublication,
						contributorForm: pageInitConfig.contributorForm,
						canEditPublication: permissions.canEditPublication,
					},
				},
			];
		},
	},
	metadata: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'metadata',
						submission,
						publication: selectedPublication,
						noFieldsMessage: 'No metadata fields are currently enabled.',
						canEditPublication: permissions.canEditPublication,
					},
				},
			];
		},
	},
	citations: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'reference',
						submission,
						publication: selectedPublication,
						canEditPublication: permissions.canEditPublication,
					},
				},
			];
		},
	},
	identifiers: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'identifier',
						submission,
						publication: selectedPublication,
						canEditPublication: permissions.canEditPublication,
					},
				},
			];
		},
	},
	jats: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationJats',
					props: {
						canEditPublication: permissions.canEditPublication,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	galleys: {
		getPrimaryItems: ({submission, selectedPublication, permissions}) => {
			return [
				{
					component: 'GalleyManager',
					props: {
						submission,
						publication: selectedPublication,
						canEditPublication: permissions.canEditPublication,
					},
				},
			];
		},
	},
	license: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'permissionDisclosure',
						submission,
						publication: selectedPublication,
						canEditPublication: permissions.canEditPublication,
					},
				},
			];
		},
	},
	issue: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationForm',
					props: {
						formName: 'issue',
						submission,
						publication: selectedPublication,
						canEditPublication: permissions.canEditPublication,
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
			permissions,
		},
	) {
		if (selectedMenuState.stageId) {
			const itemsArgs = {
				submission,
				selectedPublication,
				selectedPublicationId,
				selectedStageId: selectedMenuState.stageId,
				selectedReviewRound,
				permissions,
			};
			if (!submission) {
				return [];
			}

			if (!permissions.accessibleStages.includes(selectedMenuState.stageId)) {
				if (getterFnName === 'getPrimaryItems') {
					return [
						{
							component: 'PrimaryBasicMetadata',
							props: {body: t('user.authorization.accessibleWorkflowStage')},
						},
					];
				} else {
					return [];
				}
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
				permissions,
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
