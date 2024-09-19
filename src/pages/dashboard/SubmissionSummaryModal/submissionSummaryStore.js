import {computed, ref, watch} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {
	useWorkflowActions,
	Actions as WorkflowActions,
} from '../composables/useWorkflowActions';

import {
	useWorkflowDecisions,
	Actions as DecisionActions,
} from '../composables/useWorkflowDecisions';

import {DashboardPageTypes} from '../dashboardPageStore';

import {useWorkflowEditorialConfig} from './composables/useWorkflowEditorialConfig';
import {useWorkflowAuthorConfig} from './composables/useWorkflowAuthorConfig';

import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import {useWorkflowNavigationConfig} from './composables/useWorkflowNavigationConfig';
import {useSubmission} from '@/composables/useSubmission';
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
			return Promise.all([fetchSubmission(), fetchSelectedPublication()]);
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
		const {getMenuItems} = useWorkflowNavigationConfig(props.pageInitConfig);
		const menuItems = computed(() => {
			if (!submission.value) {
				return [];
			}
			return getMenuItems(submission.value);
		});

		function navigateToMenu({key}) {
			setActiveItemKey(key);
			return;
		}

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
		 * Expose workflow actions
		 *
		 */
		const _workflowActionsFns = useWorkflowActions(props.pageInitConfig);
		const workflowActions = Object.values(WorkflowActions).reduce(
			(acc, actionName) => {
				acc[actionName] = (noArgs, finishedCallback = null) =>
					_workflowActionsFns[actionName](
						{
							submission: submission.value,
							selectedPublication: selectedPublication.value,
							reviewRoundId: selectedReviewRound.value?.id,
						},
						(finishedData) => {
							console.log('finished workflow actions:');
							triggerDataChange();
							if (finishedCallback) {
								finishedCallback(finishedData);
							}
						},
					);
				return acc;
			},
			{},
		);

		/**
		 * Expose decision functions
		 *
		 * */
		const _workflowDecisionsFns = useWorkflowDecisions();
		const decisionActions = Object.values(DecisionActions).reduce(
			(acc, actionName) => {
				acc[actionName] = (noArgs) =>
					_workflowDecisionsFns[actionName]({
						submission: submission.value,
						selectedPublication: selectedPublication.value,
						reviewRoundId: selectedReviewRound.value?.id,
					});
				return acc;
			},
			{},
		);

		/**
		 * Items
		 *
		 * */

		const _workflowEditorialConfigFns =
			dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD
				? useWorkflowEditorialConfig()
				: useWorkflowAuthorConfig();

		const stageTitle = computed(() => {
			return selectedMenuState.value?.title || '';
		});

		function _getItemsArgs() {
			return {
				selectedMenuState: selectedMenuState.value,
				submission: submission.value,
				pageInitConfig: props.pageInitConfig,
				selectedPublication: selectedPublication.value,
				selectedPublicationId: selectedPublicationId.value,
				selectedReviewRound: selectedReviewRound.value,
			};
		}

		/** Header Actions */
		const headerItems = computed(() => {
			return _workflowEditorialConfigFns.getHeaderItems({
				submission: submission.value,
				selectedPublication: selectedPublication.value,
				publicationSettings: props.pageInitConfig.publicationSettings,
			});
		});

		const primaryItems = computed(() => {
			return _workflowEditorialConfigFns.getPrimaryItems(_getItemsArgs());
		});

		const secondaryItems = computed(() => {
			return _workflowEditorialConfigFns.getSecondaryItems(_getItemsArgs());
		});

		const actionItems = computed(() => {
			return _workflowEditorialConfigFns.getActionItems(_getItemsArgs());
		});

		const publicationControlsLeft = computed(() => {
			return _workflowEditorialConfigFns.getPublicationControlsLeft(
				_getItemsArgs(),
			);
		});

		const publicationControlsRight = computed(() => {
			return _workflowEditorialConfigFns.getPublicationControlsRight(
				_getItemsArgs(),
			);
		});

		return {
			dashboardPage,
			submission,
			selectedPublication,
			selectPublicationId,

			/**
			 * Navigation
			 * */
			selectedMenuItem,
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
			stageTitle,
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
		};
	},
);
