import {useLocalize} from '@/composables/useLocalize';
import {Actions as WorkflowActions} from '../useWorkflowActions';
import {useSubmission} from '@/composables/useSubmission';
import {useCurrentUser} from '@/composables/useCurrentUser';

import {Actions as DecisionActions} from '../useWorkflowDecisions';
import {addItemIf} from './workflowConfigHelpers';
const {hasSubmissionPassedStage, getStageById, isDecisionAvailable} =
	useSubmission();
const {hasCurrentUserAtLeastOneAssignedRoleInAnyStage} = useCurrentUser();

const {t} = useLocalize();

export function getHeaderItems({
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

	if (submission.status === pkp.const.STATUS_PUBLISHED) {
		actions.push({
			component: 'WorkflowActionButton',
			props: {
				label: t('common.view'),
				action: WorkflowActions.WORKFLOW_VIEW_PUBLISHED_SUBMISSION,
			},
		});
	}

	if (
		submission.status !== pkp.const.STATUS_PUBLISHED &&
		(submission.stageId === pkp.const.WORKFLOW_STAGE_ID_EDITING ||
			submission.stageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION)
	) {
		actions.push({
			component: 'WorkflowActionButton',
			props: {
				label: t('common.preview'),
				action: WorkflowActions.WORKFLOW_VIEW_PUBLISHED_SUBMISSION,
			},
		});
	}

	if (permissions.canAccessEditorialHistory) {
		actions.push({
			component: 'WorkflowActionButton',
			props: {
				label: t('editor.activityLog'),
				action: WorkflowActions.WORKFLOW_VIEW_ACTIVITY_LOG,
			},
		});
	}
	actions.push({
		component: 'WorkflowActionButton',
		props: {
			label: t('editor.submissionLibrary'),
			action: WorkflowActions.WORKFLOW_VIEW_LIBRARY,
		},
	});

	actions.push({
		component: 'WorkflowWorkTypeOMP',
		props: {
			submission: submission,
		},
	});

	return actions;
}

export const WorkflowConfig = {
	[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: {
		getActionItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];
			addItemIf(
				items,
				{
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.sendExternalReview'),
						isPrimary: true,
						action: DecisionActions.DECISION_SKIP_INTERNAL_REVIEW,
					},
				},
				isDecisionAvailable(
					submission,
					pkp.const.DECISION_SKIP_INTERNAL_REVIEW,
				),
			);

			addItemIf(
				items,
				{
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.skipReview'),
						isSecondary: true,
						action: DecisionActions.DECISION_SKIP_EXTERNAL_REVIEW,
					},
				},
				isDecisionAvailable(
					submission,
					pkp.const.DECISION_SKIP_EXTERNAL_REVIEW,
				),
			);

			addItemIf(
				items,
				{
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.decline'),
						isWarnable: true,
						action: DecisionActions.DECISION_INITIAL_DECLINE,
					},
				},
				isDecisionAvailable(submission, pkp.const.DECISION_INITIAL_DECLINE),
			);

			addItemIf(
				items,
				{
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.revertDecline'),
						isSecondary: true,
						action: DecisionActions.DECISION_REVERT_INITIAL_DECLINE,
					},
				},
				isDecisionAvailable(
					submission,
					pkp.const.DECISION_REVERT_INITIAL_DECLINE,
				),
			);

			addItemIf(
				items,
				{
					component: 'WorkflowActionButton',
					props: {
						label: t('common.delete'),
						isWarnable: true,
						action: WorkflowActions.WORKFLOW_DELETE_SUBMISSION,
					},
				},
				isDecisionAvailable(
					submission,
					pkp.const.DECISION_REVERT_INITIAL_DECLINE,
				) &&
					hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
						pkp.const.ROLE_ID_MANAGER,
						pkp.const.ROLE_ID_SITE_ADMIN,
					]),
			);

			addItemIf(
				items,
				{
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.sendInternalReview'),
						isSecondary: true,
						action: DecisionActions.DECISION_INTERNAL_REVIEW,
					},
				},
				isDecisionAvailable(submission, pkp.const.DECISION_INTERNAL_REVIEW),
			);

			return items;
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW]: {
		getPrimaryItems: ({
			submission,
			selectedStageId,
			selectedReviewRound,
			pageInitConfig,
		}) => {
			const items = [];

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
					componentForms: pageInitConfig.componentForms,
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
			if (!selectedReviewRound) {
				return [];
			}

			const selectedStage = getStageById(submission, selectedStageId);
			if (selectedStage?.isCurrentUserDecidingEditor) {
				items.push({
					component: 'WorkflowRecommendOnlyListingRecommendations',
					props: {
						submission: submission,
						stageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
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

			if (!selectedReviewRound) {
				return [];
			}

			const {getCurrentReviewRound} = useSubmission();

			const currentReviewRound = getCurrentReviewRound(
				submission,
				selectedStageId,
			);

			// if review stage has not started show no items
			if (selectedReviewRound.round < currentReviewRound.round) {
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
						stageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
						reviewRoundId: selectedReviewRound.id,
					},
				});
			} else {
				const actionArgs = {
					stageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
					reviewRoundId: selectedReviewRound.id,
				};

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('editor.submission.decision.requestRevisions'),
							isSecondary: true,
							action: DecisionActions.DECISION_PENDING_REVISIONS_INTERNAL,
							actionArgs,
						},
					},
					isDecisionAvailable(
						submission,
						pkp.const.DECISION_PENDING_REVISIONS_INTERNAL,
					),
				);

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('editor.submission.decision.sendExternalReview'),
							action: DecisionActions.DECISION_EXTERNAL_REVIEW,
							isPrimary: true,
							actionArgs,
						},
					},
					isDecisionAvailable(submission, pkp.const.DECISION_EXTERNAL_REVIEW),
				);

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('editor.submission.decision.accept'),
							action: DecisionActions.DECISION_ACCEPT_INTERNAL,
							isPrimary: true,
							actionArgs,
						},
					},
					isDecisionAvailable(submission, pkp.const.DECISION_ACCEPT_INTERNAL),
				);

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('editor.submission.createNewRound'),
							action: DecisionActions.DECISION_NEW_INTERNAL_ROUND,
							actionArgs,
						},
					},
					isDecisionAvailable(
						submission,
						pkp.const.DECISION_NEW_INTERNAL_ROUND,
					),
				);

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('editor.submission.decision.cancelReviewRound'),
							isWarnable: true,
							action: DecisionActions.DECISION_CANCEL_INTERNAL_REVIEW_ROUND,
							actionArgs,
						},
					},
					isDecisionAvailable(
						submission,
						pkp.const.DECISION_CANCEL_INTERNAL_REVIEW_ROUND,
					),
				);

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('editor.submission.decision.decline'),
							isWarnable: true,
							action: DecisionActions.DECISION_DECLINE_INTERNAL,
							actionArgs,
						},
					},
					isDecisionAvailable(submission, pkp.const.DECISION_DECLINE_INTERNAL),
				);

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('editor.submission.decision.revertDecline'),
							isSecondary: true,
							action: DecisionActions.DECISION_REVERT_INTERNAL_DECLINE,
							actionArgs,
						},
					},
					isDecisionAvailable(
						submission,
						pkp.const.DECISION_REVERT_INTERNAL_DECLINE,
					),
				);

				addItemIf(
					items,
					{
						component: 'WorkflowActionButton',
						props: {
							label: t('common.delete'),
							isWarnable: true,
							action: WorkflowActions.WORKFLOW_DELETE_SUBMISSION,
						},
					},
					isDecisionAvailable(
						submission,
						pkp.const.DECISION_REVERT_INTERNAL_DECLINE,
					) &&
						hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
							pkp.const.ROLE_ID_MANAGER,
							pkp.const.ROLE_ID_SITE_ADMIN,
						]),
				);
			}
			return items;
		},
	},
};

export const MarketingConfig = {
	audience: {
		getPrimaryItems: ({submission, pageInitConfig, permissions}) => {
			return [
				{
					component: 'WorkflowMarketingForm',
					props: {
						formName: 'audience',
						submission,
					},
				},
			];
		},
	},
	representatives: {
		getPrimaryItems: ({submission, pageInitConfig, permissions}) => {
			return [
				{
					component: 'RepresentativeManager',
					props: {
						submissionId: submission.id,
					},
				},
			];
		},
	},
	publicationDates: {
		getPrimaryItems: ({submission, pageInitConfig, permissions}) => {
			return [
				{
					component: 'WorkflowMarketingForm',
					props: {
						formName: 'publicationDates',
						submission,
					},
				},
			];
		},
	},
};

export const PublicationConfig = {
	common: {
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
						component: 'WorkflowActionButton',
						props: {
							label: t('common.preview'),
							isSecondary: true,
							action: WorkflowActions.WORKFLOW_PREVIEW_PUBLICATION,
						},
					});
				}

				items.push({
					component: 'WorkflowActionButton',
					props: {
						// 	{{ submission.status === getConstant('STATUS_PUBLISHED') ? publishLabel : schedulePublicationLabel }}

						label: t('publication.publish'),
						isSecondary: true,
						action: WorkflowActions.WORKFLOW_SCHEDULE_FOR_PUBLICATION,
					},
				});
			} else if (selectedPublication.status === pkp.const.STATUS_SCHEDULED) {
				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('common.preview'),
						isSecondary: true,
						action: WorkflowActions.WORKFLOW_PREVIEW_PUBLICATION,
					},
				});

				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('publication.unschedule'),
						isWarnable: true,
						action: WorkflowActions.WORKFLOW_UNSCHEDULE_PUBLICATION,
					},
				});
			} else if (selectedPublication.status === pkp.const.STATUS_PUBLISHED) {
				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('publication.unpublish'),
						isWarnable: true,
						action: WorkflowActions.WORKFLOW_UNPUBLISH_PUBLICATION,
					},
				});

				const {getLatestPublication} = useSubmission();
				const latestPublication = getLatestPublication(submission);

				if (latestPublication.id === selectedPublication.id) {
					items.push({
						component: 'WorkflowActionButton',
						props: {
							label: t('publication.createVersion'),
							isSecondary: true,
							action: WorkflowActions.WORKFLOW_CREATE_NEW_VERSION,
						},
					});
				}
			}

			return {items, shouldContinue: true};
		},
	},
	chapters: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'ChapterManager',
					props: {
						submissionId: submission.id,
						publicationId: selectedPublication.id,
					},
				},
			];
		},
	},

	publicationFormats: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationFormatManager',
					props: {
						submissionId: submission.id,
						publicationId: selectedPublication.id,
					},
				},
			];
		},
	},

	catalogEntry: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'WorkflowPublicationForm',
					props: {
						formName: 'catalogEntry',
						submission,
						publication: selectedPublication,
						canEdit: permissions.canEditPublication,
					},
				},
			];
		},
	},
};
