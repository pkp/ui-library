import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, toRefs} from 'vue';

import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useUrl} from '@/composables/useUrl';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import {useExtender} from '@/composables/useExtender';

import {useMediaFileManagerConfig} from './useMediaFileManagerConfig';
import {useMediaFileActions} from './useMediaFileManagerActions';

export const useMediaFileManagerStore = defineComponentStore(
	'mediaFileManager',
	(props) => {
		const extender = useExtender();

		const {submission, publication} = toRefs(props);

		const {apiUrl: mediaFileApiUrl} = useUrl(
			`submissions/${submission.value.id}/mediaFiles`,
		);

		const {
			items: mediaFilesList,
			fetch: fetchMediaFiles,
			isLoading: isLoadingMediaFiles,
		} = useFetchPaginated(mediaFileApiUrl, {
			page: 1,
			pageSize: 999,
		});

		fetchMediaFiles();

		/**
		 * Computed list that groups media files by variantGroupId
		 * for use with TableBodyGroup
		 */
		const mediaFilesGrouped = computed(() => {
			const groups = [];
			const groupMap = {};

			mediaFilesList.value.forEach((file) => {
				if (!groupMap[file.variantGroupId]) {
					const group = {
						variantGroupId: file.variantGroupId,
						files: [],
					};
					groupMap[file.variantGroupId] = group;
					groups.push(group);
				}
				groupMap[file.variantGroupId].files.push(file);
			});

			return groups;
		});

		const {triggerDataChange} = useDataChangedProvider(() => fetchMediaFiles());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		/**
		 * Actions
		 */
		const mediaFileActions = useMediaFileActions();

		function getActionArgs() {
			return {
				config: mediaFileConfig.value,
			};
		}

		function mediaFileAdd() {
			mediaFileActions.mediaFileAdd(
				{
					mediaTypeOptions: mediaFileManagerConfig.mediaTypeOptions,
					supportedFileTypesLabel:
						mediaFileManagerConfig.supportedFileTypesLabel,
				},
				triggerDataChangeCallback,
			);
		}

		function mediaFileBatchLinkImages() {
			mediaFileActions.mediaFileBatchLinkImages(triggerDataChangeCallback);
		}

		function mediaFileInfo({mediaFile}) {
			mediaFileActions.mediaFileInfo(
				{
					mediaFile,
					submission: submission.value,
					publication: publication.value,
				},
				triggerDataChangeCallback,
			);
		}

		function mediaFileEditMetadata({mediaFile}) {
			mediaFileActions.mediaFileEditMetadata(
				{mediaFile},
				triggerDataChangeCallback,
			);
		}

		function mediaFileManuallyLinkImage({mediaFile}) {
			mediaFileActions.mediaFileManuallyLinkImage(
				{mediaFile},
				triggerDataChangeCallback,
			);
		}

		function mediaFileDelete({mediaFile}) {
			mediaFileActions.mediaFileDelete({mediaFile}, triggerDataChangeCallback);
		}

		const mediaFileConfig = computed(() =>
			mediaFileManagerConfig.getManagerConfig(),
		);

		function getItemActions({mediaFile}) {
			return mediaFileManagerConfig.getItemActions({
				mediaFile,
				...getActionArgs(),
			});
		}

		const topItems = computed(() =>
			mediaFileManagerConfig.getTopItems(getActionArgs()),
		);

		/** Columns */
		const mediaFileManagerConfig = extender.addFns(useMediaFileManagerConfig());
		const columns = computed(() => mediaFileManagerConfig.getColumns());

		return {
			mediaFilesList,
			mediaFilesGrouped,
			isLoadingMediaFiles,
			triggerDataChangeCallback,

			/**
			 * Config
			 * */
			columns,
			topItems,
			getItemActions,

			/**
			 * Actions
			 */
			mediaFileAdd,
			mediaFileBatchLinkImages,
			mediaFileInfo,
			mediaFileEditMetadata,
			mediaFileManuallyLinkImage,
			mediaFileDelete,

			extender,
		};
	},
);
