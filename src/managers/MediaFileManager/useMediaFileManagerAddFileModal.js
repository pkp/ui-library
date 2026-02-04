import {inject} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

/**
 * Composable for MediaFileManagerAddFileModal component logic
 * @param {Object} props - Component props
 * @returns {Object} - Methods and computed values for the modal
 */
export function useMediaFileManagerAddFileModal(props) {
	const closeModal = inject('closeModal');
	const {apiUrl: temporaryFilesApiUrl} = useUrl('temporaryFiles');

	/**
	 * Handle files uploaded from FileMediaUploader
	 * Posts the files to the mediaFiles/upload endpoint
	 * @param {Array} files - Array of uploaded file objects with mediaType
	 */
	async function onFilesUploaded(files) {
		const {apiUrl: mediaFilesUploadUrl} = useUrl('mediaFiles/upload');
		const {fetch, data} = useFetch(mediaFilesUploadUrl, {
			method: 'POST',
			body: {files},
		});

		await fetch();

		if (data.value) {
			props.onSuccess();
			closeModal();
		}
	}

	return {
		temporaryFilesApiUrl,
		onFilesUploaded,
	};
}
