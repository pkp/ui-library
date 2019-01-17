<template>
	<div class="pkpFormField pkpFormField--richTextarea" :class="{'-isFocused': isFocused}">
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
		<div class="pkpFormField__control pkpFormField--richTextarea__control" :class="'pkpFormField--richTextArea__control--' + this.size">
			<div class="pkpFormField--richTextarea__toolbar" :id="toolbarId"></div>
			<editor
				class="pkpFormField__input pkpFormField--richTextarea__input"
				v-model="currentValue"
				:id="controlId"
				:toolbar="toolbar"
				:plugins="plugins"
				:init="compiledInit"
				@onFocus="focus"
				@onBlur="blur"
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
		Editor
	},
	props: {
		size: {
			type: String,
			default: 'default'
		},
		// @see https://www.tinymce.com/docs/configure/editor-appearance/#toolbar
		toolbar: {
			type: String,
			default: function() {
				return 'bold italic superscript subscript | link';
			}
		},
		// @see https://www.tiny.cloud/docs/configure/integration-and-setup/#plugins
		plugins: {
			type: String,
			default: function() {
				return 'paste,link';
			}
		},
		// @see https://www.tiny.cloud/docs/configure/integration-and-setup/
		init: {
			type: Object,
			default: function() {
				return {
					menubar: false,
					statusbar: false,
					entity_encoding: 'raw'
				};
			}
		}
	},
	data: function() {
		return {
			isFocused: false
		};
	},
	computed: {
		/**
		 * ID attribute for the element where the toolbar should be placed
		 *
		 * @return string
		 */
		toolbarId: function() {
			return this.compileId('toolbar');
		},

		/**
		 * TinyMce init properties
		 *
		 * @see https://www.tinymce.com/docs/configure/
		 * @return Object
		 */
		compiledInit: function() {
			return {
				inline: true,
				fixed_toolbar_container: '#' + this.toolbarId,
				init_instance_callback: editor => {
					// The inline toolbar only appears after the field has been focused.
					// This mimics the focus event, without actually changing the user's
					// focus.
					editor.fire('focus');
					editor.fire('blur');
				},
				...this.init
			};
		}
	},
	methods: {
		/**
		 * When the input control gets focus
		 */
		focus: function() {
			this.isFocused = true;
		},

		/**
		 * When the input control loses focus
		 */
		blur: function() {
			this.isFocused = false;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--richTextarea__toolbar {
	border-bottom: @bg-border;
	min-height: 39px;

	.mce-tinymce {
		// Tinymce hides the toolbar when focus is not in the field but we want it
		// to remain visible at all times.
		display: block !important;
	}
}

.pkpFormField--richTextarea__control {
	border: @bg-border;
	border-radius: @radius;

	&:hover {
		border-color: @shade;
	}
}

.pkpFormField--richTextarea.-isFocused .pkpFormField--richTextarea__control {
	border-color: @primary;
	box-shadow: -3px 0 0 @primary;
}

.pkpFormField--richTextarea__input {
	padding: @base;
	width: 100%;
	height: 14em;
	font-size: @font-sml;
	line-height: @line-sml;
	border: none;
	overflow-y: scroll;

	&:focus {
		box-shadow: none;
	}

	p:first-child {
		margin-top: 0;
	}

	span.pkpTag {
		padding: 0.5em;
		font-size: 10px;
		font-weight: @bold;
		text-transform: uppercase;
		color: @text-light;
	}
}

.pkpFormField--richTextArea__control--large .pkpFormField--richTextarea__input {
	height: 35em;
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
	.mce-tinymce {
		border: none;
	}

	// Fixes issue where the toolbar is not visible in tinymce controls under
	// secondary languages, and overrides the toolbar size settings to allow it
	// to expand/shrink responsively.
	.mce-tinymce,
	.mce-container-body,
	.mce-container {
		width: auto !important;
		height: auto !important;
	}
	.mce-abs-layout-item {
		position: static !important;
	}

	.mce-content-body {
		line-height: @line-sml;
	}

	.mce-edit-focus {
		outline: none;
	}

	.mce-toolbar .mce-btn-group {
		padding: 0.25rem;
	}

	.mce-btn-group:not(:first-child) {
		border-left-color: @bg-border-color;
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
	}
}
</style>
