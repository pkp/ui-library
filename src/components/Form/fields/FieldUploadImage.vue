<template>
	<div class="pkpFormField pkpFormField--upload pkpFormField--uploadImage">
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
				<img
					v-if="thumbnail"
					class="pkpFormField--uploadImage__thumbnail"
					:alt="thumbnailDescription"
					:src="thumbnail"
				/>
				<div class="pkpFormField--upload__details">
					<label class="pkpFormFieldLabel" :for="altTextId">
						{{ altTextLabel }}
					</label>
					<input
						:id="altTextId"
						v-model="altTextValue"
						class="pkpFormField__input pkpFormField--uploadImage__altTextInput"
						type="text"
						:aria-describedby="altTextDescriptionId"
					/>
					<div
						:id="altTextDescriptionId"
						v-strip-unsafe-html="altTextDescription"
						class="pkpFormField--uploadImage__altTextDescription"
					/>
				</div>
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
			<!-- Keep the dropzone elements in the dom so they can be manipulated in mounted hook -->
			<div :class="{'-screenReader': currentValue}">
				<VueDropzone
					v-if="isComponentMounted"
					:id="dropzoneId"
					ref="dropzone"
					:options="dropzoneOptions"
					@vdropzone-file-added="onAddFile"
					@vdropzone-thumbnail="onThumbnail"
					@vdropzone-success="success"
					@vdropzone-error="error"
					@vdropzone-removed-file="onRemoveFile"
				/>
				<FieldError
					v-if="errors && errors.length"
					:id="describedByErrorId"
					:messages="errors"
				/>
				<div class="pkpFormField--upload__uploadActions">
					<!-- keyboard-accessible file upload -->
					<PkpButton
						:id="dropzoneClickableId"
						class="pkpFormField--upload__addFile"
						:disabled="!!uploadFile"
					>
						{{ uploadFileLabel }}
					</PkpButton>
					<PkpButton
						v-if="initialValue && !isInitialValue"
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
import FieldUpload from './FieldUpload.vue';
import PkpButton from '@/components/Button/Button.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import FieldError from '@/components/Form/FieldError.vue';
import VueDropzone from 'dropzone-vue3';

export default {
	name: 'FieldUploadImage',
	components: {
		PkpButton,
		Tooltip,
		HelpButton,
		FormFieldLabel,
		MultilingualProgress,
		FieldError,
		VueDropzone,
	},
	extends: FieldUpload,
	props: {
		altTextDescription: String,
		altTextLabel: String,
		/** The `baseUrl` is prepended to the filename to display previews. For example, the `baseURL` for the logo of a journal with an ID of `2` would be `http://yoursite.com/public/journals/2/` */
		baseUrl: String,
		thumbnailDescription: String,
	},
	data() {
		return {
			altTextValue: '',
			initialValue: null,
			isReady: false,
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
				const dateUploaded = new Date(this.currentValue.dateUploaded);
				return (
					this.baseUrl +
					'/' +
					this.currentValue.uploadName +
					'?' +
					dateUploaded.getTime()
				);
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
		},
	},
	watch: {
		/**
		 * Whenever the current value changes, update the altTextValue to keep
		 * the field in sync with external changes
		 */
		currentValue: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.altTextValue = newVal && newVal.altText ? newVal.altText : '';
		},

		/**
		 * Whenever the alt text field changes, sync the change to the correct
		 * property in the value object
		 */
		altTextValue: function (newVal, oldVal) {
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
					altText: newVal,
				},
				this.localeKey,
			);
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
			this.altTextValue = this.currentValue ? this.currentValue.altText : '';
		});
	},
	methods: {
		/**
		 * Respond to dropzone.js event when a file is successfully uploaded
		 *
		 * @param {Object} file Details about the file
		 * @param {Object} response The server response
		 * @see https://www.dropzonejs.com/#event-success
		 */
		success: function (file, response) {
			this.isUploading = false;
			this.$emit(
				'change',
				this.name,
				'value',
				{
					temporaryFileId: response.id,
					altText: '',
				},
				this.localeKey,
			);
			this.setFocusToControl();
		},

		/**
		 * Respond to a dropzone.js event when it creates a thumbnail
		 *
		 * @param {Object} file Details about the file
		 * @see https://www.dropzonejs.com/#event-thumbnail
		 */
		onThumbnail: function (file) {
			this.uploadFile = {...file};
			this.setFocusToControl();
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--uploadImage__thumbnail {
	display: block;
	width: 3rem;
	height: auto;
	align-self: flex-start;
}

.pkpFormField--uploadImage__altTextInput {
	width: 100%;
}

.pkpFormField--uploadImage__altTextDescription {
	color: @text-light;
}

// Stack image preview and alt text columns when showing multiple locales
.pkpForm--hasManyVisibleLocales {
	.pkpFormField--upload__preview {
		display: block;
	}
}

.pkpFormField--uploadImage {
	// Dropzone.js preview with thumbnail
	.dz-image-preview {
		.dz-image {
			display: block;
			width: 3rem;
		}
	}
}
</style>
