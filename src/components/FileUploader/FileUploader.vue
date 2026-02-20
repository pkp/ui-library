<template>
	<div :id="id" class="fileUploader" :class="{'-isDragging': isDragging}">
		<VueDropzone
			v-if="isMounted"
			:id="dropzoneId"
			ref="dropzone"
			:options="dropzoneOptions"
			@vdropzone-error="dropzoneError"
			@vdropzone-files-added="dropzoneFilesAdded"
			@vdropzone-removed-file="dropzoneRemovedFile"
			@vdropzone-success="dropzoneSuccess"
			@vdropzone-upload-progress="dropzoneUploadProgress"
			@vdropzone-total-upload-progress="dropzoneTotalUploadProgress"
			@vdropzone-drop="drop"
		/>
		<span v-if="status" class="-screenReader" role="status">
			{{ status }}
		</span>
	</div>
</template>

<script>
import VueDropzone from 'dropzone-vue3';
import {useDropzoneDragDrop} from '@/composables/useDropzoneDragDrop';
import {parseDropzoneError} from '@/utils/fileUtils';

export default {
	components: {
		VueDropzone,
	},
	props: {
		/** The URL to upload files to. */
		apiUrl: {
			type: String,
			required: true,
		},
		/** An optional locale key use for the filename. See "Localized Filenames" below. */
		filenameLocale: {
			type: String,
			default() {
				return '';
			},
		},
		/** An array of uploaded files. */
		files: {
			type: Array,
			required: true,
		},
		/** A unique id for the uploader. */
		id: {
			type: String,
			required: true,
		},
		/** Optional [Dropzone.js](https://docs.dropzone.dev/configuration/basics/configuration-options) configuration. */
		options: {
			type: Object,
			default() {
				return {};
			},
		},
		/** Any query params that should be used in the file upload request. */
		queryParams: {
			type: Object,
			default() {
				return {};
			},
		},
		/** A localized string with the upload progress label, such as "Uploading {$percent}% complete". */
		uploadProgressLabel: {
			type: String,
			required: true,
		},
	},
	emits: [
		'set',
		/** Emitted when the files have changed. Payload: `(files)` */
		'updated:files',
	],
	setup() {
		const {isDragging, drop} = useDropzoneDragDrop();
		return {isDragging, drop};
	},
	data() {
		return {
			status: '',
			isMounted: false,
		};
	},
	computed: {
		/**
		 * An id for the dropzone component
		 *
		 * Required by vue2-dropzone, this ensures it is unique when used more
		 * than once on a page.
		 *
		 * @return {String}
		 */
		dropzoneId() {
			return this.id + 'dropzone';
		},

		/**
		 * Options to pass to the dropzone component
		 *
		 * Merges defaults with any options supplied by the `options` prop
		 *
		 * @return {Object}
		 */
		dropzoneOptions() {
			return {
				method: 'POST',
				url: this.apiUrl,
				thumbnailWidth: 240,
				hiddenInputContainer: '#' + this.id,
				addRemoveLinks: true,
				previewTemplate: '<p></p>',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				params: (files, xhr) => {
					const name = this.filenameLocale
						? 'name[' + this.filenameLocale + ']'
						: 'name';
					return {
						...this.queryParams,
						[name]: files[0].name,
					};
				},
				...this.options,
			};
		},
	},
	mounted() {
		this.isMounted = true;
	},
	methods: {
		/**
		 * Cancel an upload in progress
		 *
		 * @param {Number} id The id of the file to remove
		 */
		cancelUpload(id) {
			const file = this.$refs.dropzone.dropzone.files.find(
				(f) => f.upload.uuid === id,
			);
			if (file) {
				this.$refs.dropzone.removeFile(file);
			}
		},

		/**
		 * Respond to upload errors
		 *
		 * If the message comes from dropzone.js, it will be a string. If it comes from our API,
		 * it will be an object.
		 *
		 * @param {File} erroredFile Details about the file
		 * @param {String|Object} message The error message
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneError(erroredFile, error) {
			const errors = parseDropzoneError(error);

			// Use $nextTick to compensate for the fact that this fires
			// before dropzoneFilesAdded but we need this to fire after
			// the event emitted in dropzoneFilesAdded
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$nextTick(() => {
						const newFiles = this.files.map((file) => {
							if (file.id === erroredFile.upload.uuid) {
								file.errors = errors;
							}
							return file;
						});
						this.$emit('updated:files', newFiles);
					});
				});
			});
		},

		/**
		 * Respond to a dropzone.js event when a file upload has begun
		 *
		 * @param {FileList} files List of File objects
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneFilesAdded(files) {
			console.log('dropzone files added1');
			// use $nextTick because file.upload is undefined on initial call
			this.$nextTick(() => {
				console.log('dropzone files added2');

				const newFiles = Array.from(files).map((file) => {
					console.log('dropzone files added3');

					return {
						id: file.upload.uuid,
						name: file.upload.filename,
						progress: file.upload.progress,
						errors: [],
					};
				});
				this.$emit('updated:files', this.files.concat(newFiles));
			});
		},

		/**
		 * Respond to a dropzone.js event when a file has been removed
		 *
		 * @param {File} file Details about the file to be removed
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneRemovedFile(file) {
			const files = this.files.filter(
				(item) => !item.id || item.id !== file.upload.uuid,
			);
			this.$emit('updated:files', files);
		},

		/**
		 * Respond to a dropzone.js event when a file is successfully uploaded
		 *
		 * @param {File} file Details about the file
		 * @param {Object} response The server response
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneSuccess(file, response) {
			const files = this.files.map((item) => {
				if (item.id === file.upload.uuid) {
					return response;
				}
				return item;
			});
			this.$emit('updated:files', files);
		},

		/**
		 * Respond to a dropzone.js event when the total upload progress is updated
		 *
		 * @param {Number} progress Upload progress 0-100
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneTotalUploadProgress(progress) {
			this.status = this.uploadProgressLabel.replace(
				'{$percent}',
				progress.toFixed(0),
			);
		},

		/**
		 * Respond to a dropzone.js event when the progress is updated
		 *
		 * @param {File} file Details about the file
		 * @param {Number} progress The server response
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneUploadProgress(file, progress) {
			const files = this.files.map((item) => {
				if (item.id === file.upload.uuid) {
					item.progress = progress;
				}
				return item;
			});
			this.$emit('set', this.id, files);
		},

		/**
		 * Open the file browser dialog
		 */
		openFileBrowser() {
			this.$refs.dropzone.dropzone.hiddenFileInput.click();
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileUploader {
	position: absolute;
	width: 0;
	height: 0;
	overflow: hidden;
	opacity: 0;

	.vue-dropzone {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		background: @lift;
		font-size: @font-sml;

		.dz-remove {
			display: none;
		}
	}

	&.-isDragging {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: auto;
		height: auto;
		overflow: visible;
		outline: 2px dashed @primary;
		opacity: 1;
		transition: opacity 0.3s ease-in-out;
	}
}
</style>
