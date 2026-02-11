import {computed, inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useMediaFileImageLinking} from './useMediaFileImageLinking';

/**
 * Composable for MediaFileManagerBatchLinkImagesModal component logic
 * @returns {Object} - Methods and computed values for the modal
 */
export function useMediaFileManagerBatchLinkImagesModal() {
	const closeModal = inject('closeModal');
	const {localize} = useLocalize();

	const {
		isLoadingMediaFiles,
		linkSelections,
		webVersionFiles,
		getHighResOptionsForWebFile,
	} = useMediaFileImageLinking();

	/**
	 * Check if at least one link selection has been made
	 */
	const hasSelections = computed(() => {
		return Object.values(linkSelections.value).some((value) => value);
	});

	/**
	 * Handle linking images
	 */
	async function handleLinkImages() {
		const linksToCreate = [];

		// Collect all selections, using null for unlinked web files
		webVersionFiles.value.forEach((webFile) => {
			linksToCreate.push({
				webFileId: webFile.id,
				highResFileId: linkSelections.value[webFile.id] || null,
			});
		});

		if (!linksToCreate.length) {
			closeModal();
			return;
		}

		const {apiUrl: mediaFilesLinkUrl} = useUrl('mediaFiles/link');
		const {fetch, isSuccess} = useFetch(mediaFilesLinkUrl, {
			method: 'POST',
			body: {links: linksToCreate},
		});

		await fetch();

		if (isSuccess.value) {
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
		handleLinkImages,
		getLocalizedName,
	};
}
