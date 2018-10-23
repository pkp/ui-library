<template>
	<div class="pkpFormField pkpFormField--richTextarea">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="i18n.required"
				:multilingualLabel="multilingualLabel"
			/>
			<tooltip v-if="isPrimaryLocale && tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span v-if="isPrimaryLocale && tooltip" class="-screenReader" :id="describedByTooltipId" v-html="tooltip" />
			<help-button v-if="isPrimaryLocale && helpTopic" :id="describedByHelpId" :topic="helpTopic" :section="helpSection" :label="i18n.help" />
		</div>
		<div v-if="isPrimaryLocale && description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div class="pkpFormField__control pkpFormField--richTextarea__control">
			<editor
				class="pkpFormField__input pkpFormField--richTextarea__input"
				v-model="currentValue"
				:id="controlId"
				:toolbar="compiledToolbar"
				:plugins="plugins"
				:init="compiledInit"
			/>
			<multilingual-progress v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
				:i18n="i18n"
			/>
		</div>
		<field-error v-if="errors.length" :id="describedByErrorId" :messages="errors" />
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Editor from '@tinymce/tinymce-vue';

export default {
	name: 'FieldRichTextarea',
	extends: FieldBase,
	components: {
		Editor,
	},
	props: {
		size: {
			type: String,
			default: 'default',
		},
		toolbar: {
			type: String,
			default: 'default',
		},
		plugins: {
			type: String,
			default: 'paste,link',
		},
		init: {
			type: Object,
			default: function () {
				return {
					menubar: false,
					statusbar: false,
					entity_encoding: 'raw',
				};
			},
		},
	},
	computed: {
		/**
		 * TinyMce toolbar
		 *
		 * @see https://www.tinymce.com/docs/configure/editor-appearance/#toolbar
		 */
		compiledToolbar: function () {
			return 'bold italic superscript subscript | link';
		},

		/**
		 * TinyMce init properties
		 *
		 * @see https://www.tinymce.com/docs/configure/
		 * @return Object
		 */
		compiledInit: function () {
			let contentCSS = $.pkp.app.tinyMceContentCSS;
			if ($.pkp.app.cdnEnabled) {
				contentCSS = contentCSS + ', ' + $.pkp.app.tinyMceContentFont;
			}
			return {
				height: this.size === 'large' ? 500 : 200,
				content_css: contentCSS,
				...this.init,
			};
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--richTextarea__input {
	width: 100%;
}

.pkpFormField--richTextarea__control {
	border: @bg-border;
	border-radius: @radius;
}

.pkpFormField--richTextarea .multilingualProgress {
	padding: @half @base;
	display: block;
	border-top: @bg-border;
}

// Override tinymce styles
// We temporarily wrap these styles in .pkpFormField--richTextarea__input until
// we have transitioned all of the old tinymce fields out of the system
.pkpFormField--richTextarea__control {

	.mce-panel {
		border: none;
		background: @lift;
	}

	.mce-tinymce {
		box-shadow: none;
		border: none;
	}

	// this block overrides old tinymce styles
	.mce-toolbar-grp {
		border-bottom: @bg-border;
		padding: 0;
	}

	.mce-top-part:before {
		border-bottom: @bg-border;
		box-shadow: none;
	}

	.mce-toolbar .mce-btn-group {
		padding: 0.25rem;
	}

	.mce-btn-group .mce-btn + .mce-btn {
		margin-left: 0.25rem;
	}

	.mce-btn {
		background: transparent;
		border-radius: @radius;
	}

	.mce-btn:hover,
	.mce-btn:active {
		background: transparent;
		border-color: @primary;
	}

	.mce-btn.mce-active,
	.mce-btn.mce-active:hover,
	.mce-btn.mce-active:focus,
	.mce-btn.mce-active:active {
		background-color: @primary;

		// these styles and the .mce-ico block below override old tinymce styles
		border-radius: @radius;
		border-color: @primary;

		.mce-ico {
			color: #fff;
		}
	}
}
</style>
