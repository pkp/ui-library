import {computed, ref, watch} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useHandleActions} from '../composables/useHandleActions';
import {useDataChanged} from '@/composables/useDataChanged';
import {useSummarySideNav} from './composables/useSummarySideNav';
import {useSubmission} from '@/composables/useSubmission';
import {useEditorWorkflowConfig} from './composables/useEditorWorkflowConfig';
import {useEditorPublicationConfig} from './composables/useEditorPublicationConfig';
import {useSideMenu} from '@/composables/useSideMenu';

export const useSubmissionSummaryStore = defineComponentStore(
	'submissionSummary',
	(props) => {
		const dashboardPage = props.pageInitConfig.dashboardPage;

		/**
		 * Data changes tracking
		 */
		const {registerDataChangeCallback, triggerDataChange} = useDataChanged();

		/**
		 * Fetch submission details
		 */
		const {apiUrl: submissionApiUrl} = useUrl(
			`submissions/${encodeURIComponent(props.submissionId)}`,
		);
		const {data: submission, fetch: fetchSubmission} =
			useFetch(submissionApiUrl);

		const selectedReviewAssignment = computed(() => {
			return (
				submission.value?.reviewAssignments?.find(
					(reviewAssignment) =>
						reviewAssignment.id === props.reviewAssignmentId,
				) || null
			);
		});

		/** Fetch publications */
		const currentPublicationUrlRelative = computed(
			() =>
				`submissions/${encodeURIComponent(props.submissionId)}/publications/${submission.value?.currentPublicationId}`,
		);
		const {apiUrl: currentPublicationUrl} = useUrl(
			currentPublicationUrlRelative,
		);
		const {data: currentPublication, fetch: fetchCurrentPublication} = useFetch(
			currentPublicationUrl,
		);

		/** Current publication is fetched always when the new submission is fetched */
		watch(submission, (newSubmission, oldSubmission) => {
			// Once the submission is fetched, select relevant stage in navigaton
			if (!oldSubmission && newSubmission) {
				selectedStageId.value = newSubmission.stageId;
				if (
					newSubmission.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
				) {
					selectedReviewRoundId.value = getCurrentReviewRound(
						newSubmission,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
					)?.id;
					setActiveItemKey(
						`workflow_${newSubmission.stageId}_${selectedReviewRoundId.value}`,
					);
				} else {
					setActiveItemKey(`workflow_${newSubmission.stageId}`);
				}
			}

			fetchCurrentPublication();
		});

		async function fetchAll() {
			await fetchSubmission();
			// TOOD consider whether this might be better to fetch within components that needs it
			/*if (dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD) {
				fetchParticipants();
			}*/
			triggerDataChange();
		}

		fetchAll();

		/**
		 * Handling navigation
		 */

		const {expandedKeys, setExpandedKeys, setActiveItemKey, activeItemKey} =
			useSideMenu();
		setExpandedKeys([
			'workflow',
			'publication',
			`workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
		]);
		const selectedStageId = ref(pkp.const.WORKFLOW_STAGE_ID_SUBMISSION);
		const selectedReviewRoundId = ref(null);
		const selectedPublicationMenu = ref(null);

		const {getReviewRound, getCurrentReviewRound} = useSubmission();
		const selectedReviewRound = computed(() => {
			if (selectedReviewRoundId.value === null) {
				return null;
			}
			const reviewRound = getReviewRound(
				submission.value,
				selectedReviewRoundId.value,
			);
			return reviewRound;
		});

		const {getMenuItems} = useSummarySideNav();
		const menuItems = computed(() => {
			if (!submission.value) {
				return [];
			}
			return getMenuItems(submission.value);
		});

		/*const {sideNavProps, openAll, open, closeAll, selectItem} =
			useSideMenu(menuItemsConfig);

		openAll();
		selectItem([
			'workflow',
			pkp.const.pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
			activeReviewRoundId,
		]);*/

		function selectMenuItem(action, actionArgs) {
			if (action === 'selectStage') {
				selectedStageId.value = actionArgs.stageId;
				selectedReviewRoundId.value = actionArgs.reviewRoundId || null;
				selectedPublicationMenu.value = null;
			} else if (action === 'selectPublicationMenu') {
				selectedPublicationMenu.value = actionArgs.menu;
				selectedStageId.value = null;
				selectedReviewRoundId.value = null;
			}
		}

		/**
		 * Handle user actions
		 *
		 */
		const {handleSubmissionAction} = useHandleActions(props.pageInitConfig);

		function handleAction(actionName, _actionArgs) {
			const actionArgs = {..._actionArgs};
			if (selectedReviewAssignment.value) {
				actionArgs.reviewAssignmentId = selectedReviewAssignment.value.id;
			}

			handleSubmissionAction(
				submission.value,
				actionName,
				actionArgs,
				async () => {
					fetchAll();
				},
			);
		}

		/** Primary Items */

		const _editorWorkflowConfigFns = useEditorWorkflowConfig();
		const _editorPublicationConfigFns = useEditorPublicationConfig();
		const stageTitle = computed(() => {
			if (!submission.value) {
				return '';
			}
			return _editorWorkflowConfigFns.getTitle({
				submission: submission.value,
				selectedStageId: selectedStageId.value,
				selectedReviewRound: selectedReviewRound.value,
			});
		});

		const primaryItems = computed(() => {
			if (!submission.value) {
				return [];
			}
			if (selectedStageId.value) {
				return _editorWorkflowConfigFns.getPrimaryItems({
					submission: submission.value,
					selectedStageId: selectedStageId.value,
					selectedReviewRound: selectedReviewRound.value,
				});
			} else if (selectedPublicationMenu.value) {
				return _editorPublicationConfigFns.getPrimaryItems({
					submission: submission.value,
					selectedPublicationMenu: selectedPublicationMenu.value,
					pageInitConfig: props.pageInitConfig,
					selectedPublication: currentPublication.value,
				});
			}

			return [];
		});

		const secondaryItems = computed(() => {
			if (!submission.value) {
				return [];
			}

			return _editorWorkflowConfigFns.getSecondaryItems({
				submission: submission.value,
				selectedStageId: selectedStageId.value,
				selectedReviewRound: selectedReviewRound.value,
			});
		});

		const actionItems = computed(() => {
			if (!submission.value) {
				return [];
			}

			return _editorWorkflowConfigFns.getActionItems({
				submission: submission.value,
				selectedStageId: selectedStageId.value,
				selectedReviewRound: selectedReviewRound.value,
			});
		});

		return {
			dashboardPage,
			submission,
			selectedReviewAssignment,
			currentPublication,
			//associatedEditors,
			handleAction,

			/**
			 * Navigation
			 * */
			selectedStageId,
			selectedReviewRoundId,
			menuItems,
			expandedKeys,
			activeItemKey,
			selectMenuItem,

			/**
			 * Summary
			 */
			stageTitle,
			primaryItems,
			secondaryItems,
			actionItems,

			/** Changes tracking */
			registerDataChangeCallback,
			triggerDataChange,
		};
	},
);
