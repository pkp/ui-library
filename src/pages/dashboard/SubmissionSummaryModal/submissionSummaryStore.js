import {computed, ref, watch} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useWorkflowActions} from '../composables/useWorkflowActions';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import {useSummarySideNav} from './composables/useSummarySideNav';
import {useSubmission} from '@/composables/useSubmission';
import {useEditorWorkflowConfig} from './composables/useEditorWorkflowConfig';
import {useEditorPublicationConfig} from './composables/useEditorPublicationConfig';
import {useSideMenu} from '@/composables/useSideMenu';

export const useSubmissionSummaryStore = defineComponentStore(
	'submissionSummary',
	(props) => {
		const dashboardPage = props.pageInitConfig.dashboardPage;

		const {getReviewRound, getCurrentReviewRound} = useSubmission();

		/**
		 * Fetch submission details
		 */
		const {apiUrl: submissionApiUrl} = useUrl(
			`submissions/${encodeURIComponent(props.submissionId)}`,
		);
		const {data: submission, fetch: fetchSubmission} =
			useFetch(submissionApiUrl);

		/** Fetch publications */
		const selectedPublicationId = ref(null);
		function selectPublicationId(publicationId) {
			if (selectedPublicationId.value !== publicationId) {
				selectedPublicationId.value = publicationId;
				selectedPublication.value = null;
				fetchSelectedPublication();
			}
		}
		const selectedPublicationUrlRelative = computed(
			() =>
				`submissions/${encodeURIComponent(props.submissionId)}/publications/${selectedPublicationId.value}`,
		);
		const {apiUrl: selectedPublicationUrl} = useUrl(
			selectedPublicationUrlRelative,
		);
		const {data: selectedPublication, fetch: fetchSelectedPublication} =
			useFetch(selectedPublicationUrl);

		/**
		 * Data changes tracking
		 */
		const {triggerDataChange} = useDataChangedProvider(() => {
			fetchSubmission();
			fetchSelectedPublication();
		});

		/** Current publication is fetched always when the new submission is fetched */
		watch(submission, (newSubmission, oldSubmission) => {
			// Once the submission is fetched, select relevant stage in navigaton
			if (!oldSubmission && newSubmission) {
				selectedPublicationId.value =
					newSubmission.publications[newSubmission.publications.length - 1].id;
				fetchSelectedPublication();

				if (
					newSubmission.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
				) {
					setActiveItemKey(
						`workflow_${newSubmission.stageId}_${
							getCurrentReviewRound(
								newSubmission,
								pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
							)?.id
						}`,
					);
				} else if (
					newSubmission.stageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION &&
					newSubmission.status !== pkp.const.STATUS_QUEUED
				) {
					setActiveItemKey(`publication_titleAbstract`);
				} else {
					setActiveItemKey(`workflow_${newSubmission.stageId}`);
				}
			}
		});

		fetchSubmission();

		/**
		 * Handling navigation
		 */
		const {getMenuItems} = useSummarySideNav();
		const menuItems = computed(() => {
			if (!submission.value) {
				return [];
			}
			return getMenuItems(submission.value);
		});

		const {
			sideMenuProps,
			setExpandedKeys,
			setActiveItemKey,
			selectedItem: selectedMenuItem,
		} = useSideMenu(menuItems);

		const selectedMenuState = computed(() => {
			console.log('selectedMenuState:', selectedMenuItem.value?.actionArgs);
			return selectedMenuItem.value?.actionArgs || {};
		});

		setExpandedKeys([
			'workflow',
			'publication',
			`workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
		]);

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

		/**
		 * Handle user actions
		 *
		 */
		const _workflowActionsFns = useWorkflowActions(props.pageInitConfig);

		function handleAction(actionName, _actionArgs) {
			if (actionName === 'navigateToMenu') {
				setActiveItemKey(_actionArgs.key);
				return;
			}

			const actionArgs = {
				..._actionArgs,
				submission: submission.value,
				selectedPublication: selectedPublication.value,
			};

			_workflowActionsFns.handleAction(actionName, actionArgs, async () => {
				triggerDataChange();
			});
		}

		/** Primary Items */

		const _editorWorkflowConfigFns = useEditorWorkflowConfig();
		const _editorPublicationConfigFns = useEditorPublicationConfig();
		const stageTitle = computed(() => {
			return selectedMenuState.value?.title || '';
		});

		const primaryItems = computed(() => {
			if (!submission.value) {
				return [];
			}
			if (selectedMenuState.value.stageId) {
				return _editorWorkflowConfigFns.getPrimaryItems({
					submission: submission.value,
					selectedStageId: selectedMenuState.value.stageId,
					selectedReviewRound: selectedReviewRound.value,
				});
			} else if (selectedMenuState.value.publicationMenu) {
				if (!selectedPublication.value) {
					return [];
				}

				return _editorPublicationConfigFns.getPrimaryItems({
					submission: submission.value,
					selectedPublicationMenu: selectedMenuState.value.publicationMenu,
					pageInitConfig: props.pageInitConfig,
					selectedPublication: selectedPublication.value,
				});
			}

			return [];
		});

		const secondaryItems = computed(() => {
			if (!submission.value || selectedMenuState.value.publicationMenu) {
				return [];
			}

			return _editorWorkflowConfigFns.getSecondaryItems({
				submission: submission.value,
				selectedStageId: selectedMenuState.value.stageId,
				selectedReviewRound: selectedReviewRound.value,
			});
		});

		const actionItems = computed(() => {
			if (!submission.value || selectedMenuState.value.publicationMenu) {
				return [];
			}

			return _editorWorkflowConfigFns.getActionItems({
				submission: submission.value,
				selectedStageId: selectedMenuState.value.stageId,
				selectedReviewRound: selectedReviewRound.value,
			});
		});

		const publicationControlsLeft = computed(() => {
			if (!submission.value || !selectedMenuState.value.publicationMenu) {
				return [];
			}

			return _editorPublicationConfigFns.getPublicationControlsLeft({
				submission: submission.value,
				selectedPublicationMenu: selectedMenuState.value.publicationMenu,
				pageInitConfig: props.pageInitConfig,
				selectedPublication: selectedPublication.value,
				selectedPublicationId: selectedPublicationId.value,
			});
		});

		const publicationControlsRight = computed(() => {
			if (
				!submission.value ||
				!selectedPublication.value ||
				!selectedMenuState.value.publicationMenu
			) {
				return [];
			}

			const toReturn = _editorPublicationConfigFns.getPublicationControlsRight({
				submission: submission.value,
				selectedPublicationMenu: selectedMenuState.value.publicationMenu,
				pageInitConfig: props.pageInitConfig,
				selectedPublication: selectedPublication.value,
				selectedPublicationId: selectedPublicationId.value,
			});

			return toReturn;
		});

		return {
			dashboardPage,
			submission,
			selectedPublication,
			selectPublicationId,
			handleAction,

			/**
			 * Navigation
			 * */
			sideMenuProps,

			/**
			 * Summary
			 */
			stageTitle,
			primaryItems,
			secondaryItems,
			actionItems,
			publicationControlsLeft,
			publicationControlsRight,

			/**
			 * Expose for extensions
			 */

			_workflowActionsFns,
		};
	},
);
