import {computed, inject} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {
	useWorkflowActions,
	Actions as WorkflowActions,
} from './composables/useWorkflowActions';

import {
	useWorkflowDecisions,
	Actions as DecisionActions,
} from './composables/useWorkflowDecisions';

import {useFileManagerActions} from '@/managers/FileManager/useFileManagerActions';

import {useDataChangedProvider} from '@/composables/useDataChangedProvider';

import {wrapActionFns} from '@/utils/wrapActionFns';

import {useWorkflowDataSubmissionPublication} from './composables/useWorkflowDataSubmissionPublication';
import {useWorkflowPermissions} from './composables/useWorkflowPermissions';
import {useWorkflowMenu} from './composables/useWorkflowMenu';
import {useWorkflowItems} from './composables/useWorkflowItems';
import {useSubmission} from '@/composables/useSubmission';
import {useExtender} from '@/composables/useExtender';

export const useWorkflowStore = defineComponentStore(
	'workflow',
	({props, Components, useWorkflowConfig, useWorkflowNavigationConfig}) => {
		const dashboardPage = props.pageInitConfig.dashboardPage;

		const extender = useExtender();
		/**
		 * Action to close the workflow from inside
		 * */
		const closeWorkflowModal = inject('closeModal');

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
		} = useWorkflowDataSubmissionPublication({
			submissionId: props.submissionId,
		});

		const selectedReviewRound = computed(() => {
			if (!selectedMenuState.value.reviewRoundId) {
				return null;
			}
			const reviewRound = getReviewRound(
				submission.value,
				selectedMenuState.value.reviewRoundId,
			);
			return reviewRound;
		});

		const {getExtendedStage, getExtendedStageLabel, getReviewRound} =
			useSubmission();

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

		const workflowNavigationConfig = extender.addFns(
			useWorkflowNavigationConfig(props.pageInitConfig),
		);

		const menuItems = computed(() =>
			workflowNavigationConfig.getMenuItems({
				submission: submission.value,
				permissions: permissions.value,
			}),
		);

		const {
			menuTitle,
			navigateToMenu,
			selectedMenuState,
			setExpandedKeys,
			sideMenuProps,
		} = useWorkflowMenu({menuItems, submission, workflowNavigationConfig});

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
		 * File Manager actions
		 */
		/**
		 * File Manager actions
		 */
		const _fileManagerActionFns = useFileManagerActions();

		function fileUpload(args) {
			_fileManagerActionFns.fileUpload(
				{
					submission: submission.value,
					selectedPublication: selectedPublication.value,
					reviewRoundId: selectedReviewRound.value?.id,
					...args,
				},
				() => triggerDataChange(),
			);
		}

		/**
		 * Items
		 *
		 * */

		const _workflowConfigFns = extender.addFns(
			useWorkflowConfig({dashboardPage}),
		);

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
			publicationSettings: props.pageInitConfig.publicationSettings,
		}));

		const store = {
			dashboardPage,
			closeWorkflowModal,

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
			setExpandedKeys,

			/** Actions
			 *
			 */
			...workflowActions,
			...decisionActions,

			/**
			 * File manager actions
			 */
			fileUpload,

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
			extender,
		};
		return store;
	},
);
