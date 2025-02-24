import {useLocalize} from '@/composables/useLocalize';
import {Actions as WorkflowActions} from '../useWorkflowActions';
import {Actions as FileManagerActions} from '@/managers/FileManager/useFileManagerActions';
import {useSubmission} from '@/composables/useSubmission';

const {
	hasSubmissionPassedStage,
	getOpenAndCompletedReviewAssignmentsForRound,
	hasNotSubmissionStartedStage,
} = useSubmission();

const {t} = useLocalize();

export function getHeaderItems({
	submission,
	selectedPublication,
	publicationSettings,
}) {
	if (!submission) {
		return [];
	}
	const {t} = useLocalize();
	const actions = [];

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
	common: {
		getPrimaryItems: ({
			submission,
			permissions,
			selectedStageId,
			selectedReviewRound,
		}) => {
			if (!permissions.accessibleStages.includes(selectedStageId)) {
				return {
					shouldContinue: false,
					items: [
						{
							component: 'WorkflowPrimaryBasicMetadata',
							props: {
								body: t('user.authorization.accessibleWorkflowStage'),
							},
						},
					],
				};
			}

			const items = [];

			items.push({
				component: 'WorkflowChangeSubmissionLanguage',
				props: {
					submission,
					canChangeSubmissionLanguage: false,
				},
			});

			const shouldContinue = !hasNotSubmissionStartedStage(
				submission,
				selectedStageId,
			);

			items.push({
				component: 'WorkflowSubmissionStatus',
				props: {
					submission,
					selectedStageId,
					selectedReviewRoundId: selectedReviewRound?.id,
				},
			});

			return {
				shouldContinue,
				items,
			};
		},
		getSecondaryItems: ({
			submission,
			selectedReviewRound,
			selectedStageId,
			permissions,
		}) => {
			if (!permissions.accessibleStages.includes(selectedStageId)) {
				return {
					shouldContinue: false,
					items: [],
				};
			}
		},
		getActionItems: ({
			submission,
			selectedStageId,
			selectedReviewRound,
			permissions,
		}) => {
			if (!permissions.accessibleStages.includes(selectedStageId)) {
				return {
					shouldContinue: false,
					items: [],
				};
			}
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
					submissionStageId: submission.stageId,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {submissionId: submission.id, stageId: selectedStageId},
			});

			return items;
		},
	},

	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: {
		getPrimaryItems: ({
			submission,
			selectedStageId,
			selectedReviewRound,
			pageInitConfig,
		}) => {
			const items = [];

			items.push({
				component: 'WorkflowListingEmails',
				props: {submission, selectedStageId: selectedStageId},
			});

			if (
				getOpenAndCompletedReviewAssignmentsForRound(
					submission.reviewAssignments,
					selectedReviewRound.id,
				).length
			) {
				items.push({
					component: 'ReviewerManager',
					props: {
						submission: submission,
						reviewRoundId: selectedReviewRound?.id,
						redactedForAuthors: true,
						componentForms: pageInitConfig.componentForms,
					},
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
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});

			return items;
		},
		getActionItems: ({submission, selectedReviewRound}) => {
			const actions = [];

			if (
				selectedReviewRound &&
				[
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED,
					pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW,
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED,
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED,
				].includes(selectedReviewRound.statusId)
			)
				actions.push({
					component: 'WorkflowActionButton',
					props: {
						action: FileManagerActions.FILE_UPLOAD,
						label: t('workflow.uploadRevisions'),
						actionArgs: {
							submissionId: submission.id,
							fileStage: pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
							reviewRoundId: selectedReviewRound.id,
							wizardTitleKey: 'editor.submissionReview.uploadFile',
							submissionStageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						},
					},
				});
			return actions;
		},
	},

	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: {
		getPrimaryItems: ({submission, selectedStageId}) => {
			const items = [];

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
					submissionStageId: submission.stageId,
				},
			});

			return items;
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});

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
					component: 'WorkflowPublicationEditDisabled',
					props: {},
				});
			}
			return {items, shouldContinue: true};
		},
		getPrimaryControlsLeft: ({
			submission,
			selectedPublicationId,
			selectedPublication,
		}) => {
			const items = [];

			items.push({
				component: 'WorkflowPublicationVersionControl',
				props: {
					submission,
					selectedPublicationId: selectedPublicationId,
				},
			});

			return {items, shouldContinue: true};
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
					component: 'WorkflowPublicationForm',
					props: {
						formName: 'titleAbstract',
						submission,
						publication: selectedPublication,
						canEdit: permissions.canEditPublication,
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
					component: 'WorkflowPublicationForm',
					props: {
						formName: 'metadata',
						submission,
						publication: selectedPublication,
						noFieldsMessage: 'No metadata fields are currently enabled.',
						canEdit: permissions.canEditPublication,
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
					component: 'WorkflowPublicationForm',
					props: {
						formName: 'reference',
						submission,
						publication: selectedPublication,
						canEdit: permissions.canEditPublication,
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
					},
				},
			];
		},
	},
};
