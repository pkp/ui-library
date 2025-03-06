import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed} from 'vue';
import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();

export const useRoundHistoryModalStore = defineComponentStore(
	'roundHistoryModal',
	(props) => {
		const {t, localize} = useLocalize();

		const {apiUrl: reviewRoundHistoryApiUrl} = useApiUrl(
			`reviews/history/${props.submissionId}/${props.reviewRoundId}`,
		);
		const {fetch: fetchReviewRoundHistory, data: reviewRoundHistory} = useFetch(
			reviewRoundHistoryApiUrl,
		);

		fetchReviewRoundHistory();

		// even incomplete submission consider as declined to keep it simple
		const isDeclined = computed(() => {
			return reviewRoundHistory.value?.reviewAssignment?.declined;
		});

		const isIncomplete = computed(() => {
			return !reviewRoundHistory.value?.reviewAssignment?.dateCompleted;
		});

		const articleMetadata = computed(() => {
			const metadata = [];

			if (reviewRoundHistory.value?.publicationType) {
				metadata.push({
					heading: t('reviewer.submission.reviewRound.metadata.type'),
					body: localize(reviewRoundHistory.value.publicationType),
				});
			}

			if (reviewRoundHistory.value?.publicationAbstract) {
				metadata.push({
					heading: t('reviewer.submission.reviewRound.metadata.abstract'),
					bodyHtml: localize(reviewRoundHistory.value.publicationAbstract),
				});
			}

			if (reviewRoundHistory.value?.publicationKeywords) {
				metadata.push({
					heading: t('reviewer.submission.reviewRound.metadata.keywords'),
					body: localize(reviewRoundHistory.value.publicationKeywords).join(
						', ',
					),
				});
			}
			return metadata;
		});

		const generalInformation = computed(() => {
			const information = [];

			if (reviewRoundHistory.value?.reviewAssignment?.dateNotified) {
				information.push({
					heading: t('reviewer.submission.reviewRequestDate'),
					body: formatShortDate(
						reviewRoundHistory.value.reviewAssignment.dateNotified,
					),
				});
			}

			if (reviewRoundHistory.value?.reviewAssignment?.dateResponseDue) {
				information.push({
					heading: t('reviewer.submission.responseDueDate'),
					body: formatShortDate(
						reviewRoundHistory.value.reviewAssignment.dateResponseDue,
					),
				});
			}

			if (!reviewRoundHistory.value?.reviewAssignment?.declined) {
				if (reviewRoundHistory.value?.reviewAssignment?.dateConfirmed) {
					information.push({
						heading: t('reviewer.submission.acceptedOn'),
						body: formatShortDate(
							reviewRoundHistory.value.reviewAssignment.dateConfirmed,
						),
					});
				}

				if (reviewRoundHistory.value?.reviewAssignment?.dateDue) {
					information.push({
						heading: t('reviewer.submission.reviewDueDate'),
						body: formatShortDate(
							reviewRoundHistory.value.reviewAssignment.dateDue,
						),
					});
				}

				if (reviewRoundHistory.value?.reviewAssignment?.dateCompleted) {
					information.push({
						heading: t('reviewer.submission.submittedOn'),
						body: formatShortDate(
							reviewRoundHistory.value.reviewAssignment.dateCompleted,
						),
					});
				}
			}
			return information;
		});

		return {
			isDeclined,
			isIncomplete,
			reviewRoundHistory,
			articleMetadata,
			generalInformation,

			submissionId: props.submissionId,
			reviewRoundId: props.reviewRoundId,
			reviewRoundNumber: props.reviewRoundNumber,
		};
	},
);
