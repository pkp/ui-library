import {inject} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

/**
 * Composable for MediaFileManagerAddFileModal component logic
 * @returns {Object} - Methods and computed values for the modal
 */
export function useMediaFileManagerAddFileModal() {
	const closeModal = inject('closeModal');
	const {apiUrl: temporaryFilesApiUrl} = useUrl('temporaryFiles');
	const mediaFileManagerStore = useMediaFileManagerStore();

	/**
	 * Handle files uploaded from FileMediaUploader
	 * Posts the files to the submissions/{submissionId}/mediaFiles endpoint
	 * @param {Array} files - Array of uploaded file objects with mediaType
	 */
	async function onFilesUploaded(files) {
		const submissionId = mediaFileManagerStore.submission?.id;
		const {apiUrl: mediaFilesUploadUrl} = useUrl(
			`submissions/${submissionId}/mediaFiles`,
		);
		const {fetch, isSuccess} = useFetch(mediaFilesUploadUrl, {
			method: 'POST',
			body: {files},
		});

		await fetch();

		if (isSuccess.value) {
			closeModal();
		}
	}

	return {
		temporaryFilesApiUrl,
		onFilesUploaded,
	};
}
