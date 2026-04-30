import {ref, inject} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useFormChanged} from '@/composables/useFormChanged';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

/**
 * Composable for MediaFileManagerAddFileModal component logic
 * @returns {Object} - Methods and computed values for the modal
 */
export function useMediaFileManagerAddFileModal() {
	const closeModal = inject('closeModal');
	const {apiUrl: temporaryFilesApiUrl} = useUrl('temporaryFiles');
	const mediaFileManagerStore = useMediaFileManagerStore();

	const uploadedCount = ref(0);
	const {setInitialState} = useFormChanged(ref({}), [uploadedCount], {
		warnOnClose: true,
	});

	function onFileCountChange(count) {
		uploadedCount.value = count;
	}

	/**
	 * Handle files uploaded from FileMediaUploader
	 * Posts the files to the submissions/{submissionId}/publications/{publicationId}/mediaFiles endpoint
	 * @param {Array} files - Array of uploaded file objects with genreId
	 */
	async function onFilesUploaded(files) {
		const submissionId = mediaFileManagerStore.submission?.id;
		const publicationId = mediaFileManagerStore.publication?.id;
		const {apiUrl: mediaFilesUploadUrl} = useUrl(
			`submissions/${submissionId}/publications/${publicationId}/mediaFiles`,
		);
		const {fetch, isSuccess} = useFetch(mediaFilesUploadUrl, {
			method: 'POST',
			body: {files},
		});

		await fetch();

		if (isSuccess.value) {
			setInitialState();
			closeModal();
		}
	}

	return {
		temporaryFilesApiUrl,
		onFilesUploaded,
		onFileCountChange,
	};
}
