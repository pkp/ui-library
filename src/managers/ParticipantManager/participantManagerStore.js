import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, computed, watch} from 'vue';

import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

import {useParticipantManagerActions} from './useParticipantManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';
import {useParticipantManagerConfig} from './useParticipantManagerConfig';

export const useParticipantManagerStore = defineComponentStore(
	'participantManager',
	(props) => {
		const submissionId = ref(props.submission.id);

		const relativeUrl = computed(() => {
			return `submissions/${encodeURIComponent(submissionId.value)}/participants/${props.submissionStageId}`;
		});

		const {apiUrl: participantApiUrl} = useUrl(relativeUrl);

		const {data: participants, fetch: fetchParticipants} =
			useFetch(participantApiUrl);

		watch(relativeUrl, () => {
			participants.value = null;
			fetchParticipants();
		});

		fetchParticipants();

		const {triggerDataChange} = useDataChanged(() => fetchParticipants());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		const participantsList = computed(() => {
			if (!participants.value) {
				return [];
			}
			const list = [];
			participants.value.forEach((participant) => {
				participant.stageAssignments.forEach((stageAssignment) => {
					list.push({
						id: participant.id,
						fullName: participant.fullName,
						stageAssignmentId: stageAssignment.stageAssignmentId,
						roleName: stageAssignment.stageAssignmentUserGroup.name,
						roleId: stageAssignment.stageAssignmentUserGroup.roleId,
						userGroupId: stageAssignment.stageAssignmentUserGroup.id,
						recommendOnly: stageAssignment.recommendOnly,
						displayInitials: participant.displayInitials,
						canLoginAs: participant.canLoginAs,
					});
				});
			});

			list.sort((participantA, participantB) => {
				// First, compare by roleId
				if (participantA.roleId !== participantB.roleId) {
					return participantA.roleId - participantB.roleId;
				}

				// If roleIds are equal, compare by userGroupId
				return participantA.userGroupId - participantB.userGroupId;
			});

			return list;
		});

		/**
		 * Config
		 */
		const participantManagerConfig = useParticipantManagerConfig();

		/**
		 * Handling actions
		 */

		const _actionFns = useParticipantManagerActions();

		const topItems = computed(() =>
			participantManagerConfig.getTopItems({
				submission: props.submission,
				submissionStageId: props.submissionStageId,
			}),
		);

		function getItemActions({participant}) {
			return participantManagerConfig.getItemActions({
				submission: props.submission,
				submissionStageId: props.submissionStageId,
				participant,
			});
		}

		function enrichActionArg(args) {
			return {
				submissionStageId: props.submissionStageId,
				submission: props.submission,
				...args,
			};
		}

		function participantAssign() {
			_actionFns.participantAssign(
				enrichActionArg({}),
				triggerDataChangeCallback,
			);
		}

		function participantRemove({participant}) {
			_actionFns.participantRemove(
				enrichActionArg({participant}),
				triggerDataChangeCallback,
			);
		}

		function participantNotify({participant}) {
			_actionFns.participantNotify(
				enrichActionArg({participant}),
				triggerDataChangeCallback,
			);
		}

		function participantEdit({participant}) {
			_actionFns.participantEdit(
				enrichActionArg({participant}),
				triggerDataChangeCallback,
			);
		}

		function participantLoginAs({participant}) {
			_actionFns.participantLoginAs(
				enrichActionArg({participant}),
				triggerDataChangeCallback,
			);
		}

		return {
			participantsList,
			_actionFns,
			topItems,
			getItemActions,
			participantAssign,
			participantRemove,
			participantNotify,
			participantEdit,
			participantLoginAs,
		};
	},
);
