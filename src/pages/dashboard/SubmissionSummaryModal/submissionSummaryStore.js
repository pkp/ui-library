import {computed, ref, watch} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useHandleActions} from '../composables/useHandleActions';
import {useDataChanged} from '@/composables/useDataChanged';
import {useSummarySideNav} from './composables/useSummarySideNav';
import {useSubmission} from '@/composables/useSubmission';
import {useSummaryEditorialConfig} from './composables/useSummaryEditorialConfig';

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
		watch(submission, () => {
			fetchCurrentPublication();
		});

		function fetchAll() {
			fetchSubmission();
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

		const selectedStageId = ref(pkp.const.WORKFLOW_STAGE_ID_SUBMISSION);
		const selectedReviewRoundId = ref(null);
		const {getReviewRound} = useSubmission();
		const selectedReviewRound = computed(() => {
			if (selectedReviewRoundId.value === null) {
				return null;
			}
			return getReviewRound(submission.value, selectedReviewRoundId.value);
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
			console.log('selectMenuItem:', action, actionArgs);
			if (action === 'selectStage') {
				selectedStageId.value = actionArgs.stageId;
				selectedReviewRoundId.value = actionArgs.reviewRoundId || null;
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

		const _editorialConfigFns = useSummaryEditorialConfig();

		const primaryItems = computed(() => {
			if (!submission.value) {
				return [];
			}
			console.log('primaryItems recalculate');
			return _editorialConfigFns.getPrimaryItems({
				submission: submission.value,
				selectedStageId: selectedStageId.value,
				selectedReviewRound: selectedReviewRound.value,
			});
		});

		const secondaryItems = computed(() => {
			if (!submission.value) {
				return [];
			}

			return _editorialConfigFns.getSecondaryItems({
				submission: submission.value,
				selectedStageId: selectedStageId.value,
				selectedReviewRound: selectedReviewRound.value,
			});
		});

		const actionItems = computed(() => {
			if (!submission.value) {
				return [];
			}

			return _editorialConfigFns.getActionItems({
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
			selectMenuItem,

			/**
			 * Summary
			 */
			primaryItems,
			secondaryItems,
			actionItems,

			/** Changes tracking */
			registerDataChangeCallback,
			triggerDataChange,
		};
	},
);
