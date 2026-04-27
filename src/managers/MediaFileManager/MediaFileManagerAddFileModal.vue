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
				v-if="genreOptions?.length"
				id="mediaFileAddUploader"
				:api-url="temporaryFilesApiUrl"
				:genre-options="genreOptions"
				:supported-file-types="supportedFileTypes"
				:supported-file-types-label="supportedFileTypesLabel"
				@uploaded="onFilesUploaded"
				@file-count-change="onFileCountChange"
			/>
			<p v-else class="text-lg-normal">
				{{ t('publication.mediaFiles.upload.noMediaTypes') }}
			</p>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import FileMediaUploader from '@/components/FileMediaUploader/FileMediaUploader.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useMediaFileManagerAddFileModal} from './useMediaFileManagerAddFileModal';

defineProps({
	/** Dropdown options for genre selection. Array of {value, label, supportsFileVariants} objects. */
	genreOptions: {
		type: Array,
		required: true,
	},
	/** Array of supported file extensions (e.g. ['png', 'jpg']). Used for dropzone validation. */
	supportedFileTypes: {
		type: Array,
		default: () => [],
	},
	/** Display label describing the supported file formats. */
	supportedFileTypesLabel: {
		type: String,
		default: '',
	},
});

const {t} = useLocalize();

const {temporaryFilesApiUrl, onFilesUploaded, onFileCountChange} =
	useMediaFileManagerAddFileModal();
</script>
