import {ref, computed, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

/**
 * Check if a file is a web version (supports high-res linking and has variantType 'web')
 */
export function isWebVersion(file) {
	if (!file.genreSupportsFileVariants) {
		return false;
	}

	if (file.variantType !== 'web') {
		return false;
	}

	return true;
}

/**
 * Check if a file is a high-resolution version
 */
export function isHighResVersion(file) {
	if (file.variantType !== 'high_resolution') {
		return false;
	}

	return true;
}

/**
 * Composable for managing linking of web version and high-resolution media files in the Media File Manager
 * This is used by both the manual link media form modal and the batch link media modal to determine available files and manage selections
 * Files can only be linked within the same genre (e.g. Images link to Images, Multimedia links to Multimedia)
 * @param {mediaFile} - Optional media file context to determine if we are linking from a web version or high-res source, supplied when used in the manual link media form modal
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
							file.variantGroupId &&
							hr.variantGroupId === file.variantGroupId &&
							isHighResVersion(hr),
					);
					if (matchingHighRes) {
						selectedLinks[file.id] = matchingHighRes.id;
					}
				}

				if (isHighResSource && isHighResVersion(file)) {
					const matchingWeb = mediaFiles.value.find(
						(wb) =>
							file.variantGroupId &&
							wb.variantGroupId === file.variantGroupId &&
							isWebVersion(wb),
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
	 * Get available high-res options for a given web file, excluding those already selected by other web files.
	 * Only returns files with the same genreId.
	 */
	function getHighResOptionsForWebFile(webFileId) {
		const webFile = mediaFiles.value.find((f) => f.id === webFileId);
		const selectedByOthers = getSelectedHighResIds(webFileId);
		return [
			{
				value: '',
				label: '',
			},
			...highResFiles.value
				.filter(
					(file) =>
						!selectedByOthers.includes(file.id) &&
						(!webFile || file.genreId === webFile.genreId),
				)
				.map((file) => ({
					value: file.id,
					label: localize(file.name),
				})),
		];
	}

	/**
	 * Get available web file options for a given high-res file, excluding those already selected by other high-res files.
	 * Only returns files with the same genreId.
	 */
	function getWebFileOptionsForHighRes(highResFileId) {
		const highResFile = mediaFiles.value.find((f) => f.id === highResFileId);
		const selectedByOthers = getSelectedWebFileIds(highResFileId);
		return [
			{
				value: '',
				label: '',
			},
			...webVersionFiles.value
				.filter(
					(file) =>
						!selectedByOthers.includes(file.id) &&
						(!highResFile || file.genreId === highResFile.genreId),
				)
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
	 * Get web version files (files with genreSupportsFileVariants and variantType 'web')
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
