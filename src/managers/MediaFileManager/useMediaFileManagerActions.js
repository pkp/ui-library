import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch} from '@/composables/useFetch';

import MediaFileManagerAddFileModal from './MediaFileManagerAddFileModal.vue';
import MediaFileManagerBatchLinkImagesModal from './MediaFileManagerBatchLinkImagesModal.vue';
import MediaFileManagerMetadataFormModal from './MediaFileManagerMetadataFormModal.vue';

export const Actions = {
	MEDIA_FILE_LIST: 'mediaFileList',
	MEDIA_FILE_ADD: 'mediaFileAdd',
	MEDIA_FILE_BATCH_LINK_IMAGES: 'mediaFileBatchLinkImages',
	MEDIA_FILE_INFO: 'mediaFileInfo',
	MEDIA_FILE_EDIT_METADATA: 'mediaFileEditMetadata',
	MEDIA_FILE_MANUALLY_LINK_IMAGE: 'mediaFileManuallyLinkImage',
	MEDIA_FILE_DELETE: 'mediaFileDelete',
};

export function useMediaFileActions() {
	const {t} = useLocalize();

	function mediaFileAdd(
		{mediaTypeOptions, supportedFileTypesLabel},
		finishedCallback,
	) {
		const {openSideModal} = useModal();
		openSideModal(
			MediaFileManagerAddFileModal,
			{
				mediaTypeOptions,
				supportedFileTypesLabel,
			},
			{
				onClose: finishedCallback,
			},
		);
	}

	function mediaFileBatchLinkImages(finishedCallback) {
		const {openSideModal} = useModal();
		openSideModal(MediaFileManagerBatchLinkImagesModal, null, {
			onClose: finishedCallback,
		});
	}

	function mediaFileInfo({mediaFile}, finishedCallback) {
		const {openDialog} = useModal();
		openDialog({
			title: 'Media File Info',
			message: 'Media File Info action triggered.',
		});
	}

	function mediaFileEditMetadata({mediaFile}, finishedCallback) {
		const {openSideModal} = useModal();
		openSideModal(
			MediaFileManagerMetadataFormModal,
			{mediaFile},
			{
				onClose: finishedCallback,
			},
		);
	}

	function mediaFileManuallyLinkImage({mediaFile}, finishedCallback) {
		const {openDialog} = useModal();
		openDialog({
			title: 'Media File Manually Link Image',
			message: 'Media File Manually Link Image action triggered.',
		});
	}

	function mediaFileDelete({mediaFile}, finishedCallback) {
		async function deleteMediaFile() {
			const {apiUrl: deleteMediaFileUrl} = useUrl(`mediaFiles/${mediaFile.id}`);

			const {
				fetch,
				data: deleteMediaFileData,
				isSuccess,
			} = useFetch(deleteMediaFileUrl, {
				method: 'DELETE',
			});

			await fetch();

			return {
				data: deleteMediaFileData.value,
				isSuccess: isSuccess.value,
			};
		}

		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: async (close) => {
						await deleteMediaFile();
						finishedCallback();
						close();
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
					},
				},
			],
			title: t('common.delete'),
			message: t('common.confirmDelete'),
			modalStyle: 'negative',
		});
	}

	return {
		mediaFileAdd,
		mediaFileBatchLinkImages,
		mediaFileInfo,
		mediaFileEditMetadata,
		mediaFileManuallyLinkImage,
		mediaFileDelete,
	};
}
