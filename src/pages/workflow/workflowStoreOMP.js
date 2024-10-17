import {computed, watch, markRaw} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {
	useWorkflowActions,
	Actions as WorkflowActions,
} from './composables/useWorkflowActions';

import {
	useWorkflowDecisions,
	Actions as DecisionActions,
} from './composables/useWorkflowDecisions';

import {useDataChangedProvider} from '@/composables/useDataChangedProvider';

import {wrapActionFns} from '@/utils/wrapActionFns';

import {useWorkflowConfigOMP as useWorkflowConfig} from './composables/useWorkflowConfig/useWorkflowConfigOMP';
import {useWorkflowNavigationConfigOMP as useWorkflowNavigationConfig} from './composables/useWorkflowNavigationConfig/useWorkflowNavigationConfigOMP';

import {useWorkflowDataSubmissionPublication} from './composables/useWorkflowDataSubmissionPublication';
import {useWorkflowPermissions} from './composables/useWorkflowPermissions';
import {useWorkflowMenu} from './composables/useWorkflowMenu';
import {useWorkflowItems} from './composables/useWorkflowItems';
import {useSubmission} from '@/composables/useSubmission';

import FileManager from '@/managers/FileManager/FileManager.vue';
import ReviewerManager from '@/managers/ReviewerManager/ReviewerManager.vue';
import DiscussionManager from '@/managers/DiscussionManager/DiscussionManager.vue';
import ContributorManager from '@/managers/ContributorManager/ContributorManager.vue';
import ParticipantManager from '@/managers/ParticipantManager/ParticipantManager.vue';
import GalleyManager from '@/managers/GalleyManager/GalleyManager.vue';
import ChapterManager from '@/managers/ChapterManager/ChapterManager.vue';
import PublicationFormatManager from '@/managers/PublicationFormatManager/PublicationFormatManager.vue';
import RepresentativeManager from '@/managers/RepresentativeManager/RepresentativeManager.vue';
import WorkflowMarketingForm from './components/publication/WorkflowMarketingForm.vue';
import WorkflowWorkTypeOMP from './components/header/WorkflowWorkTypeOMP.vue';
import WorkflowActionButton from './components/action/WorkflowActionButton.vue';
import WorkflowRecommendOnlyControls from './components/action/WorkflowRecommendOnlyControls.vue';
import WorkflowRecommendOnlyListingRecommendations from './components/secondary/WorkflowRecommendOnlyListingRecommendations.vue';
import WorkflowNotificationDisplay from './components/primary/WorkflowNotificationDisplay.vue';
import WorkflowPublicationForm from './components/publication/WorkflowPublicationForm.vue';
import WorkflowPublicationVersionControl from './components/publication/WorkflowPublicationVersionControl.vue';
import WorkflowChangeSubmissionLanguage from './components/publication/WorkflowChangeSubmissionLanguage.vue';
import WorkflowPrimaryBasicMetadata from './components/primary/WorkflowPrimaryBasicMetadata.vue';
import WorkflowReviewRoundStatus from './components/primary/WorkflowReviewRoundStatus.vue';
import WorkflowSubmissionStatus from './components/primary/WorkflowSubmissionStatus.vue';
import WorkflowPublicationEditDisabled from './components/publication/WorkflowPublicationEditDisabled.vue';

export const useWorkflowStore = defineComponentStore('workflow', (props) => {
	const dashboardPage = props.pageInitConfig.dashboardPage;

	/**
	 * Submission & Publication
	 */
	const {
		submission,
		submissionId,
		selectPublicationId,
		selectedPublication,
		selectedPublicationId,
		refetchSubmissionPublication,
	} = useWorkflowDataSubmissionPublication({submissionId: props.submissionId});

	const {getExtendedStage, getExtendedStageLabel} = useSubmission();

	/**
	 * Current Stage Indication
	 */
	const extendedStage = computed(
		() => submission.value && getExtendedStage(submission.value),
	);
	const stageLabel = computed(
		() => submission.value && getExtendedStageLabel(submission.value),
	);

	/**
	 * Data changes tracking
	 */
	const {triggerDataChange} = useDataChangedProvider(() => {
		return refetchSubmissionPublication();
	});

	/**
	 * UI Permissions
	 */
	const {permissions} = useWorkflowPermissions({
		submission,
		selectedPublication,
	});

	/**
	 * Navigation
	 */

	const {getMenuItems, getInitialSelectionItemKey} =
		useWorkflowNavigationConfig(props.pageInitConfig);

	const menuItems = computed(() =>
		getMenuItems({
			submission: submission.value,
			permissions: permissions.value,
		}),
	);

	const {
		menuTitle,
		navigateToMenu,
		selectedMenuState,
		selectedReviewRound,
		setExpandedKeys,
		sideMenuProps,
	} = useWorkflowMenu({menuItems, submission});

	setExpandedKeys([
		'workflow',
		'publication',
		'marketing',
		`workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
		`workflow_${pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW}`,
	]);

	/** When submission is loaded initially - select relevant menu */
	watch(submission, (newSubmission, oldSubmission) => {
		// Once the submission is fetched, select relevant stage in navigaton
		if (!oldSubmission && newSubmission) {
			navigateToMenu(getInitialSelectionItemKey(newSubmission));
		}
	});

	/**
	 * Expose workflow actions
	 *
	 */
	const _workflowActionsFns = useWorkflowActions(props.pageInitConfig);
	const workflowActions = wrapActionFns(
		WorkflowActions,
		_workflowActionsFns,
		(actionFn, actionArgs, finishedCallback = null) =>
			actionFn(
				{
					...actionArgs,
					submission: submission.value,
					selectedPublication: selectedPublication.value,
					reviewRoundId: selectedReviewRound.value?.id,
					store,
				},
				(finishedData) => {
					triggerDataChange();
					if (finishedCallback) {
						finishedCallback(finishedData);
					}
				},
			),
	);

	/**
	 * Expose decision functions
	 *
	 * */
	const _workflowDecisionsFns = useWorkflowDecisions();
	const decisionActions = wrapActionFns(
		DecisionActions,
		_workflowDecisionsFns,
		(actionFn, actionArgs) =>
			actionFn({
				...actionArgs,
				submission: submission.value,
				selectedPublication: selectedPublication.value,
				reviewRoundId: selectedReviewRound.value?.id,
			}),
	);

	/**
	 * Items
	 *
	 * */

	const _workflowConfigFns = useWorkflowConfig({dashboardPage});

	const {
		headerItems,
		primaryItems,
		secondaryItems,
		actionItems,
		publicationControlsLeft,
		publicationControlsRight,
	} = useWorkflowItems(_workflowConfigFns, () => ({
		selectedMenuState: selectedMenuState.value,
		submission: submission.value,
		pageInitConfig: props.pageInitConfig,
		selectedPublication: selectedPublication.value,
		selectedPublicationId: selectedPublicationId.value,
		selectedReviewRound: selectedReviewRound.value,
		permissions: permissions.value,
	}));

	const Components = markRaw({
		FileManager,
		ReviewerManager,
		DiscussionManager,
		ContributorManager,
		ParticipantManager,
		GalleyManager,
		ChapterManager,
		RepresentativeManager,
		PublicationFormatManager,
		WorkflowActionButton,
		WorkflowRecommendOnlyControls,
		WorkflowRecommendOnlyListingRecommendations,
		WorkflowNotificationDisplay,
		WorkflowPrimaryBasicMetadata,
		WorkflowReviewRoundStatus,
		WorkflowPublicationForm,
		WorkflowPublicationVersionControl,
		WorkflowChangeSubmissionLanguage,
		WorkflowSubmissionStatus,
		WorkflowPublicationEditDisabled,
		WorkflowMarketingForm,
		WorkflowWorkTypeOMP,
	});

	const store = {
		dashboardPage,
		submission,
		submissionId,
		selectedPublication,
		selectPublicationId,
		extendedStage,
		stageLabel,

		/**
		 * Navigation
		 * */
		sideMenuProps,
		selectedMenuState,
		navigateToMenu,

		/** Actions
		 *
		 */
		...workflowActions,
		...decisionActions,

		/**
		 * Summary
		 */
		menuTitle,
		headerItems,
		primaryItems,
		secondaryItems,
		actionItems,
		publicationControlsLeft,
		publicationControlsRight,

		/**
		 * Expose for extensions
		 */

		_workflowActionsFns,
		_workflowDecisionsFns,

		Components,
	};
	return store;
});
