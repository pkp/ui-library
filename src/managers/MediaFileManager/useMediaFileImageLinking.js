import {ref, computed, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

/**
 * Check if a file is a web version
 */
export function isWebVersion(file) {
	// Must be an image
	if (file.documentType !== 'image') {
		return false;
	}

	// variantType must be 'web'
	if (file.variantType !== 'web') {
		return false;
	}

	return true;
}

/**
 * Check if a file is a high-resolution version
 */
export function isHighResVersion(file) {
	// variantType must be 'high_resolution'
	if (file.variantType !== 'high_resolution') {
		return false;
	}

	return true;
}

/**
 * Composable for managing linking of web version and high-resolution image files in the Media File Manager
 * This is used by both the manual link image form modal and the batch link images modal to determine available files and manage selections
 * @param {mediaFile} - Optional media file context to determine if we are linking from a web version or high-res source, supplied when used in the manual link image form modal
 * @returns {Object} - Methods and computed values for managing link (web vs high-res) and selections
 */
export function useMediaFileImageLinking({mediaFile = {}} = {}) {
	const {localize} = useLocalize();

	// Get media files from store
	const mediaFileManagerStore = useMediaFileManagerStore();
	const mediaFiles = computed(() => mediaFileManagerStore.mediaFilesList);
	const isLoadingMediaFiles = computed(
		() => mediaFileManagerStore.isLoadingMediaFiles,
	);

	// Determine if the current media file is a high-res source, otherwise treat as web version source (or batch linking context)
	const isHighResSource = mediaFile.id && isHighResVersion(mediaFile);

	// Selections: { primaryFileId: secondaryFileId } for batch linking, or { secondaryFileId: primaryFileId } for manual linking when mediaFile is a high-res source
	const linkSelections = ref({});

	// Auto-populate linkSelections by matching web files to high-res files in the same group
	watch(
		() => mediaFiles.value,
		() => {
			const selectedLinks = {};
			mediaFiles.value?.forEach((file) => {
				if (isWebVersion(file) && !isHighResSource) {
					const matchingHighRes = mediaFiles.value.find(
						(hr) =>
							hr.variantGroupId === file.variantGroupId && isHighResVersion(hr),
					);
					if (matchingHighRes) {
						selectedLinks[file.id] = matchingHighRes.id;
					}
				}

				if (isHighResSource && isHighResVersion(file)) {
					const matchingWeb = mediaFiles.value.find(
						(wb) =>
							wb.variantGroupId === file.variantGroupId && isWebVersion(wb),
					);
					if (matchingWeb) {
						selectedLinks[file.id] = matchingWeb.id;
					}
				}
			});
			linkSelections.value = selectedLinks;
		},
		{immediate: true},
	);

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
	 * Get the set of web file IDs that are already selected by other high-res files
	 */
	function getSelectedWebFileIds(excludeHighResFileId) {
		const selectedIds = [];
		Object.entries(linkSelections.value).forEach(
			([highResFileId, webFileId]) => {
				if (parseInt(highResFileId, 10) !== excludeHighResFileId && webFileId) {
					selectedIds.push(webFileId);
				}
			},
		);
		return selectedIds;
	}

	/**
	 * Get available high-res options for a given web file, excluding those already selected by other web files
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
	 * Get available web file options for a given high-res file, excluding those already selected by other high-res files
	 */
	function getWebFileOptionsForHighRes(highResFileId) {
		const selectedByOthers = getSelectedWebFileIds(highResFileId);
		return [
			{
				value: '',
				label: '',
			},
			...webVersionFiles.value
				.filter((file) => !selectedByOthers.includes(file.id))
				.map((file) => ({
					value: file.id,
					label: localize(file.name),
				})),
		];
	}

	/**
	 * Group files by their variantGroupId
	 */
	function groupFilesByVariantGroupId(files) {
		const groups = {};
		files.forEach((file) => {
			if (!groups[file.variantGroupId]) {
				groups[file.variantGroupId] = [];
			}
			groups[file.variantGroupId].push(file);
		});
		return groups;
	}

	/**
	 * Get web version files
	 */
	const webVersionFiles = computed(() => {
		const groups = groupFilesByVariantGroupId(mediaFiles.value);
		return mediaFiles.value.filter((file) =>
			isWebVersion(file, groups[file.variantGroupId]),
		);
	});

	/**
	 * Get high-resolution files
	 */
	const highResFiles = computed(() => {
		const groups = groupFilesByVariantGroupId(mediaFiles.value);
		return mediaFiles.value.filter((file) =>
			isHighResVersion(file, groups[file.variantGroupId]),
		);
	});

	return {
		mediaFiles,
		isLoadingMediaFiles,
		linkSelections,
		webVersionFiles,
		highResFiles,
		groupFilesByVariantGroupId,
		isWebVersion,
		isHighResVersion,
		getHighResOptionsForWebFile,
		getWebFileOptionsForHighRes,
	};
}
