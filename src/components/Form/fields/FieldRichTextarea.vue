<template>
	<div
		class="pkpFormField pkpFormField--richTextarea"
		:class="{'-isFocused': isFocused, 'pkpFormField--richTextarea--rtl': isRTL}"
	>
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:control-id="controlId"
				:label="label"
				:locale-label="localeLabel"
				:is-required="isRequired"
				:required-label="t('common.required')"
				:multilingual-label="multilingualLabel"
				class="align-middle"
			/>
			<Tooltip
				v-if="isPrimaryLocale && tooltip"
				aria-hidden="true"
				:tooltip="tooltip"
				label=""
			/>
			<span
				v-if="isPrimaryLocale && tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
			<HelpButton
				v-if="isPrimaryLocale && helpTopic"
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
			class="pkpFormField__control pkpFormField--richTextarea__control"
			:class="'pkpFormField--richTextArea__control--' + size"
		>
			<Editor
				:id="controlId"
				ref="editor"
				v-model="currentValue"
				class="pkpFormField__input pkpFormField--richTextarea__input"
				license-key="gpl"
				:toolbar="toolbar"
				:plugins="plugins"
				:init="compiledInit"
				@focus="focus"
				@blur="blur"
			/>
			<div
				v-if="(isMultilingual && locales.length > 1) || wordLimit"
				class="pkpFormField--richTextarea__controlFooter"
			>
				<MultilingualProgress
					v-if="isMultilingual && locales.length > 1"
					:id="multilingualProgressId"
					:count="multilingualFieldsCompleted"
					:total="locales.length"
				/>
				<div v-if="wordLimit" class="pkpFormField--richTextarea__wordLimit">
					<Icon
						v-if="wordCount > wordLimit"
						icon="Error"
						class="h-4 w-4"
						:inline="true"
					/>
					{{
						replaceLocaleParams(wordCountLabel, {
							count: wordCount,
							limit: wordLimit,
						})
					}}
				</div>
			</div>
			<slot name="footer" />
		</div>
		<FieldError
			v-if="errors && errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
	</div>
</template>

<script>
// Tinymce must be loaded before Vue
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/models/dom';
import Editor from '@tinymce/tinymce-vue';
import FieldBase from './FieldBase.vue';
import debounce from 'debounce';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import Icon from '@/components/Icon/Icon.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldRichTextarea',
	components: {
		Editor,
		FormFieldLabel,
		Icon,
		Tooltip,
		MultilingualProgress,
		HelpButton,
		FieldError,
	},
	extends: FieldBase,
	props: {
		/** Provide config properties for TinyMCE's `init` method. Any props you pass will be merged with defaults and can override them. See [TinyMCE documentation](https://www.tiny.cloud/docs/configure/integration-and-setup/). */
		init: {
			type: Object,
			default() {
				return {};
			},
		},
		/**  Specify plugins the TinyMCE editor should load. See [TinyMCE documentation](https://www.tiny.cloud/docs/configure/integration-and-setup/#plugins). */
		plugins: {
			type: Array,
			required: true,
		},
		/** One of `default` or `large`. */
		size: {
			type: String,
			default() {
				return 'default';
			},
			validator(value) {
				return ['default', 'large'].includes(value);
			},
		},
		/** Provide the TinyMCE editor with a custom toolbar. See [TinyMCE documentation](https://www.tinymce.com/docs/configure/editor-appearance/#toolbar). */
		toolbar: {
			type: String,
			required: true,
		},
		/** Optionally provide a URL where images and other files can be uploaded. You still need to add the appropriate buttons and plugins to the `toolbar` and `plugins` props. The most common use is the [image](https://www.tiny.cloud/docs/plugins/image/) plugin. */
		uploadUrl: {
			type: String,
			default() {
				return '';
			},
		},
		wordCountLabel: {
			type: String,
			default() {
				return '';
			},
		},
		/** Optionally provide a word limit and the editor will display the word count as they type. */
		wordLimit: {
			type: Number,
			default() {
				return 0;
			},
		},
	},
	data() {
		return {
			isFocused: false,
			wordCount: 0,
		};
	},
	computed: {
		/** @see FieldBase.computed.currentValue */
		currentValue: {
			get() {
				return this.isMultilingual ? this.value[this.localeKey] : this.value;
			},
			set: function (newVal) {
				this.$emit('change', this.name, 'value', newVal, this.localeKey);
				debounce(this.setWordCount, 250)();
			},
		},
		/**
		 * ID attribute for the element where the toolbar should be placed
		 *
		 * @return {String}
		 */
		toolbarId() {
			return this.compileId('toolbar');
		},

		/**
		 * TinyMce init properties
		 *
		 * @see https://www.tinymce.com/docs/configure/
		 * @return {Object}
		 */
		compiledInit() {
			var self = this;
			var urlConverterCallback = function (url) {
				// removes script_host from smarty variables
				const smartyVariable = /\{\$(\w*)\}/.exec(url);
				if (smartyVariable) {
					url = smartyVariable[0];
				}
				return url;
			};
			return {
				license_key: 'gpl',
				skin_url: this.$root?.tinyMCE?.skinUrl || pkp?.tinyMCE?.skinUrl,
				content_css: $.pkp.app.tinyMceContentCSS,
				paste_data_images: true,
				relative_urls: false,
				remove_script_host: false,
				convert_urls: true,
				urlconverter_callback: urlConverterCallback,
				directionality: this.isRTL ? 'rtl' : 'ltr',
				menubar: false,
				statusbar: false,
				entity_encoding: 'raw',
				browser_spellcheck: true,
				language:
					$.pkp?.plugins?.generic?.tinymceplugin?.tinymceParams?.language,
				language_url:
					$.pkp?.plugins?.generic?.tinymceplugin?.tinymceParams?.language_url,
				// See: https://www.tiny.cloud/docs/general-configuration-guide/upload-images/#rollingyourimagehandler
				images_upload_handler(blobInfo, progress) {
					return new Promise((resolve, reject) => {
						const data = new FormData();
						data.append('file', blobInfo.blob(), blobInfo.filename());
						return $.ajax({
							method: 'POST',
							url: self.uploadUrl,
							data: data,
							processData: false,
							contentType: false,
							headers: {
								'X-Csrf-Token': pkp.currentUser.csrfToken,
							},
							success(r) {
								resolve(r.url);
							},
							error(r) {
								reject(r.responseJSON.error);
							},
						});
					});
				},
				init_instance_callback: (editor) => {
					// The inline toolbar only appears after the field has been focused.
					// This mimics the focus event, without actually changing the user's
					// focus.
					editor.fire('focus');
					editor.fire('blur');
				},
				...this.init,
			};
		},
		/**
		 * Is this field for language in a RTL language?
		 */
		isRTL() {
			const direction = document.body.getAttribute('dir');
			return direction === 'rtl';
		},
	},
	watch: {
		value(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (this.isMultilingual) {
				newVal = newVal[this.localeKey];
			}
			debounce(this.setWordCount, 250)();
			this.$emit('change', this.name, 'value', newVal, this.localeKey);
		},
	},
	mounted() {
		debounce(this.setWordCount, 1000)();
	},
	methods: {
		/**
		 * When the input control loses focus
		 */
		blur() {
			this.isFocused = false;
		},

		/**
		 * When the input control gets focus
		 */
		focus() {
			this.isFocused = true;
		},

		/**
		 * Update the word count based on the current value
		 */
		setWordCount() {
			if (!this.wordLimit || !this.currentValue || !this.$refs.editor) {
				this.wordCount = 0;
				return;
			}
			const words = this.$refs.editor
				.getEditor()
				.getContent({format: 'text'})
				.match(/\S+/g);
			if (words !== null) {
				this.wordCount = words.length;
				return;
			}
			this.wordCount = 0;
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--richTextarea__control {
	border: @bg-border;
	border-radius: @radius;

	&:hover {
		border-color: @shade;
	}
}

.pkpFormField--richTextarea.-isFocused .pkpFormField--richTextarea__control {
	border-color: @primary;

	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 3px;
		background: @primary;
		z-index: 1;
	}
}

.pkpFormField--richTextarea__controlFooter {
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	border-top: @bg-border;
	font-size: @font-tiny;
	line-height: @line-sml;
}

.pkpFormField--richTextarea__wordLimit {
	margin-left: auto;
}

// Override tinymce styles
.pkpFormField--richTextarea__control {
	.pkpFormField--richTextarea__input,
	.tox-tinymce {
		border: none;
		width: 100%;
		height: 15em !important;
	}

	.tox .tox-toolbar,
	.tox .tox-toolbar__overflow,
	.tox .tox-toolbar__primary {
		background: @lift;
		border-bottom: @bg-border;
	}

	.tox-tbtn:not(:first-child) {
		margin-left: 0.25rem;
	}

	.tox-tbtn__select-label {
		color: @primary;
		text-decoration: underline;
	}
}

.pkpFormField--richTextArea__control--large {
	.pkpFormField--richTextarea__input,
	.tox-tinymce {
		height: 35em !important;
	}
}

// Align the TinyMCE toolbar correctly when it is used for a
// RTL language. The `directionality` config property is passed
// to TinyMCE, but it doesn't seem to effect the toolbar.
.pkpFormField--richTextarea--rtl {
	// Override TinyMCE style
	.tox.tox.tox {
		direction: rtl;
	}
}
</style>
