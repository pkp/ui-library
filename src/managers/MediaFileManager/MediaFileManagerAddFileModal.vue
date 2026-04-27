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
				:genre-options="genreOptions"
				:supported-file-types-label="supportedFileTypesLabel"
				@uploaded="onFilesUploaded"
				@file-count-change="onFileCountChange"
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

defineProps({
	/** Dropdown options for genre selection. Array of {value, label, supportsFileVariants} objects. */
	genreOptions: {
		type: Array,
		required: true,
	},
	/** Text describing supported file formats. */
	supportedFileTypesLabel: {
		type: String,
		required: true,
	},
});

const {t} = useLocalize();

const {temporaryFilesApiUrl, onFilesUploaded, onFileCountChange} =
	useMediaFileManagerAddFileModal();
</script>
