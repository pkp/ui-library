import {ref, computed, inject, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useFormChanged} from '@/composables/useFormChanged';
import {useMediaFileImageLinking} from './useMediaFileImageLinking';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

/**
 * Composable for MediaFileManagerBatchLinkImagesModal component logic
 * @returns {Object} - Methods and computed values for the modal
 */
export function useMediaFileManagerBatchLinkImagesModal() {
	const closeModal = inject('closeModal');
	const {localize} = useLocalize();
	const mediaFileManagerStore = useMediaFileManagerStore();

	const {
		isLoadingMediaFiles,
		linkSelections,
		webVersionFiles,
		getHighResOptionsForWebFile,
	} = useMediaFileImageLinking();

	const {setInitialState} = useFormChanged(ref({}), [linkSelections], {
		warnOnClose: true,
	});

	// set the form's initial state once the media files are loaded
	watch(
		isLoadingMediaFiles,
		(loading) => {
			if (!loading) setInitialState();
		},
		{immediate: true},
	);

	/**
	 * Check if at least one link selection has been made
	 */
	const hasSelections = computed(() => {
		return Object.values(linkSelections.value).some((value) => value);
	});

	/**
	 * Handle linking media files
	 */
	async function handleLinkMedia() {
		const linksToCreate = [];

		// Collect all selections, using null for unlinked web files
		webVersionFiles.value.forEach((webFile) => {
			linksToCreate.push({
				primarySubmissionFileId: webFile.id,
				secondarySubmissionFileId: linkSelections.value[webFile.id] || null,
			});
		});

		if (!linksToCreate.length) {
			closeModal();
			return;
		}

		const submissionId = mediaFileManagerStore.submission?.id;
		const {apiUrl: mediaFilesLinkUrl} = useUrl(
			`submissions/${submissionId}/mediaFiles/link`,
		);
		const {fetch, isSuccess} = useFetch(mediaFilesLinkUrl, {
			method: 'POST',
			body: {links: linksToCreate},
		});

		await fetch();

		if (isSuccess.value) {
			setInitialState();
			closeModal();
		}
	}

	/**
	 * Get localized name for display
	 */
	function getLocalizedName(name) {
		return localize(name);
	}

	return {
		isLoadingMediaFiles,
		linkSelections,
		webVersionFiles,
		hasSelections,
		getHighResOptionsForWebFile,
		handleLinkMedia,
		getLocalizedName,
	};
}
