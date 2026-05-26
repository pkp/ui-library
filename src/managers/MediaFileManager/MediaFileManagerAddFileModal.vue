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
				v-if="mediaFileManagerStore.genreOptions?.length"
				id="mediaFileAddUploader"
				:api-url="temporaryFilesApiUrl"
				:genre-options="mediaFileManagerStore.genreOptions"
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
import {useMediaFileManagerStore} from './mediaFileManagerStore';

const {t} = useLocalize();

const {temporaryFilesApiUrl, onFilesUploaded, onFileCountChange} =
	useMediaFileManagerAddFileModal();

const mediaFileManagerStore = useMediaFileManagerStore();
</script>
