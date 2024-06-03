import {computed, watch} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSummaryConfig} from './composables/useSummaryConfig';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useParticipant} from '@/composables/useParticipant';
import {useHandleActions} from '../composables/useHandleActions';
import {useLocalize} from '@/composables/useLocalize';
import {useDataChanged} from '@/composables/useDataChanged';
import {DashboardPageTypes} from '../dashboardPageStore';

export const useSubmissionSummaryStore = defineComponentStore(
	'submissionSummary',
	(props) => {
		const dashboardPage = props.pageInitConfig.dashboardPage;

		const {localize} = useLocalize();

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

		/** Fetch issue */
		const issueUrlRelative = computed(
			() => `issues/${currentPublication.value?.issueId}`,
		);
		const {apiUrl: issueUrl} = useUrl(issueUrlRelative);
		const {data: issue, fetch: fetchIssue} = useFetch(issueUrl);

		watch(currentPublication, () => {
			console.log('watching current publication:');
			if (currentPublication.value?.issueId) {
				fetchIssue();
			}
		});

		/**
		 * Fetch submission participants
		 */
		const {apiUrl: participantApiUrl} = useUrl(
			`submissions/${encodeURIComponent(props.submissionId)}/participants`,
		);
		const {data: participants, fetch: fetchParticipants} =
			useFetch(participantApiUrl);

		function fetchAll() {
			fetchSubmission();
			// TOOD consider whether this might be better to fetch within components that needs it
			if (dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD) {
				fetchParticipants();
			}
			triggerDataChange();
		}

		fetchAll();

		const {
			getEditorRoleIds,
			hasParticipantAtLeastOneRole,
			getFirstGroupWithFollowingRoles,
		} = useParticipant();

		/** TODO: Might be moved directly to the component? */
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
					console.log('handle Action after modal is closed');
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
			selectedReviewAssignment,
			currentPublication,
			issue,
			associatedEditors,
			handleAction,

			/**
			 * Summary
			 */
			getPrimaryItems,
			getActionItems,
			getMetaItems,
			filterItemsBasedOnContext,

			/** Changes tracking */
			registerDataChangeCallback,
			triggerDataChange,
		};
	},
);
