import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import WorkflowVersionDialogBody from '@/pages/workflow/components/publication/WorkflowVersionDialogBody.vue';

import {computed, ref, watch} from 'vue';

export function useWorkflowDataSubmissionPublication({submissionId}) {
	const {t} = useLocalize();

	/**
	 * Fetch submission details
	 */
	const {apiUrl: submissionApiUrl} = useUrl(
		`submissions/${encodeURIComponent(submissionId)}`,
	);
	const {data: submission, fetch: fetchSubmission} = useFetch(submissionApiUrl);
	fetchSubmission();
	/** Fetch publications */
	const selectedPublicationId = ref(null);
	function selectPublicationId(publicationId) {
		if (selectedPublicationId.value !== publicationId) {
			selectedPublicationId.value = publicationId;
			selectedPublication.value = null;

			const isPublicationInSubmission = submission.value?.publications?.find(
				(publication) => publication.id === publicationId,
			);

			if (!isPublicationInSubmission) {
				submission.value = null;
				fetchSubmission();
			}
			fetchSelectedPublication();
		}
	}
	const selectedPublicationUrlRelative = computed(
		() =>
			`submissions/${encodeURIComponent(submissionId)}/publications/${selectedPublicationId.value}`,
	);
	const {apiUrl: selectedPublicationUrl} = useUrl(
		selectedPublicationUrlRelative,
	);
	const {data: selectedPublication, fetch: fetchSelectedPublication} = useFetch(
		selectedPublicationUrl,
	);

	watch(submission, (newSubmission, oldSubmission) => {
		// Once the submission is fetched, select relevant stage in navigaton
		if (!oldSubmission && newSubmission) {
			selectedPublicationId.value =
				newSubmission.publications[newSubmission.publications.length - 1].id;
			fetchSelectedPublication();
		}
	});

	async function refetchSubmissionPublication() {
		return Promise.all([fetchSubmission(), fetchSelectedPublication()]);
	}

	function createNewVersion(finishedCallback) {
		const {openDialog, closeDialog} = useModal();

		openDialog({
			title: t('publication.createVersion'),
			bodyComponent: WorkflowVersionDialogBody,
			bodyProps: {
				mode: 'createNewVersion',
				onCloseFn: () => closeDialog(false),
			},
			showCloseButton: false,
			modalStyle: 'basic',
		});
	}

	return {
		submission,
		submissionId,
		selectedPublication,
		selectedPublicationId,
		selectPublicationId,
		refetchSubmissionPublication,
		createNewVersion,
	};
}
