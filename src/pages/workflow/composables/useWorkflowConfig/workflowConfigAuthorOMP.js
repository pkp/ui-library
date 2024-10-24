import {useLocalize} from '@/composables/useLocalize';
import {Actions} from '../useWorkflowActions';
import {useSubmission} from '@/composables/useSubmission';

const {hasSubmissionPassedStage, getOpenReviewAssignmentsForRound} =
	useSubmission();

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
		getSecondaryItems: ({submission, selectedReviewRound, selectedStageId}) => {
			const items = [];
			return items;
		},
		getActionsItems: ({submission, selectedReviewRound, selectedStageId}) => {
			const items = [];
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
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];
			if (!selectedReviewRound) {
				return [
					{
						component: 'WorkflowPrimaryBasicMetadata',
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
					component: 'WorkflowPrimaryBasicMetadata',
					props: {
						body: t(
							'editor.submission.workflowDecision.submission.reviewRound',
						),
					},
				});
			}

			if (selectedReviewRound.id === currentReviewRound.id) {
				items.push({
					component: 'WorkflowReviewRoundStatus',
					props: {reviewRound: selectedReviewRound},
				});
			}

			if (
				getOpenReviewAssignmentsForRound(
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
					},
				});
			}
			items.push({
				component: 'FileManager',
				props: {
					namespace: 'WORKFLOW_REVIEW_REVISIONS',
					submission: submission,
					submissionStageId: submission.stageId,
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
					component: 'WorkflowPrimaryBasicMetadata',
					props: {
						body: t('editor.submission.workflowDecision.submission.production'),
					},
				});
			}

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
			if (submission.status === pkp.const.STATUS_PUBLISHED) {
				items.push({
					component: 'WorkflowPrimaryBasicMetadata',
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
			return items;
		},
		getPublicationControlsLeft: ({
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

			return items;
		},
		getPublicationControlsRight: ({
			submission,
			selectedPublicationId,
			selectedPublication,
		}) => {
			const items = [];
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
						canEdit: permissions.canEditPublication,
					},
				},
			];
		},
	},
};
