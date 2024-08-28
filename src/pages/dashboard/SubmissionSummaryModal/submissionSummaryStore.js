import {computed, ref, watch} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useHandleActions} from '../composables/useHandleActions';
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

				selectedMenuState.value = {
					stageId: newSubmission.stageId,
				};
				if (
					newSubmission.stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
				) {
					selectedMenuState.value = {
						stageId: newSubmission.stageId,
						reviewRoundId: getCurrentReviewRound(
							newSubmission,
							pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						)?.id,
					};
					setActiveItemKey(
						`workflow_${newSubmission.stageId}_${selectedMenuState.value.reviewRoundId}`,
					);
				} else {
					setActiveItemKey(`workflow_${newSubmission.stageId}`);
				}
			}
		});

		fetchSubmission();

		/**
		 * Handling navigation
		 */

		const {sideMenuProps, setExpandedKeys, setActiveItemKey} = useSideMenu();
		setExpandedKeys([
			'workflow',
			'publication',
			`workflow_${pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW}`,
		]);
		const selectedMenuState = ref({});
		const {getReviewRound, getCurrentReviewRound} = useSubmission();
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

		const {getMenuItems} = useSummarySideNav();
		const menuItems = computed(() => {
			if (!submission.value) {
				return [];
			}
			return getMenuItems(submission.value);
		});

		function selectMenuItem(action, actionArgs) {
			selectedMenuState.value = actionArgs;
		}

		/**
		 * Handle user actions
		 *
		 */
		const {handleSubmissionAction} = useHandleActions(props.pageInitConfig);

		function handleAction(actionName, _actionArgs) {
			const actionArgs = {
				..._actionArgs,
				submission: submission.value,
				selectedPublication: selectedPublication.value,
			};

			handleSubmissionAction(actionName, actionArgs, async () => {
				triggerDataChange();
			});
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
				selectedStageId: selectedMenuState.value.stageId,
				selectedReviewRound: selectedReviewRound.value,
			});
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
			if (!submission.value || !selectedMenuState.value.publicationMenu) {
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
			menuItems,
			sideMenuProps,
			selectMenuItem,

			/**
			 * Summary
			 */
			stageTitle,
			primaryItems,
			secondaryItems,
			actionItems,
			publicationControlsLeft,
			publicationControlsRight,
		};
	},
);
