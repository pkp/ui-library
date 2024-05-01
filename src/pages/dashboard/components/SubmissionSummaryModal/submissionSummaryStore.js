import {computed, watch} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSummaryConfig} from './composables/useSummaryConfig';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useParticipant} from '@/composables/useParticipant';
import {useHandleActions} from '../../composables/useHandleActions';
import {useLocalize} from '@/composables/useLocalize';

const DashboardPageTypes = {
	EDITORIAL_DASHBOARD: 'editorialDashboard',
	MY_REVIEW_ASSIGNMENTS: 'myReviewAssignments',
	MY_SUBMISSIONS: 'mySubmissions',
};

export const useSubmissionSummaryStore = defineComponentStore(
	'submissionSummary',
	(initValues) => {
		const dashboardPage = initValues.pageInitConfig.dashboardPage;

		const {localize} = useLocalize();

		/**
		 * Fetch submission details
		 */
		const {apiUrl: submissionApiUrl} = useUrl(
			`submissions/${encodeURIComponent(initValues.submissionId)}`,
		);
		const {data: submission, fetch: fetchSubmission} =
			useFetch(submissionApiUrl);

		/** Fetch publications */
		const currentPublicationUrlRelative = computed(
			() =>
				`submissions/${encodeURIComponent(initValues.submissionId)}/publications/${submission.value?.currentPublicationId}`,
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

		/**
		 * Fetch submission participants
		 */
		const {apiUrl: participantApiUrl} = useUrl(
			`submissions/${encodeURIComponent(initValues.submissionId)}/participants`,
		);
		const {data: participants, fetch: fetchParticipants} =
			useFetch(participantApiUrl);

		function fetchAll() {
			fetchSubmission();
			// TOOD consider whether this might be better to fetch within components that needs it
			if (dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD) {
				fetchParticipants();
			}
		}

		fetchAll();

		const {
			getEditorRoleIds,
			hasParticipantAtLeastOneRole,
			getFirstGroupWithFollowingRoles,
		} = useParticipant();

		const associatedEditors = computed(() => {
			if (!participants.value) {
				return [];
			}

			return participants.value
				.filter((participant) =>
					hasParticipantAtLeastOneRole(participant, getEditorRoleIds()),
				)
				.map((participant) => ({
					id: participant.id,
					fullName: participant.fullName,
					roleName: localize(
						getFirstGroupWithFollowingRoles(participant, getEditorRoleIds())
							.name,
					),
				}));
		});

		/**
		 * Handle user actions
		 *
		 */
		const {handleSubmissionAction} = useHandleActions(
			initValues.pageInitConfig,
		);

		function handleAction(actionName, actionArgs) {
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
		const {
			getPrimaryItems,
			getActionItems,
			getMetaItems,
			filterItemsBasedOnContext,
		} = useSummaryConfig();

		return {
			dashboardPage,
			submission,
			currentPublication,
			associatedEditors,
			handleAction,

			/**
			 * Summary
			 */
			getPrimaryItems,
			getActionItems,
			getMetaItems,
			filterItemsBasedOnContext,
		};
	},
);
