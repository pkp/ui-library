import {defineComponentStore} from '@/utils/defineComponentStore';

import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';

export const useRoundHistoryModalStore = defineComponentStore(
	'roundHistoryModal',
	(props) => {
		const {apiUrl: submissionApiUrl} = useApiUrl(
			`submissions/${props.submissionId}`,
		);
		const {fetch: fetchSubmission, data: submission} =
			useFetch(submissionApiUrl);

		fetchSubmission();

		return {
			submission,
			submissionId: props.submissionId,
			reviewRoundId: props.reviewRoundId,
			reviewRoundNumber: props.reviewRoundNumber,
		};
	},
);
