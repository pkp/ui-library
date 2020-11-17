<template>
	<div class="pkpFormField pkpFormField--upload pkpFormField--uploadImage">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="dropzoneHiddenFileId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="__('common.required')"
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
				:label="__('help.help')"
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
						:alt="thumbnailDescription"
						:src="thumbnail"
					/>
				</div>
				<div class="pkpFormField--upload__details">
					<label class="pkpFormFieldLabel" :for="altTextId">
						{{ altTextLabel }}
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
						v-html="altTextDescription"
						:id="altTextDescriptionId"
					/>
				</div>
				<div class="pkpFormField--upload__previewActions">
					<pkp-button :isWarnable="true" @click="clear">
						{{ __('common.remove') }}
					</pkp-button>
					<pkp-button v-if="initialValue && !isInitialValue" @click="revert">
						{{ restoreLabel }}
					</pkp-button>
					<multilingual-progress
						v-if="isMultilingual && locales.length > 1"
						:id="multilingualProgressId"
						:count="multilingualFieldsCompleted"
						:total="locales.length"
					/>
				</div>
			</div>
			<field-error
				v-if="currentValue && errors && errors.length"
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
					v-if="errors && errors.length"
					:id="describedByErrorId"
					:messages="errors"
				/>
				<div class="pkpFormField--upload__uploadActions">
					<!-- keyboard-accessible file upload -->
					<pkp-button
						class="pkpFormField--upload__addFile"
						:disabled="!!uploadFile"
						:id="dropzoneClickableId"
					>
						{{ uploadFileLabel }}
					</pkp-button>
					<pkp-button
						v-if="initialValue && !isInitialValue"
						class="pkpFormField--upload__restore"
						@click="revert"
					>
						{{ restoreLabel }}
					</pkp-button>
					<multilingual-progress
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
import FieldUpload from './FieldUpload.vue';

export default {
	name: 'FieldUploadImage',
	extends: FieldUpload,
	props: {
		altTextDescription: String,
		altTextLabel: String,
		baseUrl: String,
		thumbnailDescription: String
	},
	data() {
		return {
			altTextValue: '',
			initialValue: null
		};
	},
	computed: {
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
			this.$emit(
				'change',
				this.name,
				'value',
				{
					temporaryFileId: response.id,
					altText: ''
				},
				this.localeKey
			);
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
			this.$emit(
				'change',
				this.name,
				'value',
				{
					...this.currentValue,
					altText: newVal
				},
				this.localeKey
			);
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
	margin-bottom: 1rem;
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
	padding-left: 1rem;
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
		margin: 1rem -1rem -1rem;
		padding: 1rem;
		border-top: @bg-border;
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
			width: 3rem;
			margin: 1rem 1rem 1rem 0;
			border-radius: 2px;
		}

		.dz-details {
			margin-right: 4rem;
		}

		.dz-remove {
			right: 5rem;
		}
	}
}
</style>
