<template>
	<div class="pkpFormField pkpFormField--upload">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="dropzoneHiddenFileId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="i18n.required"
				:multilingualLabel="multilingualLabel"
			/>
			<tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span v-if="tooltip" class="-screenReader" :id="describedByTooltipId" v-html="tooltip" />
			<help-button v-if="helpTopic" :id="describedByHelpId" :topic="helpTopic" :section="helpSection" :label="i18n.help" />
		</div>
		<div v-if="isPrimaryLocale && description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div
			class="pkpFormField__control pkpFormField--upload__control"
			ref="control"
			:id="controlId"
			aria-live="polite"
		>
			<div v-if="currentValue" class="pkpFormField--upload__preview -pkpClearfix">
				<span class="pkpFormField--upload__fileName">
					{{ fileName }}
				</span>
				<div class="pkpFormField--upload__previewActions">
					<pkp-button
						:isWarnable="true"
						:label="i18n.remove"
						@click="clear"
					/>
					<pkp-button	v-if="initialValue && !isInitialValue"
						:label="i18n.restore"
						@click="revert"
					/>
					<multilingual-progress v-if="isMultilingual && locales.length > 1"
						:id="multilingualProgressId"
						:count="multilingualFieldsCompleted"
						:total="locales.length"
						:i18n="i18n"
					/>
				</div>
			</div>
			<field-error v-if="currentValue && errors.length" :id="describedByErrorId" :messages="errors" />
			<!-- Keep the dropzone elements in the dom for $refs manipulation in mounted hook -->
			<div :class="{'-screenReader': currentValue}">
				<vue-dropzone
					ref="dropzone"
					:id="dropzoneId"
					:options="dropzoneOptions"
					@vdropzone-file-added="onAddFile"
					@vdropzone-success="success"
					@vdropzone-error="error"
					@vdropzone-removed-file="onRemoveFile"
				/>
				<field-error v-if="!currentValue && errors.length" :id="describedByErrorId" :messages="errors" />
				<div class="pkpFormField--upload__uploadActions">
					<!-- keyboard-accessible file upload. Keep this element in the dom for screen readers -->
					<pkp-button
						class="pkpFormField--upload__addFile"
						:disabled="!!uploadFile"
						:id="dropzoneClickableId"
						:label="i18n.uploadFile"
					/>
					<pkp-button v-if="!currentValue && initialValue && !isInitialValue"
						class="pkpFormField--upload__restore"
						:label="i18n.restore"
						@click="revert"
					/>
					<multilingual-progress v-if="isMultilingual && locales.length > 1"
						:id="multilingualProgressId"
						:count="multilingualFieldsCompleted"
						:total="locales.length"
						:i18n="i18n"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import VueDropzone from 'vue2-dropzone';
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'FieldUpload',
	extends: FieldBase,
	components: {
		VueDropzone,
		PkpButton
	},
	props: {
		options: Object,
		csrfToken: String
	},
	data() {
		return {
			initialValue: null,
			uploadFile: null
		};
	},
	computed: {
		/**
		 * Is the current value the same as the initial value?
		 *
		 * @return {Boolean}
		 */
		isInitialValue() {
			return (
				!!this.currentValue &&
				!!this.initialValue &&
				this.currentValue === this.initialValue
			);
		},

		/**
		 * The filename to display to the user
		 *
		 * @return {String}
		 */
		fileName() {
			return this.uploadFile
				? this.uploadFile.upload.filename
				: this.currentValue;
		},

		/**
		 * An id for the control element so that focus can be reset as needed
		 *
		 * @return {String}
		 */
		controlId() {
			return this.compileId('control');
		},

		/**
		 * An id for a button to add a file to the dropzone
		 *
		 * Used to ensure keyboard-only file uploads.
		 *
		 * @return {String}
		 */
		dropzoneClickableId() {
			return this.compileId('clickable');
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
		 * An id for dropzone's hidden file input. This is used to link the label
		 * to the file input for screen readers
		 *
		 * @return {String}
		 */
		dropzoneHiddenFileId() {
			return this.compileId('hiddenFileId');
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
				thumbnailWidth: 240,
				maxFiles: 1,
				hiddenInputContainer: '#' + this.controlId,
				clickable: [
					'#' + this.controlId + ' .dropzone',
					'#' + this.dropzoneClickableId
				],
				addRemoveLinks: true,
				previewTemplate: `<div class="dz-preview">
					<img class="dz-image" data-dz-thumbnail />
					<div class="dz-details">
						<div class="dz-filename"><span data-dz-name></span></div>
						<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
					</div>
				</div>`,
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				dictDefaultMessage: this.i18n.dropzoneDictDefaultMessage,
				dictFallbackMessage: this.i18n.dropzoneDictFallbackMessage,
				dictFallbackText: this.i18n.dropzoneDictFallbackText,
				dictFileTooBig: this.i18n.dropzoneDictFileTooBig,
				dictInvalidFileType: this.i18n.dropzoneDictInvalidFileType,
				dictResponseError: this.i18n.dropzoneDictResponseError,
				dictCancelUpload: this.i18n.dropzoneDictCancelUpload,
				dictUploadCanceled: this.i18n.dropzoneDictUploadCanceled,
				dictCancelUploadConfirmation: this.i18n
					.dropzoneDictCancelUploadConfirmation,
				dictRemoveFile: this.i18n.dropzoneDictRemoveFile,
				dictMaxFilesExceeded: this.i18n.dropzoneDictMaxFilesExceeded,
				...this.options
			};
		}
	},
	methods: {
		/**
		 * Clear the current value
		 */
		clear() {
			this.$emit('change', {
				name: this.name,
				value: null,
				localeKey: this.localeKey
			});
			this.uploadFile = null;
			this.$refs.dropzone.dropzone.removeAllFiles();
			this.setFocusToControl();
			this.setErrors([]);
		},

		/**
		 * Revert to the initialValue
		 */
		revert() {
			this.$emit('change', {
				name: this.name,
				value: this.initialValue,
				localeKey: this.localeKey
			});
			this.uploadFile = null;
			this.setFocusToControl();
			this.setErrors([]);
		},

		/**
		 * Respond to dropzone.js event when a file is successfully uploaded
		 *
		 * @param {Object} file Details about the file
		 * @param {Object} response The server response
		 * @see https://www.dropzonejs.com/#event-success
		 */
		success: function(file, response) {
			this.$emit('change', {
				name: this.name,
				value: response.id,
				localeKey: this.localeKey
			});
			this.setFocusToControl();
		},

		/**
		 * Respond to a dropzone.js event when a file upload has begun
		 *
		 * @param {Object} file Details about the file
		 * @see https://www.dropzonejs.com/#event-addedfile
		 */
		onAddFile: function(file) {
			this.uploadFile = {...file};
			this.setErrors([]);
		},

		/**
		 * Response to a dropzone.js event when a file has been removed
		 *
		 * @see https://www.dropzonejs.com/#event-removedfile
		 */
		onRemoveFile() {
			this.uploadFile = null;
			this.setErrors([]);
		},

		/**
		 * Respond to upload errors
		 *
		 * If the message comes from dropzone.js, it will be a string. If it comes from our API,
		 * it will be an object.
		 *
		 * @param {Object} file Details about the file
		 * @param {String|Object} message The error message
		 * @see https://www.dropzonejs.com/#event-error
		 */
		error: function(file, message) {
			let errors = this.errors.slice();
			if (typeof message === 'string') {
				errors.push(message);
			} else if (typeof message === 'object') {
				errors.push(message.errorMessage);
			}
			this.setErrors(errors);
		},

		/**
		 * Emit an event to update the errors for this field and force a re-render.
		 *
		 * Because the errors are stored as an object, Vue's observers won't react when the
		 * object properties change. We force a re-render to ensure the errors prop is refreshed.
		 *
		 * @param {Object} New errors to send
		 */
		setErrors: function(errors) {
			this.$emit('set-errors', this.name, errors, this.localeKey);
		},

		/**
		 * Set the focus to the first focusable element in the control
		 * element.
		 *
		 * This should be used whenever the HTML changes and the focus
		 * position will be dropped for someone using a keyboard or
		 * assistive technology.
		 */
		setFocusToControl() {
			this.$nextTick(() => {
				let focusable = this.$refs.control.querySelectorAll('input,button');
				if (focusable.length) {
					focusable[0].focus();
				} else {
					this.$el.focus();
				}
			});
		}
	},
	watch: {
		/**
		 * Whenever the current value changes, set focus to the control element
		 */
		value: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.setFocusToControl();
		}
	},
	mounted() {
		/**
		 * Add attributes to the hidden file input field so that labels and
		 * descriptions can be accessed by those using assistive devices.
		 */
		this.$refs.dropzone.dropzone.hiddenFileInput.id = this.dropzoneHiddenFileId;
		this.$refs.dropzone.dropzone.hiddenFileInput.setAttribute(
			'aria-describedby',
			this.describedByIds
		);

		/**
		 * Set the initial data, which can't be set in the data() function because it relies on
		 * a computed property
		 */
		this.initialValue = this.currentValue ? this.currentValue : null;
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--upload__preview {
	padding: @base;
	border: @bg-border;
	border-radius: 2px;
	font-size: @font-sml;
	line-height: 1.8em;
}

.pkpFormField--upload__fileName {
	display: inline-block;
	padding: (@half / 2) 0;
}

.pkpFormField--upload__previewActions {
	float: right;
}

.pkpFormField--upload__restore {
	margin-top: @half;
	margin-right: @half;
}

.pkpFormField--upload__addFile {
	margin-top: @half;
}

.pkpFormField--upload .multilingualProgress {
	margin-left: @half;
}

// Dropzone.js
@keyframes progressBar {
	0% {
		background: @primary;
	}
	50% {
		background: @primary-lift;
	}
	100% {
		background: @primary;
	}
}

.pkpFormField--upload {
	.dz-message {
		padding: @base;
		border: 1px dashed @bg-border-color;
		border-radius: 2px;
		text-align: center;
		font-size: @font-sml;
		color: @text-light;
		cursor: pointer;
	}

	.dz-started {
		.dz-message {
			display: none;
		}
	}

	.dz-preview {
		position: relative;
		border: @bg-border;
		border-radius: 2px;
		font-size: @font-tiny;
		line-height: 1.5em;

		+ .dz-preview {
			margin-top: @base;
		}
	}

	.dz-details {
		padding: @base;
	}

	.dz-filename {
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	.dz-progress {
		position: relative;
		display: block;
		margin-top: @base;
		height: @half;
		background: @bg;
		border-radius: @half / 2;
		overflow: hidden; // apply border-radius to progress bar
	}

	.dz-upload {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		height: @half;
		background: @primary;
		transition: 0.2s all;
		animation: progressBar 1s infinite;
	}

	.dz-remove {
		position: absolute;
		top: @base;
		right: @base;
		padding-left: @half;
		background: @lift;
	}

	.dz-image {
		display: none;
	}
}
</style>
