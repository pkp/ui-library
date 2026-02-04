import {ref, computed, onMounted, onUnmounted, nextTick} from 'vue';

/**
 * Composable for FileMediaUploader component logic
 * @param {Object} props - Component props
 * @param {Function} emit - Component emit function
 * @returns {Object} - Reactive state and methods for file upload management
 */
export function useFileMediaUploader(props, emit) {
	const dropzone = ref(null);
	const files = ref([]);
	const dragEventCounter = ref(0);
	const isDragging = ref(false);
	const isMounted = ref(false);

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
				(f) => f.uploadedFile && f.mediaType && (!f.errors || !f.errors.length),
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
	 * Handle files being added to the dropzone
	 */
	function onFilesAdded(fileList) {
		nextTick(() => {
			const newFiles = Array.from(fileList).map((file) => ({
				id: file.upload.uuid,
				name: file.upload.filename,
				size: file.size,
				progress: file.upload.progress,
				errors: [],
				mediaType: '',
				uploadedFile: null,
			}));
			files.value = [...files.value, ...newFiles];
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
		let errors = [];
		if (typeof error === 'string') {
			errors = [error];
		} else if (typeof error.errorMessage !== 'undefined') {
			errors = [error.errorMessage];
		} else if (typeof error === 'object' && error !== null) {
			errors = Object.keys(error)
				.map((key) => error[key])
				.flat();
		}

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
			fileId: f.uploadedFile.id,
			mediaType: f.mediaType,
			...f.uploadedFile,
		}));

		emit('uploaded', uploadedFiles);
	}

	/**
	 * Event handler when the user drags over an element
	 */
	function dragenter(event) {
		dragEventCounter.value = dragEventCounter.value + 1;
		isDragging.value = event.dataTransfer.types.includes('Files');
	}

	/**
	 * Event handler when the user drags away from an element
	 */
	function dragleave() {
		dragEventCounter.value = dragEventCounter.value - 1;
		isDragging.value = dragEventCounter.value > 0;
	}

	/**
	 * Event handler when the user "drops" in a drag-and-drop action
	 */
	function drop(event) {
		event.preventDefault();
		if (event.type === 'drop') {
			isDragging.value = false;
			dragEventCounter.value = 0;
		}
	}

	/**
	 * Set up drag and drop event listeners
	 */
	function setupDragListeners() {
		document.addEventListener('dragenter', dragenter, true);
		document.addEventListener('dragleave', dragleave, true);
		document.addEventListener('dragover', drop, true);
		document.addEventListener('drop', drop);
	}

	/**
	 * Clean up drag and drop event listeners
	 */
	function cleanupDragListeners() {
		document.removeEventListener('dragenter', dragenter, true);
		document.removeEventListener('dragleave', dragleave, true);
		document.removeEventListener('dragover', drop, true);
		document.removeEventListener('drop', drop);
	}

	onMounted(() => {
		isMounted.value = true;
		setupDragListeners();
	});

	onUnmounted(() => {
		cleanupDragListeners();
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
		onFilesAdded,
		onUploadProgress,
		onUploadSuccess,
		onUploadError,
		onFileRemoved,
		removeFile,
		submit,
		drop,
	};
}
