<template>
	<div :id="id" class="relative">
		<!-- Header -->
		<div>
			<h3 class="m-0 text-xl-bold">{{ t('common.uploadFile') }}</h3>
			<p
				v-if="supportedFileTypesLabel"
				class="mb-0 mt-1 text-lg-normal text-secondary"
			>
				{{ t('common.supported') }}: {{ supportedFileTypesLabel }}
			</p>
		</div>

		<!-- Dropzone Area -->
		<div
			class="my-4 flex cursor-pointer flex-col items-center justify-center rounded border border-light bg-secondary p-8 transition-colors duration-200 hover:border-dark hover:bg-selection-light"
			:class="{'border-2 border-dashed bg-selection-light': isDragging}"
			@click="openFileBrowser"
			@dragover.prevent
			@drop.prevent="handleDrop"
		>
			<Icon icon="Upload" class="mb-2 h-10 w-10 text-primary" />
			<p class="m-0 mt-1 text-lg-normal text-default">
				{{ t('common.dragAndDropHere') }}
			</p>
			<span class="my-1 text-lg-normal text-default">{{ t('common.or') }}</span>
			<button
				type="button"
				class="cursor-pointer border-none bg-transparent p-0 text-lg-normal text-primary underline hover:text-hover"
				@click.stop="openFileBrowser"
			>
				{{ t('common.clickToUploadFiles') }}
			</button>
		</div>

		<!-- File List -->
		<div v-if="files.length">
			<div
				v-for="file in files"
				:key="file.id"
				class="mb-4 rounded bg-tertiary p-4"
			>
				<div class="flex items-start gap-4">
					<Icon
						icon="DefaultDocument"
						class="h-6 w-6 flex-shrink-0 text-primary"
					/>
					<div class="min-w-0 flex-1">
						<span class="block truncate text-base-bold">{{ file.name }}</span>
						<span class="block text-xs-normal text-secondary">
							{{ formatFileSize(file.size) }}
						</span>
					</div>
					<button
						type="button"
						class="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-negative"
						:aria-label="t('common.remove')"
						@click="removeFile(file.id)"
					>
						<Icon icon="Cancel" class="h-4 w-4" />
					</button>
				</div>

				<!-- Error Display -->
				<FieldError
					v-if="file.errors && file.errors.length"
					:messages="file.errors"
				/>

				<!-- Media Type Dropdown (shown for uploaded files) -->
				<div
					v-else-if="file.uploadedFile"
					class="mt-4 border-t border-light pt-4"
				>
					<div
						class="grid grid-cols-1 gap-4"
						:class="{
							'md:grid-cols-2': file.mediaType === 'image',
						}"
					>
						<div>
							<label
								:for="`${id}-mediaType-${file.id}`"
								class="mb-1 block text-base-bold text-primary"
							>
								{{ t('publication.mediaFiles.upload.selectMediaType') }}
								<span class="font-normal">({{ t('common.required') }})</span>
							</label>
							<p class="m-0 mb-2 text-base-normal text-secondary">
								{{
									t('publication.mediaFiles.upload.selectMediaTypeDescription')
								}}
							</p>
							<select
								:id="`${id}-mediaType-${file.id}`"
								v-model="file.mediaType"
								class="w-full rounded border border-light bg-tertiary p-2 text-lg-normal focus:border-primary focus:outline-none"
							>
								<option
									v-for="opt in mediaTypeOptions"
									:key="opt.value"
									:value="opt.value"
								>
									{{ opt.label }}
								</option>
							</select>
						</div>
						<div v-if="file.mediaType === 'image'">
							<label
								:for="`${id}-resolutionType-${file.id}`"
								class="mb-1 block text-base-bold text-primary"
							>
								{{ t('publication.mediaFiles.upload.fileResType') }}
								<span class="font-normal">({{ t('common.required') }})</span>
							</label>
							<p class="m-0 mb-2 text-base-normal text-secondary">
								{{ t('publication.mediaFiles.upload.fileResTypeDescription') }}
							</p>
							<select
								:id="`${id}-resolutionType-${file.id}`"
								v-model="file.resolutionType"
								class="w-full rounded border border-light bg-tertiary p-2 text-lg-normal focus:border-primary focus:outline-none"
							>
								<option
									v-for="opt in resolutionTypeOptions"
									:key="opt.value"
									:value="opt.value"
								>
									{{ opt.label }}
								</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Progress Bar (shown during upload) -->
				<div v-else class="mt-3 flex items-center gap-3">
					<ProgressBar class="flex-1" :value="file.progress" />
					<span class="shrink-0 text-base-normal text-secondary">
						{{ Math.round(file.progress) }}%
					</span>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div v-if="files.length" class="flex items-center justify-end gap-4 pt-4">
			<PkpButton :is-primary="true" :is-disabled="!canSubmit" @click="submit">
				{{ t('common.uploadFiles') }}
			</PkpButton>
		</div>

		<!-- Hidden VueDropzone -->
		<div class="absolute h-0 w-0 overflow-hidden opacity-0">
			<VueDropzone
				v-if="isMounted"
				:id="dropzoneId"
				ref="dropzone"
				:options="dropzoneOptions"
				@vdropzone-file-added="onFileAdded"
				@vdropzone-upload-progress="onUploadProgress"
				@vdropzone-success="onUploadSuccess"
				@vdropzone-error="onUploadError"
				@vdropzone-removed-file="onFileRemoved"
				@vdropzone-drop="drop"
			/>
		</div>
	</div>
</template>

<script setup>
import VueDropzone from 'dropzone-vue3';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';
import FieldError from '@/components/Form/FieldError.vue';
import {useLocalize} from '@/composables/useLocalize';
import {formatFileSize} from '@/utils/fileUtils';
import {useFileMediaUploader} from './useFileMediaUploader';

const props = defineProps({
	/** A unique id for the uploader. */
	id: {
		type: String,
		required: true,
	},
	/** The URL to upload files to. */
	apiUrl: {
		type: String,
		required: true,
	},
	/** Dropdown options for media type selection. Array of {value, label} objects. */
	mediaTypeOptions: {
		type: Array,
		required: true,
	},
	/** Text describing supported file formats. */
	supportedFileTypesLabel: {
		type: String,
		default: '',
	},
	/** Optional Dropzone.js configuration options. */
	options: {
		type: Object,
		default() {
			return {};
		},
	},
});

const emit = defineEmits([
	/** Emitted when all files finish uploading with media types. Payload: [{fileId, mediaType, ...serverResponse}] */
	'uploaded',
]);

const {t} = useLocalize();

const {
	// Refs
	dropzone,
	files,
	isDragging,
	isMounted,

	// Computed
	dropzoneId,
	dropzoneOptions,
	canSubmit,

	// Methods
	openFileBrowser,
	onFileAdded,
	onUploadProgress,
	onUploadSuccess,
	onUploadError,
	onFileRemoved,
	removeFile,
	submit,
	drop,
	handleDrop,

	// Others
	resolutionTypeOptions,
} = useFileMediaUploader(props, emit);
</script>
