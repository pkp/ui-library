<template>
	<div
		class="pkpFormField pkpFormField--richTextarea"
		:class="{'-isFocused': isFocused}"
	>
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="i18n.required"
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
			class="pkpFormField__control pkpFormField--richTextarea__control"
			:class="'pkpFormField--richTextArea__control--' + this.size"
		>
			<div class="pkpFormField--richTextarea__toolbar" :id="toolbarId"></div>
			<editor
				class="pkpFormField__input pkpFormField--richTextarea__input"
				v-model="editorValue"
				ref="editor"
				:id="controlId"
				:toolbar="toolbar"
				:plugins="plugins"
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
					:i18n="i18n"
				/>
				<div v-if="wordLimit" class="pkpFormField--richTextarea__wordLimit">
					<icon
						v-if="wordCount > wordLimit"
						icon="exclamation-triangle"
						:inline="true"
					/>
					{{ __('wordCount', {count: wordCount, limit: wordLimit}) }}
				</div>
			</div>
		</div>
		<field-error
			v-if="errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Editor from '@tinymce/tinymce-vue';
import Icon from '@/components/Icon/Icon.vue';
import debounce from 'debounce';

export default {
	name: 'FieldRichTextarea',
	extends: FieldBase,
	components: {
		Editor,
		Icon
	},
	props: {
		// @see https://www.tiny.cloud/docs/configure/integration-and-setup/
		init: {
			type: Object,
			default() {
				return {
					menubar: false,
					statusbar: false,
					entity_encoding: 'raw'
				};
			}
		},
		// @see https://www.tiny.cloud/docs/configure/integration-and-setup/#plugins
		plugins: {
			type: String,
			required: true
		},
		preparedContent: {
			type: Object,
			default() {
				return {};
			}
		},
		renderPreparedContent: {
			type: Boolean,
			default() {
				return false;
			}
		},
		size: {
			type: String,
			default: 'default'
		},
		// @see https://www.tinymce.com/docs/configure/editor-appearance/#toolbar
		toolbar: {
			type: String,
			required: true
		},
		uploadUrl: {
			type: String,
			default() {
				return '';
			}
		},
		wordLimit: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			editorValue: '',
			isFocused: false,
			wordCount: 0
		};
	},
	computed: {
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
			return {
				inline: true,
				paste_data_images: true,
				relative_urls: false,
				remove_script_host: false,
				convert_urls: true,
				// See: https://www.tiny.cloud/docs/general-configuration-guide/upload-images/#rollingyourimagehandler
				images_upload_handler(blobInfo, success, failure) {
					const data = new FormData();
					data.append('file', blobInfo.blob(), blobInfo.filename());
					$.ajax({
						method: 'POST',
						url: self.uploadUrl,
						data: data,
						processData: false,
						contentType: false,
						headers: {
							'X-Csrf-Token': $.pkp.currentUser.csrfToken
						},
						success(r) {
							success(r.url);
						},
						error(r) {
							failure(r.responseJSON.errorMessage);
						}
					});
				},
				fixed_toolbar_container: '#' + this.toolbarId,
				init_instance_callback: editor => {
					// The inline toolbar only appears after the field has been focused.
					// This mimics the focus event, without actually changing the user's
					// focus.
					editor.fire('focus');
					editor.fire('blur');
				},
				setup(editor) {
					if (Object.keys(self.preparedContent).length) {
						editor.addButton('pkpPreparedContent', {
							icon: 'nonbreaking',
							type: 'panelbutton',
							panel: {
								html() {
									var markup =
										'<ul class="pkpFormField--richTextarea__tinymcePanel">';
									Object.keys(self.preparedContent).forEach(
										key =>
											(markup += `<li>
													<button data-symbolic="${key}">
														${self.preparedContent[key]}
													</button>
												</li>`)
									);
									return markup + '</ul>';
								},
								onclick(e) {
									if (e.target.tagName !== 'BUTTON') {
										return;
									}
									const key = e.target.dataset.symbolic;
									if (self.renderPreparedContent) {
										editor.insertContent(self.preparedContent[key]);
									} else {
										editor.insertContent(
											self.getPlaceholder(key, self.preparedContent[key])
										);
									}
									this.hide();
								}
							}
						});
						editor.settings.toolbar += ' | pkpPreparedContent';
					}
				},
				...this.init
			};
		}
	},
	methods: {
		/**
		 * When the input control loses focus
		 */
		blur() {
			this.isFocused = false;

			if (!this.renderPreparedContent) {
				const keys = Object.keys(this.preparedContent);

				// Find and replace any placeholders
				if (keys.length) {
					const value = document.createElement('div');
					value.innerHTML = this.editorValue;
					value.querySelectorAll('.pkpTag[data-symbolic]').forEach(node => {
						node.replaceWith('{$' + node.dataset.symbolic + '}');
					});
					this.currentValue = value.innerHTML;
				} else {
					this.currentValue = this.editorValue;
				}
			}
		},

		/**
		 * When the input control gets focus
		 */
		focus() {
			this.isFocused = true;
		},

		/**
		 * Get a placeholder for prepared content
		 *
		 * @param string key The property name
		 * @param string value The rendered content value
		 * @return string
		 */
		getPlaceholder(key, value) {
			return `<span class="pkpTag mceNonEditable" data-symbolic="${key}">${value}</span>`;
		},

		/**
		 * Set the editor value to the currentValue and
		 * process any prepared content
		 */
		setEditorValue() {
			this.editorValue = this.currentValue;

			const keys = Object.keys(this.preparedContent);
			if (keys.length) {
				let value = this.editorValue;
				// Replace {$tags} in the body text with their values
				if (this.renderPreparedContent) {
					keys.forEach(key => {
						value = value.replace(
							new RegExp('\\{\\$' + key + '\\}', 'g'),
							this.preparedContent[key]
						);
					});

					// Or replace {$tags} in the body text with placeholders
				} else {
					keys.forEach(key => {
						value = value.replace(
							new RegExp('\\{\\$' + key + '\\}', 'g'),
							this.getPlaceholder(key, this.preparedContent[key])
						);
					});
				}
				this.editorValue = value;
			}
		},

		/**
		 * Update the word count based on the current value
		 */
		setWordCount: debounce(function() {
			if (!this.wordLimit || !this.editorValue || !this.$refs.editor) {
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
		}, 250)
	},
	watch: {
		editorValue(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.setWordCount();
		},
		currentValue(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.setEditorValue();
		}
	},
	created() {
		this.setEditorValue();
	},
	mounted() {
		this.setWordCount();
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

		&[contentEditable='false'][data-mce-selected] {
			outline: 1px solid @primary;
			border-radius: 2px;
		}
	}
}

.pkpFormField--richTextArea__control--large .pkpFormField--richTextarea__input {
	height: 35em;
}

.pkpFormField--richTextarea__controlFooter {
	display: flex;
	align-items: center;
	padding: @half @base;
	border-top: @bg-border;
	font-size: @font-tiny;
	line-height: @line-sml;
}

.pkpFormField--richTextarea__wordLimit {
	margin-left: auto;
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

.mce-popover {
	.pkpFormField--richTextarea__tinymcePanel {
		margin: 0;
		padding: 0;
		list-style: none;

		li:not(:last-child) {
			border-bottom: @bg-border;
		}

		button {
			padding: 0.5em 0.75em 0.5em 0.5em;
			border-left: 0.25em solid transparent;
			font-size: @font-tiny;
			line-height: @line-tiny;

			&:hover,
			&:focus {
				border-left-color: @primary;
			}
		}
	}
}
</style>
