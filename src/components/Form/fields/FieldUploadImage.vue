<template>
	<div class="pkpFormField pkpFormField--upload pkpFormField--uploadImage">
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
			<span
				v-if="tooltip"
				class="-screenReader"
				:id="describedByTooltipId"
				v-html="tooltip"
			/>
			<help-button
				v-if="helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="i18n.help"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
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
			<div
				v-if="currentValue"
				class="pkpFormField--upload__preview -pkpClearfix"
			>
				<div
					v-if="this.thumbnail"
					class="pkpFormField--uploadImage__thumbnailWrapper"
				>
					<img
						class="pkpFormField--uploadImage__thumbnail"
						:alt="i18n.thumbnailDescription"
						:src="thumbnail"
					/>
				</div>
				<div class="pkpFormField--upload__details">
					<label class="pkpFormFieldLabel" :for="altTextId">
						{{ i18n.altTextLabel }}
					</label>
					<input
						class="pkpFormField__input pkpFormField--uploadImage__altTextInput"
						type="text"
						v-model="altTextValue"
						:id="altTextId"
						:aria-describedby="altTextDescriptionId"
					/>
					<div
						class="pkpFormField--uploadImage__altTextDescription"
						v-html="i18n.altTextDescription"
						:id="altTextDescriptionId"
					/>
				</div>
				<div class="pkpFormField--upload__previewActions">
					<pkp-button :isWarnable="true" :label="i18n.remove" @click="clear" />
					<pkp-button
						v-if="initialValue && !isInitialValue"
						:label="i18n.restore"
						@click="revert"
					/>
					<multilingual-progress
						v-if="isMultilingual && locales.length > 1"
						:id="multilingualProgressId"
						:count="multilingualFieldsCompleted"
						:total="locales.length"
						:i18n="i18n"
					/>
				</div>
			</div>
			<field-error
				v-if="currentValue && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
			<!-- Keep the dropzone elements in the dom so they can be manipulated in mounted hook -->
			<div :class="{'-screenReader': currentValue}">
				<vue-dropzone
					ref="dropzone"
					:id="dropzoneId"
					:options="dropzoneOptions"
					@vdropzone-file-added="onAddFile"
					@vdropzone-thumbnail="onThumbnail"
					@vdropzone-success="success"
					@vdropzone-error="error"
					@vdropzone-removed-file="onRemoveFile"
				/>
				<field-error
					v-if="errors.length"
					:id="describedByErrorId"
					:messages="errors"
				/>
				<div class="pkpFormField--upload__uploadActions">
					<!-- keyboard-accessible file upload -->
					<pkp-button
						class="pkpFormField--upload__addFile"
						:disabled="!!uploadFile"
						:id="dropzoneClickableId"
						:label="i18n.uploadFile"
					/>
					<pkp-button
						v-if="initialValue && !isInitialValue"
						class="pkpFormField--upload__restore"
						:label="i18n.restore"
						@click="revert"
					/>
					<multilingual-progress
						v-if="isMultilingual && locales.length > 1"
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
import FieldUpload from './FieldUpload.vue';

export default {
	name: 'FieldUploadImage',
	extends: FieldUpload,
	props: {
		baseUrl: String
	},
	data() {
		return {
			altTextValue: '',
			initialValue: null
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
		 * Determine the `src` attribute for the thumbnail preview
		 *
		 * @return {String}
		 */
		thumbnail() {
			if (this.uploadFile) {
				return this.uploadFile.dataURL;
			} else if (this.currentValue && this.currentValue.uploadName) {
				return this.baseUrl + '/' + this.currentValue.uploadName;
			}
			return '';
		},

		/**
		 * An id for the alt text input so the label can be linked to it
		 *
		 * @return {String}
		 */
		altTextId() {
			return this.compileId('altText');
		},

		/**
		 * An id for the alt text description so the input can refer to it in an
		 * aria-describedby attribute.
		 *
		 * @return {String}
		 */
		altTextDescriptionId() {
			return this.compileId('altTextDescription');
		}
	},
	methods: {
		/**
		 * Respond to dropzone.js event when a file is successfully uploaded
		 *
		 * @param {Object} file Details about the file
		 * @param {Object} response The server response
		 * @see https://www.dropzonejs.com/#event-success
		 */
		success: function(file, response) {
			this.isUploading = false;
			this.$emit('change', {
				name: this.name,
				value: {
					temporaryFileId: response.id,
					altText: ''
				},
				localeKey: this.localeKey
			});
			this.setFocusToControl();
		},

		/**
		 * Respond to a dropzone.js event when it creates a thumbnail
		 *
		 * @param {Object} file Details about the file
		 * @see https://www.dropzonejs.com/#event-thumbnail
		 */
		onThumbnail: function(file) {
			this.uploadFile = {...file};
			this.setFocusToControl();
		}
	},
	watch: {
		/**
		 * Whenever the current value changes, update the altTextValue to keep
		 * the field in sync with external changes
		 */
		currentValue: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.altTextValue = newVal && newVal.altText ? newVal.altText : '';
		},

		/**
		 * Whenever the alt text field changes, sync the change to the correct
		 * property in the value object
		 */
		altTextValue: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (!newVal && !this.currentValue) {
				return;
			}
			this.$emit('change', {
				name: this.name,
				value: {
					...this.currentValue,
					altText: newVal
				},
				localeKey: this.localeKey
			});
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
		this.altTextValue = this.currentValue ? this.currentValue.altText : '';
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--uploadImage__thumbnailWrapper {
	float: left;
	width: 40%;
	margin-bottom: @base;
}

.pkpFormField--uploadImage__thumbnail {
	display: block;
	max-width: 100%;
	height: auto;
	margin-left: auto;
	margin-right: auto;
}

.pkpFormField--uploadImage__thumbnailWrapper + .pkpFormField--upload__details {
	margin-left: 40%;
	padding-left: @base;
}

.pkpFormField--uploadImage__altTextInput {
	width: 100%;
}

.pkpFormField--uploadImage__altTextDescription {
	color: @text-light;
}

// Stack image preview and alt text columns when showing multiple locales
.pkpForm--hasManyVisibleLocales {
	.pkpFormField--uploadImage__thumbnailWrapper {
		float: none;
		width: 100%;

		+ .pkpFormField--upload__details {
			float: none;
			width: 100%;
			margin-left: 0;
			padding-left: 0;
		}
	}
}

.pkpFormField--uploadImage {
	.pkpFormField--upload__previewActions {
		float: none;
		clear: both;
		margin: @base -@base -@base;
		padding: @base;
		border-top: @bg-border;

		.pkpButton + .pkpButton {
			margin-left: @half;
		}
	}

	// Dropzone.js preview with thumbnail
	.dz-image-preview {
		display: block;

		&:before,
		&:after {
			content: ' ';
			display: table;
		}

		&:after {
			clear: both;
		}

		.dz-image {
			display: block;
			float: right;
			width: 48px;
			margin: @base @base @base 0;
			border-radius: 2px;
		}

		.dz-details {
			margin-right: 48px + @base;
		}

		.dz-remove {
			right: 48px + @double;
		}
	}
}
</style>
