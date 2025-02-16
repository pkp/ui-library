<template>
	<div class="pkpFormField pkpFormField--upload">
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:control-id="dropzoneHiddenFileId"
				:label="label"
				:locale-label="localeLabel"
				:is-required="isRequired"
				:required-label="t('common.required')"
				:multilingual-label="multilingualLabel"
				class="align-middle"
			/>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
			<HelpButton
				v-if="helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="t('help.help')"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description"
		/>
		<div
			:id="controlId"
			ref="control"
			class="pkpFormField__control pkpFormField--upload__control"
			aria-live="polite"
		>
			<div v-if="currentValue" class="pkpFormField--upload__preview">
				<span class="pkpFormField--upload__fileName">
					{{ fileName }}
				</span>
				<div class="pkpFormField--upload__previewActions">
					<PkpButton :is-warnable="true" @click="clear">
						{{ t('common.remove') }}
					</PkpButton>
					<PkpButton v-if="initialValue && !isInitialValue" @click="revert">
						{{ restoreLabel }}
					</PkpButton>
					<MultilingualProgress
						v-if="isMultilingual && locales.length > 1"
						:id="multilingualProgressId"
						:count="multilingualFieldsCompleted"
						:total="locales.length"
					/>
				</div>
			</div>
			<FieldError
				v-if="currentValue && errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
			<!-- Keep the dropzone elements in the dom for $refs manipulation in mounted hook -->
			<div :class="{'-screenReader': currentValue}">
				<VueDropzone
					v-if="isComponentMounted"
					:id="dropzoneId"
					ref="dropzone"
					:options="dropzoneOptions"
					@vdropzone-file-added="onAddFile"
					@vdropzone-success="success"
					@vdropzone-error="error"
					@vdropzone-removed-file="onRemoveFile"
				/>
				<FieldError
					v-if="!currentValue && errors && errors.length"
					:id="describedByErrorId"
					:messages="errors"
				/>
				<div class="pkpFormField--upload__uploadActions">
					<!-- keyboard-accessible file upload. Keep this element in the dom for screen readers -->
					<PkpButton
						:id="dropzoneClickableId"
						class="pkpFormField--upload__addFile"
						:disabled="!!uploadFile"
					>
						{{ uploadFileLabel }}
					</PkpButton>
					<PkpButton
						v-if="!currentValue && initialValue && !isInitialValue"
						class="pkpFormField--upload__restore"
						@click="revert"
					>
						{{ restoreLabel }}
					</PkpButton>
					<MultilingualProgress
						v-if="isMultilingual && locales.length > 1"
						:id="multilingualProgressId"
						:count="multilingualFieldsCompleted"
						:total="locales.length"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import VueDropzone from 'dropzone-vue3';
import PkpButton from '@/components/Button/Button.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import FieldError from '@/components/Form/FieldError.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';

export default {
	name: 'FieldUpload',
	components: {
		VueDropzone,
		PkpButton,
		Tooltip,
		MultilingualProgress,
		FieldError,
		HelpButton,
		FormFieldLabel,
	},
	extends: FieldBase,
	props: {
		/**  Pass [options](https://www.dropzonejs.com/#configuration-options) to Dropzone.js. */
		options: Object,
		restoreLabel: String,
		uploadFileLabel: String,
	},
	data() {
		return {
			initialValue: null,
			uploadFile: null,
			// tracking whether this component is mounted
			// before rendering vue-dropzone, as it requires
			// clickables to be mounted already, which is issue for
			// dropzoneClickableId which by default gets mounted
			// after DOM after vue-dropzone
			isComponentMounted: false,
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
				!!this.currentValue.dateUploaded &&
				!!this.initialValue.dateUploaded &&
				this.currentValue.dateUploaded === this.initialValue.dateUploaded
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
				: this.currentValue.uploadName;
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
					'#' + this.dropzoneClickableId,
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
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				...this.options,
			};
		},
	},
	mounted() {
		this.isComponentMounted = true;

		// not ideal, but first this component needs to get mounted
		// than vue-dropzone gets mounted and afterwards vue-dropzone
		// DOM can be manipulated
		setTimeout(() => {
			/**
			 * Add attributes to the hidden file input field so that labels and
			 * descriptions can be accessed by those using assistive devices.
			 */
			this.$refs.dropzone.dropzone.hiddenFileInput.id =
				this.dropzoneHiddenFileId;
			this.$refs.dropzone.dropzone.hiddenFileInput.setAttribute(
				'aria-describedby',
				this.describedByIds,
			);

			/**
			 * Set the initial data, which can't be set in the data() function because it relies on
			 * a computed property
			 */
			this.initialValue = this.currentValue ? this.currentValue : null;
		});
	},
	methods: {
		/**
		 * Clear the current value
		 */
		clear() {
			this.$emit('change', this.name, 'value', null, this.localeKey);
			this.uploadFile = null;
			this.$refs.dropzone.dropzone.removeAllFiles();
			this.setFocusToControl();
			this.setErrors([]);
		},

		/**
		 * Revert to the initialValue
		 */
		revert() {
			this.$emit(
				'change',
				this.name,
				'value',
				this.initialValue,
				this.localeKey,
			);
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
		success: function (file, response) {
			this.$emit(
				'change',
				this.name,
				'value',
				{temporaryFileId: response.id},
				this.localeKey,
			);
			this.setFocusToControl();
		},

		/**
		 * Respond to a dropzone.js event when a file upload has begun
		 *
		 * @param {Object} file Details about the file
		 * @see https://www.dropzonejs.com/#event-addedfile
		 */
		onAddFile: function (file) {
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
		error: function (file, message) {
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
		setErrors: function (errors) {
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
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--upload__preview {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem;
	border: @bg-border;
	border-radius: 2px;
	font-size: @font-sml;
	line-height: 1.8em;
}

.pkpFormField--upload__fileName {
	padding: 0.25rem 0;
}

.pkpFormField--upload__restore {
	margin-top: 0.5rem;
	margin-inline-end: 0.5rem;
}

.pkpFormField--upload__addFile {
	margin-top: 0.5rem;
}

.pkpFormField--upload .multilingualProgress {
	margin-inline-start: 0.5rem;
}

.pkpFormField--upload__uploadActions,
.pkpFormField--upload__previewActions {
	.pkpButton + .pkpButton {
		margin-inline-start: 0.5rem;
	}
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
		padding: 1rem;
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
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		border: @bg-border;
		border-radius: 2px;
		font-size: @font-tiny;
		line-height: 1.5em;
	}

	.dz-details {
		flex-grow: 1;
	}

	.dz-filename {
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	.dz-progress {
		position: relative;
		margin-top: 1rem;
		height: 0.5rem;
		background: @bg;
		border-radius: 0.25rem;
		overflow: hidden; // apply border-radius to progress bar
	}

	.dz-upload {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		height: 0.5rem;
		background: @primary;
		transition: 0.2s all;
		animation: progressBar 1s infinite;
	}

	.dz-remove {
		background: @lift;
	}

	.dz-image {
		display: none;
	}
}
</style>
