import {useLocalize} from '@/composables/useLocalize';
import {Actions} from '../useWorkflowActions';
import {useSubmission} from '@/composables/useSubmission';
import {Actions as DecisionActions} from '../useWorkflowDecisions';

const {hasSubmissionPassedStage, hasNotSubmissionStartedStage, getStageById} =
	useSubmission();
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
	const items = [];

	items.push({
		component: 'WorkflowWorkTypeOMP',
		props: {
			submission: submission,
		},
	});

	if (submission.status === pkp.const.STATUS_PUBLISHED) {
		items.push({
			component: 'WorkflowActionButton',
			props: {
				label: t('common.view'),
				action: Actions.WORKFLOW_VIEW_PUBLISHED_SUBMISSION,
			},
		});
	}

	if (permissions.canAccessEditorialHistory) {
		items.push({
			component: 'WorkflowActionButton',
			props: {
				label: t('editor.activityLog'),
				action: Actions.WORKFLOW_VIEW_ACTIVITY_LOG,
			},
		});
	}
	items.push({
		component: 'WorkflowActionButton',
		props: {
			label: t('editor.submissionLibrary'),
			action: Actions.WORKFLOW_VIEW_LIBRARY,
		},
	});

	return items;
}

export const WorkflowConfig = {
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
				component: 'WorkflowActionButton',
				props: {
					label: t('editor.submission.decision.sendExternalReview'),
					isPrimary: true,
					action: DecisionActions.DECISION_SKIP_EXTERNAL_REVIEW,
				},
			});

			items.push({
				component: 'WorkflowActionButton',
				props: {
					label: t('editor.submission.decision.skipReview'),
					isSecondary: true,
					action: DecisionActions.DECISION_SKIP_EXTERNAL_REVIEW,
				},
			});

			items.push({
				component: 'WorkflowActionButton',
				props: {
					label: t('editor.submission.decision.decline'),
					isWarnable: true,
					action: DecisionActions.DECISION_INITIAL_DECLINE,
				},
			});

			items.push({
				component: 'WorkflowActionButton',
				props: {
					label: t('editor.submission.decision.sendInternalReview'),
					isSecondary: true,
					action: DecisionActions.DECISION_INTERNAL_REVIEW,
				},
			});

			return items;
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW]: {
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
					pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
				) ||
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
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
						stageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
						reviewRoundId: selectedReviewRound.id,
					},
				});
			} else {
				const actionArgs = {
					stageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
					reviewRoundId: selectedReviewRound.id,
				};

				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('dashboard.summary.requestRevisions'),
						isSecondary: true,
						action: DecisionActions.DECISION_PENDING_REVISIONS_INTERNAL,
						actionArgs,
					},
				});

				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.sendExternalReview'),
						action: DecisionActions.DECISION_EXTERNAL_REVIEW,
						isPrimary: true,
						actionArgs,
					},
				});

				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.accept'),
						action: DecisionActions.DECISION_ACCEPT_INTERNAL,
						actionArgs,
					},
				});

				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.cancelReviewRound'),
						isWarnable: true,
						action: DecisionActions.DECISION_CANCEL_INTERNAL_REVIEW_ROUND,
						actionArgs,
					},
				});

				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('editor.submission.decision.decline'),
						isWarnable: true,
						action: DecisionActions.DECISION_DECLINE_INTERNAL,
						actionArgs,
					},
				});
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
							action: Actions.WORKFLOW_PREVIEW_PUBLICATION,
						},
					});
				}

				items.push({
					component: 'WorkflowActionButton',
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
					component: 'WorkflowActionButton',
					props: {
						label: t('dashboard.summary.preview'),
						isSecondary: true,
						action: Actions.WORKFLOW_PREVIEW_PUBLICATION,
					},
				});

				items.push({
					component: 'WorkflowActionButton',
					props: {
						label: t('publication.unschedule'),
						isWarnable: true,
						action: Actions.WORKFLOW_UNSCHEDULE_PUBLICATION,
					},
				});
			} else if (selectedPublication.status === pkp.const.STATUS_PUBLISHED) {
				items.push({
					component: 'WorkflowActionButton',
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
						component: 'WorkflowActionButton',
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
						contributorForm: pageInitConfig.contributorForm,
						canEditPublication: permissions.canEditPublication,
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
	identifiers: {
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
						formName: 'identifier',
						submission,
						publication: selectedPublication,
						canEdit: permissions.canEditPublication,
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

	license: {
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
						formName: 'permissionDisclosure',
						submission,
						publication: selectedPublication,
						canEdit: permissions.canEditPublication,
					},
				},
			];
		},
	},
};
