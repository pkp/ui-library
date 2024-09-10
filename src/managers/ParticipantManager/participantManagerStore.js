import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, computed} from 'vue';

import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

import {useLocalize} from '@/composables/useLocalize';
import {useParticipantManagerActions} from './useParticipantManagerActions';

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

		function handleAction(actionName, _args) {
			_actionFns.handleAction(
				actionName,
				{
					..._args,
					submissionStageId: props.submissionStageId,
					submission: props.submission,
				},
				() => fetchParticipants(),
			);
		}

		return {
			participantsList,
			_actionFns,
			handleAction,
			itemActions,
		};
	},
);
