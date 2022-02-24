<template>
	<div class="fileUploader" :class="{'-isDragging': isDragging}" :id="id">
		<vue-dropzone
			ref="dropzone"
			:id="dropzoneId"
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
import VueDropzone from 'vue2-dropzone';

export default {
	components: {
		VueDropzone
	},
	props: {
		apiUrl: {
			type: String,
			required: true
		},
		filenameLocale: {
			type: String,
			default() {
				return '';
			}
		},
		files: {
			type: Array,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		options: {
			type: Object,
			default() {
				return {};
			}
		},
		queryParams: {
			type: Object,
			default() {
				return {};
			}
		},
		uploadProgressLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			dragEventCounter: 0,
			isDragging: false,
			status: ''
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
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				params: (files, xhr) => {
					const name = this.filenameLocale
						? 'name[' + this.filenameLocale + ']'
						: 'name';
					return {
						...this.queryParams,
						[name]: files[0].name
					};
				},
				...this.options
			};
		}
	},
	methods: {
		/**
		 * Cancel an upload in progress
		 *
		 * @param {Number} id The id of the file to remove
		 */
		cancelUpload(id) {
			const file = this.$refs.dropzone.dropzone.files.find(
				f => f.upload.uuid === id
			);
			if (file) {
				this.$refs.dropzone.removeFile(file);
			}
		},

		/**
		 * Event handler when the user drags over an element
		 *
		 * Callback for `dragenter` events.
		 *
		 * The dragenter and dragleave events are fired on every
		 * element as the user drags across the screen. The counter
		 * tracks the enter/leave events across all elements. When
		 * the counter reaches 0 again, the user has dragged away
		 * from the viewport or dropped the files into a drop area.
		 *
		 * See https://stackoverflow.com/questions/3144881/how-do-i-detect-a-html5-drag-event-entering-and-leaving-the-window-like-gmail-d#comment7748043_3144881
		 *
		 * @param {DragEvent} event
		 */
		dragenter(event) {
			this.dragEventCounter = this.dragEventCounter + 1;
			this.isDragging = event.dataTransfer.types.includes('Files');
		},

		/**
		 * Event handler when the user drags away from an element
		 *
		 * Callback for `dragleave` events.
		 *
		 * @see this.dragenter
		 * @param {DragEvent} event
		 */
		dragleave(event) {
			this.dragEventCounter = this.dragEventCounter - 1;
			this.isDragging = this.dragEventCounter > 0;
		},

		/**
		 * Event handler when the user "drops" in a drag-and-drop action
		 *
		 * Callback for `drop` and `dragover` events. Both events are
		 * needed to catch drops that happen outside the drop target
		 * and prevent the browser from redirecting.
		 *
		 * See: https://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file#comment51502784_6756680
		 *
		 * @see this.dragenter
		 * @param {DragEvent} event
		 */
		drop(event) {
			// preventDefault will prevent the browser from loading the
			// file if the user accidentally missed the drop target
			event.preventDefault();
			if (event.type === 'drop') {
				this.isDragging = false;
				this.dragEventCounter = 0;
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
			let errors = [];
			if (typeof error === 'string') {
				errors = [error];
			} else {
				// Error objects with error code and message
				if (typeof error.errorMessage !== 'undefined') {
					errors = [error.errorMessage];
					// Error objects with invalid properties
				} else if (typeof error === 'object' && error !== null) {
					errors = Object.keys(error)
						.map(key => error[key])
						.flat();
				}
			}

			// Use $nextTick to compensate for the fact that this fires
			// before dropzoneFilesAdded but we need this to fire after
			// the event emitted in dropzoneFilesAdded
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$nextTick(() => {
						const newFiles = this.files.map(file => {
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
			// use $nextTick because file.upload is undefined on initial call
			this.$nextTick(() => {
				const newFiles = Array.from(files).map(file => {
					return {
						id: file.upload.uuid,
						name: file.upload.filename,
						progress: file.upload.progress,
						errors: []
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
				item => !item.id || item.id !== file.upload.uuid
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
			const files = this.files.map(item => {
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
				progress.toFixed(0)
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
			const files = this.files.map(item => {
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
		}
	},
	mounted() {
		/**
		 * Listen for when the user performs a drag-and-drop action
		 */
		document.addEventListener('dragenter', this.dragenter, true);
		document.addEventListener('dragleave', this.dragleave, true);
		document.addEventListener('dragover', this.drop, true);
		document.addEventListener('drop', this.drop);
	},
	destroyed() {
		/**
		 * Clean up listeners
		 */
		document.removeEventListener('dragenter', this.dragenter, true);
		document.removeEventListener('dragleave', this.dragleave, true);
		document.removeEventListener('dragover', this.drop, true);
		document.removeEventListener('drop', this.drop);
	}
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
