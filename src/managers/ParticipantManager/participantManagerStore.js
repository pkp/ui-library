import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, computed} from 'vue';

import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

import {useLocalize} from '@/composables/useLocalize';
import {useParticipantManagerActions} from './useParticipantManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';

export const useParticipantManagerStore = defineComponentStore(
	'participantManager',
	(props) => {
		const {localize} = useLocalize();

		const submissionId = ref(props.submission.id);

		const {apiUrl: participantApiUrl} = useUrl(
			`submissions/${encodeURIComponent(submissionId.value)}/participants`,
		);
		const {data: participants, fetch: fetchParticipants} =
			useFetch(participantApiUrl);

		fetchParticipants();

		const {triggerDataChange} = useDataChanged(() => fetchParticipants());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		const participantsList = computed(() => {
			if (!participants.value) {
				return [];
			}

			return participants.value.map((participant) => ({
				id: participant.id,
				fullName: participant.fullName,
				roleName: localize(
					// todo use the role thats will be added to the api and coming from the stage_assignments
					participant.groups[0].name,
				),
			}));
		});

		/**
		 * Handling actions
		 */

		const _actionFns = useParticipantManagerActions();

		const itemActions = computed(() => _actionFns.getItemActions({}));

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
			itemActions,
			participantAssign,
			participantRemove,
			participantNotify,
			participantEdit,
			participantLoginAs,
		};
	},
);
