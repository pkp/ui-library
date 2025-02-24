import {useLocalize} from '@/composables/useLocalize';
import {Actions as WorkflowActions} from '../useWorkflowActions';
import {useSubmission} from '@/composables/useSubmission';
import {Actions as DecisionActions} from '../useWorkflowDecisions';
import {addItemIf} from './workflowConfigHelpers';
import {useCurrentUser} from '@/composables/useCurrentUser';

const {hasSubmissionPassedStage, isDecisionAvailable, getActiveStage} =
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

	return actions;
}

export const WorkflowConfig = {
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];

			items.push({
				component: 'WorkflowNotificationDisplay',
				props: {submission: submission, selectedStageId},
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

			addItemIf(
				items,
				{
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.schedulePublication'),
						isPrimary: true,
						action: 'navigateToMenu',
						actionArgs: 'publication_titleAbstract',
					},
				},
				getActiveStage(submission).id ===
					pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
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

			// Delete submission
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

			return items;
		},
	},
};

export const PublicationConfig = {
	common: {
		getPrimaryControlsLeft: ({
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

			// publication controls left supports subarray for horizontal items, and array for vertical
			items.push([
				{
					component: 'WorkflowPublicationVersionControl',
					props: {
						submission,
						selectedPublicationId: selectedPublicationId,
					},
				},
				{
					component: 'WorkflowPublicationRelationDropdownOPS',
					props: {publication: selectedPublication},
				},
			]);

			return {items, shouldContinue: true};
		},
		getPrimaryControlsRight: ({
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
	preprintEntry: {
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
						formName: 'issue',
						submission,
						publication: selectedPublication,
						canEdit: permissions.canEditPublication,
					},
				},
			];
		},
	},
};
