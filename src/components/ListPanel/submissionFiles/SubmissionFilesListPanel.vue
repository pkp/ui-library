<template>
	<div class="submissionFilesListPanel" :id="controlId">
		<list-panel :items="items" class="listPanel--submissionFiles">
			<pkp-header slot="header">
				<h2>{{ title }}</h2>
				<template slot="actions">
					<pkp-button ref="addFileButton" @click="openFileBrowser">
						{{ addFileLabel }}
					</pkp-button>
				</template>
			</pkp-header>

			<template slot="itemsEmpty">
				{{ emptyLabel }}
				<button class="-linkButton" @click="openFileBrowser">
					{{ emptyAddLabel }}
				</button>
			</template>

			<template v-slot:item="{item}">
				<slot name="item" :item="item">
					<submission-files-list-item
						:apiUrl="apiUrl"
						:cancelUploadLabel="cancelUploadLabel"
						:genrePromptLabel="genrePromptLabel"
						:documentTypes="documentTypes"
						:fileStage="fileStage"
						:genres="genres"
						:item="item"
						:otherLabel="otherLabel"
						:stageId="stageId"
						@cancel="dropzoneCancelUpload"
						@edit="edit"
						@remove="remove"
						@update="updateItem"
					/>
				</slot>
			</template>
		</list-panel>
		<vue-dropzone
			ref="dropzone"
			:id="dropzoneId"
			:options="dropzoneOptions"
			:class="{'-isDragging': isDragging}"
			@vdropzone-error="dropzoneError"
			@vdropzone-files-added="dropzoneFilesAdded"
			@vdropzone-removed-file="dropzoneRemovedFile"
			@vdropzone-success="dropzoneSuccess"
			@vdropzone-upload-progress="dropzoneUploadProgress"
			@vdropzone-total-upload-progress="dropzoneTotalUploadProgress"
			@vdropzone-drag-over="dragover"
			@vdropzone-drag-leave="dragleave"
			@vdropzone-drop="dragleave"
		/>
		<span v-if="status" class="-screenReader" role="status">
			{{ status }}
		</span>
		<modal v-bind="MODAL_PROPS" name="form">
			<modal-content
				:closeLabel="__('common.close')"
				modalName="form"
				:title="editingLabel"
			>
				<pkp-form v-bind="activeForm" @set="setForm" @success="formSuccess" />
			</modal-content>
		</modal>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import SubmissionFilesListItem from '@/components/ListPanel/submissionFiles/SubmissionFilesListItem.vue';
import VueDropzone from 'vue2-dropzone';
import modal from '@/mixins/modal';
import cloneDeep from 'clone-deep';

export default {
	mixins: [modal],
	components: {
		ListPanel,
		PkpForm,
		PkpHeader,
		SubmissionFilesListItem,
		VueDropzone
	},
	props: {
		addFileLabel: {
			type: String,
			required: true
		},
		apiUrl: {
			type: String,
			required: true
		},
		cancelUploadLabel: {
			type: String,
			required: true
		},
		documentTypes: {
			type: Object,
			required: true
		},
		emptyLabel: {
			type: String,
			required: true
		},
		emptyAddLabel: {
			type: String,
			required: true
		},
		fileStage: {
			type: Number,
			required: true
		},
		form: {
			type: Object
		},
		genrePromptLabel: {
			type: String,
			required: true
		},
		genres: {
			type: Array,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			default() {
				return [];
			}
		},
		options: {
			type: Object,
			default() {
				return {};
			}
		},
		otherLabel: {
			type: String,
			required: true
		},
		removeConfirmLabel: {
			type: String,
			required: true
		},
		stageId: {
			type: Number,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		uploadProgressLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			activeForm: {},
			editingLabel: '',
			isDragging: false,
			status: ''
		};
	},
	computed: {
		/**
		 * An id for the control element so that focus can be reset as needed
		 *
		 * @return {String}
		 */
		controlId() {
			return this.compileId('control');
		},

		/**
		 * An id for the dropzone component
		 *
		 * Required by vue2-dropzone, this ensures it is unique when used more
		 * than once on a page.
		 *
		 * @return {String}
		 */
		dropzoneId() {
			return this.compileId('dropzone');
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
				hiddenInputContainer: '#' + this.controlId,
				addRemoveLinks: true,
				previewTemplate: '<p></p>',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				params: (files, xhr) => {
					const name = 'name[' + $.pkp.app.primaryLocale + ']';
					return {
						fileStage: this.fileStage,
						[name]: files[0].name
					};
				},
				...this.options
			};
		}
	},
	methods: {
		/**
		 * Helper function to compile unique IDs for elements
		 *
		 * @param {String} type The type of ID you want to generate (eg - `tooltip`)
		 * @return {String}
		 */
		compileId(type) {
			return [this.id, type].join('-');
		},

		/**
		 * Event handler when the user stops dragging
		 *
		 * Callback for `dragend` and `dragleave` events.
		 * Both events are needed because a `dragend` event
		 * is not fired if the user ends the drag outside
		 * of the browser.
		 *
		 * @param {Object} event
		 */
		dragleave(event) {
			// preventDefault will prevent the browser from loading the
			// file if the user accidentally missed the drop target
			event.preventDefault();
			this.isDragging = false;
		},

		/**
		 * Event handler when the user starts or continues
		 * dragging
		 *
		 * Callback for `dragstart` and `dragover` events.
		 * Both events are needed because a `dragstart` event
		 * is not fired when the user is dragging from another
		 * program, like a file browser on their desktop.
		 *
		 * @param {Object} event
		 */
		dragover(event) {
			// preventDefault will prevent the browser from loading the
			// file if the user accidentally missed the drop target
			event.preventDefault();
			this.isDragging = event.dataTransfer.types.includes('Files');
		},

		/**
		 * Cancel an upload in progress or completed but not yet
		 * saved as a submission file
		 *
		 * @param {Number} uuid The uuid of the file to remove
		 */
		dropzoneCancelUpload(uuid) {
			const file = this.$refs.dropzone.dropzone.files.find(
				f => f.upload.uuid === uuid
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
		 * @param {File} file Details about the file
		 * @param {String|Object} message The error message
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneError(file, error) {
			error = typeof error === 'string' ? error : error.errorMessage;

			// Use $nextTick to compensate for the fact that this fires
			// before dropzoneFilesAdded but we need this to fire after
			// the event emitted in dropzoneFilesAdded
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$nextTick(() => {
						const newItems = this.items.map(item => {
							if (item.uuid && item.uuid === file.upload.uuid) {
								item.error = error;
							}
							return item;
						});
						this.$emit('set', this.id, {items: [...newItems]});
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
						uuid: file.upload.uuid,
						name: file.upload.filename,
						progress: file.upload.progress,
						error: ''
					};
				});
				const items = this.items.concat(newFiles);
				this.$emit('set', this.id, {items});
			});
		},

		/**
		 * Respond to a dropzone.js event when a file has been removed
		 *
		 * @param {File} file Details about the file to be removed
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneRemovedFile(file) {
			const items = this.items.filter(
				item => !item.uuid || item.uuid !== file.upload.uuid
			);
			this.$emit('set', this.id, {items});
		},

		/**
		 * Respond to a dropzone.js event when a file is successfully uploaded
		 *
		 * @param {File} file Details about the file
		 * @param {Object} response The server response
		 * @see https://www.dropzonejs.com/#event-list
		 */
		dropzoneSuccess(file, response) {
			const items = this.items.map(item => {
				if (item.uuid === file.upload.uuid) {
					return response;
				}
				return item;
			});
			this.$emit('set', this.id, {items});
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
			const items = this.items.map(item => {
				if (item.uuid === file.upload.uuid) {
					item.progress = progress;
				}
				return item;
			});
			this.$emit('set', this.id, {items});
		},

		/**
		 * Open the editing panel for a file
		 *
		 * @param {Object} item The item to edit
		 */
		edit(item) {
			let activeForm = {...cloneDeep(this.form)};
			activeForm.action =
				activeForm.action + '/' + item.id + '?stageId=' + this.stageId;
			// Set values that match the form fields
			activeForm.fields = activeForm.fields.map(field => {
				if (item[field.name] != null) {
					field.value = item[field.name];
				}
				return field;
			});
			this.activeForm = activeForm;
			this.editingLabel = this.__('common.editItem', {
				name: this.localize(item.name)
			});
			this.$modal.show('form');
		},

		/**
		 * Fired when the edit form has been saved
		 *
		 * @param {Object} item The item to update
		 */
		formSuccess(item) {
			this.updateItem(item);
			this.$modal.hide('form');
			this.activeForm = {};
			this.$el.querySelector('#edit-' + item.id).focus();
		},

		/**
		 * Open the file browser dialog
		 */
		openFileBrowser() {
			this.$refs.dropzone.dropzone.hiddenFileInput.click();
		},

		/**
		 * Remove a file
		 *
		 * @param {Object} item The file in this.items to remove
		 */
		remove(item) {
			this.openDialog({
				cancelLabel: this.__('common.no'),
				modalName: 'remove',
				message: this.removeConfirmLabel,
				title: this.__('common.remove'),
				callback: () => {
					var self = this;
					$.ajax({
						url: this.apiUrl + '/' + item.id + '?stageId=' + this.stageId,
						type: 'POST',
						headers: {
							'X-Csrf-Token': pkp.currentUser.csrfToken,
							'X-Http-Method-Override': 'DELETE'
						},
						error: self.ajaxErrorCallback,
						success(r) {
							const items = self.items.filter(item => item.id !== r.id);
							self.$emit('set', self.id, {items});
							self.$modal.hide('remove');
							self.$refs.addFileButton.$el.focus();
						}
					});
				}
			});
		},

		/**
		 * Update the data in the active form
		 *
		 * @param {Number} key The id of the form
		 * @param {Object} data Key/value map of the data to be changed
		 */
		setForm(key, data) {
			let activeForm = {...this.activeForm};
			Object.keys(data).forEach(function(key) {
				activeForm[key] = data[key];
			});
			this.activeForm = activeForm;
		},

		/**
		 * Update one of the items in the list
		 *
		 * @param {Object} newItem The item to update
		 */
		updateItem(newItem) {
			const items = this.items.map(item => {
				return item.id === newItem.id ? newItem : item;
			});
			this.$emit('set', this.id, {items});
		}
	},
	mounted() {
		/**
		 * Listen for when the user performs a drag-and-drop action
		 */
		document.addEventListener('dragover', this.dragover);
		document.addEventListener('dragstart', this.dragover);
		document.addEventListener('dragend', this.dragleave);
		document.addEventListener('dragleave', this.dragleave);
		document.addEventListener('drop', this.dragleave);
	},
	destroyed() {
		/**
		 * Clean up listeners
		 */
		document.removeEventListener('dragover', this.dragover);
		document.removeEventListener('dragstart', this.dragover);
		document.removeEventListener('dragend', this.dragleave);
		document.removeEventListener('dragleave', this.dragleave);
		document.removeEventListener('drop', this.dragleave);
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

// Dropzone.js
.submissionFilesListPanel {
	position: relative;

	.vue-dropzone {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		background: @lift;
		font-size: @font-sml;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;

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
		}

		.dz-remove {
			display: none;
		}
	}
}
</style>
