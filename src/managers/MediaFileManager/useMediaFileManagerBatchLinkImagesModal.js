import {ref, computed, inject, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

/**
 * Composable for MediaFileManagerBatchLinkImagesModal component logic
 * @returns {Object} - Methods and computed values for the modal
 */
export function useMediaFileManagerBatchLinkImagesModal() {
	const closeModal = inject('closeModal');
	const {localize} = useLocalize();

	// Get media files from store
	const mediaFileManagerStore = useMediaFileManagerStore();
	const mediaFiles = computed(() => mediaFileManagerStore.mediaFilesList);
	const isLoadingMediaFiles = computed(
		() => mediaFileManagerStore.isLoadingMediaFiles,
	);

	// Selections: { webFileId: highResFileId }
	const linkSelections = ref({});

	// Auto-populate linkSelections by matching web files to high-res files in the same group
	watch(
		() => mediaFiles.value,
		() => {
			const groups = groupFilesByGroupId(mediaFiles.value);
			const selectedLinks = {};
			mediaFiles.value.forEach((file) => {
				if (isWebVersion(file, groups[file.groupId])) {
					const matchingHighRes = mediaFiles.value.find(
						(hr) =>
							hr.groupId === file.groupId &&
							isHighResVersion(hr, groups[hr.groupId]),
					);
					if (matchingHighRes) {
						selectedLinks[file.id] = matchingHighRes.id;
					}
				}
			});
			linkSelections.value = selectedLinks;
		},
		{immediate: true},
	);

	/**
	 * Check if a file is a web version
	 */
	function isWebVersion(file, filesInGroup) {
		// Must be an image
		if (file.documentType !== 'image') {
			return false;
		}

		// Genre name must NOT contain "High-resolution"
		const genreName = localize(file.genreName) || '';
		if (genreName.toLowerCase().includes('high-resolution')) {
			return false;
		}

		return true;
	}

	/**
	 * Check if a file is a high-resolution version
	 */
	function isHighResVersion(file, filesInGroup) {
		// Genre name must contain "High-resolution"
		const genreName = localize(file.genreName) || '';
		if (!genreName.toLowerCase().includes('high-resolution')) {
			return false;
		}

		return true;
	}

	/**
	 * Group files by their groupId
	 */
	function groupFilesByGroupId(files) {
		const groups = {};
		files.forEach((file) => {
			if (!groups[file.groupId]) {
				groups[file.groupId] = [];
			}
			groups[file.groupId].push(file);
		});
		return groups;
	}

	/**
	 * Get web version files
	 */
	const webVersionFiles = computed(() => {
		const groups = groupFilesByGroupId(mediaFiles.value);
		return mediaFiles.value.filter((file) =>
			isWebVersion(file, groups[file.groupId]),
		);
	});

	/**
	 * Get high-resolution files
	 */
	const highResFiles = computed(() => {
		const groups = groupFilesByGroupId(mediaFiles.value);
		return mediaFiles.value.filter((file) =>
			isHighResVersion(file, groups[file.groupId]),
		);
	});

	/**
	 * Get the set of high-res file IDs that are already selected by other web files
	 */
	function getSelectedHighResIds(excludeWebFileId) {
		const selectedIds = [];
		Object.entries(linkSelections.value).forEach(
			([webFileId, highResFileId]) => {
				if (parseInt(webFileId, 10) !== excludeWebFileId && highResFileId) {
					selectedIds.push(highResFileId);
				}
			},
		);
		return selectedIds;
	}

	/**
	 * Get high-res options filtered for a specific web file,
	 * excluding high-res files already selected by other web files.
	 * @param {number} webFileId - The ID of the web file
	 * @returns {Array} - Filtered options
	 */
	function getHighResOptionsForWebFile(webFileId) {
		const selectedByOthers = getSelectedHighResIds(webFileId);
		return [
			{
				value: '',
				label: '',
			},
			...highResFiles.value
				.filter((file) => !selectedByOthers.includes(file.id))
				.map((file) => ({
					value: file.id,
					label: localize(file.name),
				})),
		];
	}

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
		highResFiles,
		hasSelections,
		getHighResOptionsForWebFile,
		handleLinkImages,
		getLocalizedName,
	};
}
