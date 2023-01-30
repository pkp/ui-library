<template>
	<div
		class="pkpFormField pkpFormField--richTextarea"
		:class="{'-isFocused': isFocused, 'pkpFormField--richTextarea--rtl': isRTL}"
	>
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="__('common.required')"
				:multilingualLabel="multilingualLabel"
			/>
			<tooltip
				v-if="isPrimaryLocale && tooltip"
				aria-hidden="true"
				:tooltip="tooltip"
				label=""
			/>
			<span
				v-if="isPrimaryLocale && tooltip"
				class="-screenReader"
				:id="describedByTooltipId"
				v-html="tooltip"
			/>
			<help-button
				v-if="isPrimaryLocale && helpTopic"
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
			class="pkpFormField__control pkpFormField--richTextarea__control"
			:class="'pkpFormField--richTextArea__control--' + this.size"
		>
			<editor
				class="pkpFormField__input pkpFormField--richTextarea__input"
				v-model="currentValue"
				ref="editor"
				:id="controlId"
				:toolbar="toolbar"
				:init="compiledInit"
				@onFocus="focus"
				@onBlur="blur"
			/>
			<div
				v-if="(isMultilingual && locales.length > 1) || wordLimit"
				class="pkpFormField--richTextarea__controlFooter"
			>
				<multilingual-progress
					v-if="isMultilingual && locales.length > 1"
					:id="multilingualProgressId"
					:count="multilingualFieldsCompleted"
					:total="locales.length"
				/>
				<div v-if="wordLimit" class="pkpFormField--richTextarea__wordLimit">
					<icon
						v-if="wordCount > wordLimit"
						icon="exclamation-triangle"
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
		<field-error
			v-if="errors && errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
	</div>
</template>

<script>
// Tinymce must be loaded before Vue
import 'tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/code';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/paste';
import Editor from '@tinymce/tinymce-vue';
import FieldBase from './FieldBase.vue';
import debounce from 'debounce';

export default {
	name: 'FieldRichText',
	extends: FieldBase,
	components: {
		Editor,
	},
	props: {
		// @see https://www.tiny.cloud/docs/configure/integration-and-setup/
		init: {
			type: Object,
			default() {
				return {};
			},
		},
		// @see https://www.tiny.cloud/docs/configure/integration-and-setup/#plugins
		plugins: {
			type: String,
			required: false,
		},
		size: {
			type: String,
			default() {
				return 'default';
			},
			validator(value) {
				return ['default', 'large'].includes(value);
			},
		},
		// @see https://www.tinymce.com/docs/configure/editor-appearance/#toolbar
		toolbar: {
			type: String,
			required: true,
		},
		wordCountLabel: {
			type: String,
			default() {
				return '';
			},
		},
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
			tinymceInstance: null,
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
			return {
				skin_url: this.$root.tinyMCE.skinUrl,
				content_css: $.pkp.app.tinyMceContentCSS,
				remove_script_host: false,
				convert_urls: true,
				directionality: this.isRTL ? 'rtl' : 'ltr',
				menubar: false,
				statusbar: false,
				entity_encoding: 'raw',
				browser_spellcheck: true,
				forced_root_block: '',
				height: 200,
				paste_preprocess: (plugin, args) => {
					args.stopImmediatePropagation();
					args.stopPropagation();
					args.preventDefault();
				},
				init_instance_callback: (editor) => {
					// The inline toolbar only appears after the field has been focused.
					// This mimics the focus event, without actually changing the user's
					// focus.
					editor.fire('focus');
					editor.fire('blur');
					this.tinymceInstance = editor;
				},
				setup: (editor) => {
					editor.on('keyDown', (event) => {
						if (parseInt(event.keyCode) === 13) {
							event.preventDefault();
							event.stopPropagation();
							return;
						}
					});
				},
				...this.init,
			};
		},
		/**
		 * Is this field for language in a RTL language?
		 */
		isRTL() {
			return $.pkp.app.rtlLocales.includes(this.localeKey);
		},
	},
	methods: {
		handleToolbar() {
			if (this.tinymceInstance) {
				$(this.tinymceInstance.container)
					.find('div.tox-editor-container div.tox-editor-header')
					.first()
					.css({display: this.isFocused ? '' : 'none'});
			}
		},
		/**
		 * When the input control loses focus
		 */
		blur(event) {
			this.isFocused = false;
			this.handleToolbar();
		},

		/**
		 * When the input control gets focus
		 */
		focus(event) {
			this.isFocused = true;
			this.handleToolbar();
		},

		/**
		 * Update the word count based on the current value
		 */
		setWordCount() {
			if (!this.wordLimit || !this.currentValue || !this.$refs.editor) {
				this.wordCount = 0;
				return;
			}
			const words = this.$refs.editor.editor
				.getContent({format: 'text'})
				.match(/\S+/g);
			if (words !== null) {
				this.wordCount = words.length;
				return;
			}
			this.wordCount = 0;
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
