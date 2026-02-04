<template>
	<SideModalBody>
		<template #title>{{ t('publication.mediaFiles.upload') }}</template>
		<template #description>
			<span class="text-lg-medium">
				{{ t('publication.mediaFiles.upload.description') }}
			</span>
		</template>
		<SideModalLayoutBasic>
			<FileMediaUploader
				id="mediaFileAddUploader"
				:api-url="temporaryFilesApiUrl"
				:media-type-options="mediaTypeOptions"
				:supported-file-types-label="supportedFileTypesLabel"
				@uploaded="onFilesUploaded"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import FileMediaUploader from '@/components/FileMediaUploader/FileMediaUploader.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useMediaFileManagerAddFileModal} from './useMediaFileManagerAddFileModal';

const props = defineProps({
	/** Dropdown options for media type selection. Array of {value, label} objects. */
	mediaTypeOptions: {
		type: Array,
		required: true,
	},
	/** Text describing supported file formats. */
	supportedFileTypesLabel: {
		type: String,
		required: true,
	},
	/** Callback function to be called when upload succeeds */
	onSuccess: {
		type: Function,
		default: () => {},
	},
});

const {t} = useLocalize();

const {temporaryFilesApiUrl, onFilesUploaded} =
	useMediaFileManagerAddFileModal(props);
</script>
