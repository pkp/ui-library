import {useModal} from '@/composables/useModal';
import MediaFileManagerAddFileModal from './MediaFileManagerAddFileModal.vue';
import MediaFileManagerBatchLinkImagesModal from './MediaFileManagerBatchLinkImagesModal.vue';

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
		const {openDialog} = useModal();
		openDialog({
			title: 'Media File Edit Metadata',
			message: 'Media File Edit Metadata action triggered.',
		});
	}

	function mediaFileManuallyLinkImage({mediaFile}, finishedCallback) {
		const {openDialog} = useModal();
		openDialog({
			title: 'Media File Manually Link Image',
			message: 'Media File Manually Link Image action triggered.',
		});
	}

	function mediaFileDelete({mediaFile}, finishedCallback) {
		const {openDialog} = useModal();
		openDialog({
			title: 'Media File Delete',
			message: 'Media File Delete action triggered.',
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
