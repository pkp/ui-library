import {ref, computed, onMounted, nextTick} from 'vue';
import {t} from '@/utils/i18n';
import {parseDropzoneError} from '@/utils/fileUtils';
import {useDropzoneDragDrop} from '@/composables/useDropzoneDragDrop';

/**
 * Composable for FileMediaUploader component logic
 * @param {Object} props - Component props
 * @param {Function} emit - Component emit function
 * @returns {Object} - Reactive state and methods for file upload management
 */
export function useFileMediaUploader(props, emit) {
	const {isDragging, drop, resetDragState} = useDropzoneDragDrop();

	const dropzone = ref(null);
	const files = ref([]);
	const isMounted = ref(false);

	const variantTypeOptions = [
		{
			label: t('publication.mediaFiles.upload.variantTypeWeb'),
			value: 'web',
		},
		{
			label: t('publication.mediaFiles.upload.variantTypeHighRes'),
			value: 'high_resolution',
		},
	];

	/**
	 * An id for the dropzone component
	 */
	const dropzoneId = computed(() => props.id + '-dropzone');

	/**
	 * Options to pass to the dropzone component
	 */
	const dropzoneOptions = computed(() => ({
		method: 'POST',
		url: props.apiUrl,
		thumbnailWidth: 240,
		hiddenInputContainer: '#' + props.id,
		addRemoveLinks: false,
		previewTemplate: '<p></p>',
		headers: {
			'X-Csrf-Token': pkp.currentUser?.csrfToken || '',
		},
		params: (fileList) => {
			return {
				name: fileList[0].name,
			};
		},
		...props.options,
	}));

	/**
	 * Whether the submit button should be enabled
	 */
	const canSubmit = computed(() => {
		return (
			files.value.length > 0 &&
			files.value.every(
				(f) =>
					f.uploadedFile &&
					f.mediaType &&
					(f.mediaType !== 'image' || f.variantType) &&
					(!f.errors || !f.errors.length),
			)
		);
	});

	/**
	 * Open the file browser dialog
	 */
	function openFileBrowser() {
		if (dropzone.value?.dropzone?.hiddenFileInput) {
			dropzone.value.dropzone.hiddenFileInput.click();
		}
	}

	/**
	 * Handle a file being added to the dropzone
	 */
	function onFileAdded(file) {
		nextTick(() => {
			files.value = [
				...files.value,
				{
					id: file.upload.uuid,
					name: file.upload.filename,
					size: file.size,
					progress: file.upload.progress,
					errors: [],
					mediaType: '',
					uploadedFile: null,
				},
			];
		});
	}

	/**
	 * Handle upload progress updates
	 */
	function onUploadProgress(file, progress) {
		const index = files.value.findIndex((f) => f.id === file.upload.uuid);
		if (index !== -1) {
			files.value[index].progress = progress;
		}
	}

	/**
	 * Handle successful upload
	 */
	function onUploadSuccess(file, response) {
		const index = files.value.findIndex((f) => f.id === file.upload.uuid);
		if (index !== -1) {
			files.value[index].uploadedFile = response;
			files.value[index].progress = 100;
		}
	}

	/**
	 * Handle upload errors
	 */
	function onUploadError(erroredFile, error) {
		const errors = parseDropzoneError(error);

		nextTick(() => {
			const index = files.value.findIndex(
				(f) => f.id === erroredFile.upload.uuid,
			);
			if (index !== -1) {
				files.value[index].errors = errors;
			}
		});
	}

	/**
	 * Handle file removal from dropzone
	 */
	function onFileRemoved(file) {
		files.value = files.value.filter((f) => f.id !== file.upload.uuid);
	}

	/**
	 * Remove a file from the list
	 */
	function removeFile(fileId) {
		// Find and remove from dropzone if still uploading
		const dropzoneFile = dropzone.value?.dropzone?.files?.find(
			(f) => f.upload.uuid === fileId,
		);
		if (dropzoneFile) {
			dropzone.value.removeFile(dropzoneFile);
		}
		// Remove from local state
		files.value = files.value.filter((f) => f.id !== fileId);
	}

	/**
	 * Submit all files with their media types
	 */
	function submit() {
		if (!canSubmit.value) return;

		const uploadedFiles = files.value.map((f) => ({
			...f.uploadedFile,
			temporaryFileId: f.uploadedFile.id,
			mediaType: f.mediaType,
			variantType: f.variantType,
		}));

		emit('uploaded', uploadedFiles);
	}

	/**
	 * Handle drop on the visible dropzone area and forward files to VueDropzone
	 */
	function handleDrop(event) {
		resetDragState();

		const droppedFiles = event.dataTransfer?.files;
		if (droppedFiles && droppedFiles.length && dropzone.value?.dropzone) {
			Array.from(droppedFiles).forEach((file) => {
				dropzone.value.dropzone.addFile(file);
			});
		}
	}

	onMounted(() => {
		isMounted.value = true;
	});

	return {
		// Refs
		dropzone,
		files,
		isDragging,
		isMounted,

		// Computed
		dropzoneId,
		dropzoneOptions,
		canSubmit,

		// Methods
		openFileBrowser,
		onFileAdded,
		onUploadProgress,
		onUploadSuccess,
		onUploadError,
		onFileRemoved,
		removeFile,
		submit,
		drop,
		handleDrop,

		// Others
		variantTypeOptions,
	};
}
