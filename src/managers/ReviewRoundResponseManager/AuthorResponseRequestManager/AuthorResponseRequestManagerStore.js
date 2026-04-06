import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed, toRefs} from 'vue';
import {useReviewRoundAuthorResponseConfig} from './useReviewRoundAuthorResponseConfig';
import {useExtender} from '@/composables/useExtender';
import {useUrlSearchParams} from '@vueuse/core';
import {useUrl} from '@/composables/useUrl';
import {
	CompletedReviewAssignmentStatuses,
	useSubmission,
} from '@/composables/useSubmission';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import AuthorResponseFormModal from '@/managers/ReviewRoundResponseManager/AuthorResponseFormModal.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useDataChanged} from '@/composables/useDataChanged';
export const useReviewRoundAuthorResponseRequestStore = defineComponentStore(
	'useReviewRoundAuthorResponseRequestStore',
	(props) => {
		const extender = useExtender();
		const {t} = useLocalize();

		const {
			submission,
			reviewRound,
			reviewRoundId,
			contextMinReviewsPerSubmission,
			stageId,
		} = toRefs(props);

		const {apiUrl: participantApiUrl} = useUrl(
			`submissions/${submission.value.id}/participants/${stageId.value}`,
		);

		const {apiUrl: publicationUrl} = useUrl(
			`submissions/${submission.value.id}/publications/${reviewRound.value.publicationId}`,
		);

		const {data: publication, fetch: fetchPublication} =
			useFetch(publicationUrl);

		fetchPublication();

		const {data: participants, fetch: fetchParticipants} =
			useFetch(participantApiUrl);

		fetchParticipants();

		const {
			checkMinimumConsideredReviews,
			getActiveReviewAssignments,
			getReviewAssignmentsForRound,
		} = useSubmission();

		const {triggerDataChange} = useDataChanged();

		const authorReviewResponseRequestConfig = extender.addFns(
			useReviewRoundAuthorResponseConfig(),
		);

		/**
		 * Get the list of assigned authors
		 */
		const authors = computed(() => {
			return (
				participants.value?.filter((p) =>
					p.stageAssignments?.some(
						(sa) =>
							sa.stageAssignmentUserGroup?.roleId === pkp.const.ROLE_ID_AUTHOR,
					),
				) || []
			);
		});

		/**
		 * Determine if the review round has an author response.
		 */
		const reviewHasResponse = computed(
			() => !!reviewRound.value.authorResponse,
		);

		/**
		 * Navigate to page where editor can request author to submit review response.
		 */
		function navigateToRequestAuthorReviewResponsePage() {
			const queryParamsUrl = useUrlSearchParams();

			const urlSearchParams = new URLSearchParams({
				...queryParamsUrl,
				workflowSubmissionId: submission.value.id,
			});

			const currentPageUrl = `dashboard/editorial?${urlSearchParams.toString()}`;
			const queryParams = {
				stageId: stageId.value,
				reviewRoundId: reviewRoundId.value,
				submissionId: submission.value.id,
				ret: currentPageUrl,
			};

			const {redirectToPage} = useUrl(
				`reviewResponse/requestAuthorResponse`,
				queryParams,
			);

			redirectToPage();
		}

		/**
		 * Determine if the author review response can be requested.
		 *
		 * Response can be requested if at least one of the following conditions are met:
		 * 1. The system requires a minimum number of reviews to be considered, and that minimum has been met.
		 * 2. All review assignments are completed.
		 * 3. The review round status is either accepted or revisions were requested.
		 * 4. An author response does not already exist.
		 *
		 */
		const canRequestReviewRoundAuthorResponse = computed(() => {
			const {hasMinimumReviewsCount, shouldMinimumReviewsBeConsidered} =
				checkMinimumConsideredReviews(
					submission.value,
					stageId.value,
					reviewRoundId.value,
					contextMinReviewsPerSubmission.value,
				);

			const reviewAssignments = getActiveReviewAssignments(
				getReviewAssignmentsForRound(
					submission.value.reviewAssignments,
					reviewRoundId.value,
				),
			);

			const areAllReviewAssignmentsCompleted =
				!!reviewAssignments.length &&
				reviewAssignments.every((reviewAssignment) =>
					CompletedReviewAssignmentStatuses.includes(reviewAssignment.statusId),
				);

			const passesMinimumReviewsCheck =
				shouldMinimumReviewsBeConsidered && hasMinimumReviewsCount;

			return (
				!reviewHasResponse.value &&
				(passesMinimumReviewsCheck || areAllReviewAssignmentsCompleted)
			);
		});

		const columns = computed(() =>
			authorReviewResponseRequestConfig.getColumns({reviewRound}),
		);
		const topItems = computed(() =>
			authorReviewResponseRequestConfig.getTopItems(),
		);

		function getAuthorItemActions({author, reviewRound}) {
			return authorReviewResponseRequestConfig.getAuthorItemActions({
				author,
				reviewRound,
			});
		}

		/**
		 * Open the modal to submit or edit a review response.
		 */
		async function openReviewResponseFormModal() {
			const {openSideModal, closeSideModal} = useModal();
			openSideModal(
				AuthorResponseFormModal,
				{
					submission: submission.value,
					stageId: stageId.value,
					reviewRound: reviewRound,
					authorOptions: publication.value.authors,
					onSuccessFn: (...args) => onFormSubmitSuccess(...args),
				},
				{
					onClose: async () => {
						// Refresh data
						triggerDataChange();

						closeSideModal(AuthorResponseFormModal);
					},
				},
			);
		}

		/**
		 * Handle successful submission of the review response form.
		 */
		function onFormSubmitSuccess() {
			const {closeSideModal} = useModal();
			triggerDataChange();
			closeSideModal(AuthorResponseFormModal);
		}

		/**
		 * Open the form modal to edit an existing author review response.
		 */
		function responseEdit() {
			openReviewResponseFormModal();
		}

		/**
		 * Open the form modal to view an existing author review response.
		 */
		function responseView() {
			openReviewResponseFormModal();
		}

		/**
		 * Delete an existing author response.
		 */
		async function responseDelete() {
			const {openDialog} = useModal();

			openDialog({
				title: t('common.delete'),
				message: t('common.confirmDelete'),
				modalStyle: 'negative',
				actions: [
					{
						label: t('common.ok'),
						isWarnable: true,
						callback: async (close) => {
							const {apiUrl: responseUrl} = useUrl(
								`reviews/${submission.value.id}/${reviewRoundId.value}/authorResponse/${reviewRound.value.authorResponse.id}`,
							);
							const {fetch: deleteAuthorResponse, isSuccess} = useFetch(
								responseUrl,
								{
									method: 'DELETE',
								},
							);
							await deleteAuthorResponse();
							if (isSuccess.value) {
								triggerDataChange();
							}
							close();
						},
					},
					{
						label: t('common.cancel'),
						isSecondary: true,
						callback: (close) => {
							close();
						},
					},
				],
			});
		}

		return {
			columns,
			topItems,
			getAuthorItemActions,
			responseEdit,
			responseView,
			responseDelete,
			authors,
			reviewHasResponse,
			canRequestReviewRoundAuthorResponse,
			navigateToRequestAuthorReviewResponsePage,
			extender,
			props,
		};
	},
);
