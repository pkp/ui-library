<template>
	<div
		:id="id"
		class="relative"
		:class="{'fileMediaUploader--isDragging': isDragging}"
	>
		<!-- Header -->
		<div>
			<h3 class="m-0 text-xl-bold">{{ t('common.upload.file') }}</h3>
			<p
				v-if="supportedFileTypesLabel"
				class="mb-0 mt-1 text-lg-normal text-secondary"
			>
				{{ t('common.supported') }}: {{ supportedFileTypesLabel }}
			</p>
		</div>

		<!-- Dropzone Area -->
		<div
			class="fileMediaUploader__dropzone"
			:class="{'fileMediaUploader__dropzone--active': isDragging}"
			@click="openFileBrowser"
		>
			<Icon icon="Upload" class="fileMediaUploader__uploadIcon" />
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
					<Icon icon="DefaultDocument" class="fileMediaUploader__fileIcon" />
					<div class="min-w-0 flex-1">
						<span class="block truncate text-base-bold">{{ file.name }}</span>
						<span class="block text-xs-normal text-secondary">
							{{ formatFileSize(file.size) }}
						</span>
					</div>
					<button
						type="button"
						class="fileMediaUploader__removeBtn"
						:aria-label="t('common.remove')"
						@click="removeFile(file.id)"
					>
						<Icon icon="Cancel" class="fileMediaUploader__removeIcon" />
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
					<label
						:for="`${id}-mediaType-${file.id}`"
						class="mb-1 block text-base-bold text-primary"
					>
						{{ t('submission.upload.selectMediaType') }}
						<span class="font-normal">({{ t('common.required') }})</span>
					</label>
					<p class="m-0 mb-2 text-base-normal text-secondary">
						{{ t('submission.upload.selectMediaTypeDescription') }}
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
				@vdropzone-files-added="onFilesAdded"
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
	onFilesAdded,
	onUploadProgress,
	onUploadSuccess,
	onUploadError,
	onFileRemoved,
	removeFile,
	submit,
	drop,
} = useFileMediaUploader(props, emit);
</script>

<style>
.fileMediaUploader__dropzone {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	margin-top: 1rem;
	margin-bottom: 1rem;
	border: 1px solid #bbb;
	border-radius: 4px;
	background: #fff;
	cursor: pointer;
	transition:
		border-color 0.2s,
		background-color 0.2s;
}

.fileMediaUploader__dropzone:hover,
.fileMediaUploader__dropzone--active {
	border-color: #006798;
	background: #d5e9f2;
}

.fileMediaUploader__uploadIcon {
	margin-bottom: 0.5rem;
	color: #005580;
}

.fileMediaUploader__uploadIcon svg {
	width: 2.5rem;
	height: 2.5rem;
}

.fileMediaUploader__fileIcon {
	flex-shrink: 0;
	color: #505050;
}

.fileMediaUploader__fileIcon svg {
	width: 1.5rem;
	height: 1.5rem;
}

.fileMediaUploader__removeBtn {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	padding: 0;
	border: none;
	background: transparent;
	color: #d00a6c;
	cursor: pointer;
	border-radius: 4px;
}

.fileMediaUploader__removeBtn:hover {
	color: #d00a0a;
}

.fileMediaUploader__removeIcon svg {
	width: 1rem;
	height: 1rem;
}

/* Drag state overlay */
.fileMediaUploader--isDragging::after {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	border: 2px dashed #006798;
	border-radius: 4px;
	background: rgba(0, 103, 152, 0.1);
	pointer-events: none;
}
</style>
