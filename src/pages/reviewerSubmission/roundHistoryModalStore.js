import {defineComponentStore} from '@/utils/defineComponentStore';

import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';

export const useRoundHistoryModalStore = defineComponentStore(
	'roundHistoryModal',
	(props) => {
		const {apiUrl: reviewRoundHistoryApiUrl} = useApiUrl(
			`reviews/history/${props.submissionId}/${props.reviewRoundId}`,
		);
		const {fetch: fetchReviewRoundHistory, data: reviewRoundHistory} = useFetch(
			reviewRoundHistoryApiUrl
		);

		fetchReviewRoundHistory();

		return {
			reviewRoundHistory,
			submissionId: props.submissionId,
			reviewRoundId: props.reviewRoundId,
			reviewRoundNumber: props.reviewRoundNumber,
		};
	},
);
