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
							limit: wordLimit
						})
					}}
				</div>
			</div>
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
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/paste';
import FieldBase from './FieldBase.vue';
import Editor from '@tinymce/tinymce-vue';
import debounce from 'debounce';

export default {
	name: 'FieldRichTextarea',
	extends: FieldBase,
	components: {
		Editor
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
		insertPreparedContentLabel: {
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
		skinUrl: {
			type: String,
			required: true
		},
		size: {
			type: String,
			default() {
				return 'default';
			},
			validator(value) {
				return ['default', 'large'].includes(value);
			}
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
		wordCountLabel: {
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
			var urlConverterCallback = function(url) {
				// removes script_host from smarty variables
				const smartyVariable = /\{\$(\w*)\}/.exec(url);
				if (smartyVariable) {
					url = smartyVariable[0];
				} else {
					this.settings.urlconverter_callback = false; // eslint-disable-line
					url = this.convertURL(url);
					this.settings.urlconverter_callback = urlConverterCallback; // eslint-disable-line
				}
				return url;
			};
			return {
				inline: true,
				skin_url: this.skinUrl,
				paste_data_images: true,
				relative_urls: false,
				remove_script_host: false,
				convert_urls: true,
				urlconverter_callback: urlConverterCallback,
				directionality: $.pkp.app.rtlLocales.includes(this.localeKey)
					? 'rtl'
					: null,
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
							'X-Csrf-Token': pkp.currentUser.csrfToken
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
					if (Object.keys(self.preparedContentSanitized).length) {
						var items = [];
						Object.keys(self.preparedContentSanitized).forEach(key =>
							items.push({
								type: 'menuitem',
								text: self.preparedContentSanitized[key],
								onAction() {
									if (self.renderPreparedContent) {
										editor.insertContent(self.preparedContentSanitized[key]);
									} else {
										editor.insertContent(
											self.getPlaceholder(
												key,
												self.preparedContentSanitized[key]
											)
										);
									}
								}
							})
						);
						editor.ui.registry.addMenuButton('pkpPreparedContent', {
							icon: 'non-breaking',
							tooltip: self.insertPreparedContentLabel,
							fetch(callback) {
								callback(items);
							}
						});
						editor.settings.toolbar += ' | pkpPreparedContent';
					}
				},
				...this.init
			};
		},

		/**
		 * The preparedContent property with the keys and values sanitized
		 * so that they can be injected into attributes and HTML strings
		 * without causing problems.
		 *
		 * Keys are restricted to alphanumeric (\w) and values have the
		 * < and > characters converted to their HTML entities.
		 *
		 * @return {Object}
		 */
		preparedContentSanitized() {
			if (!Object.keys(this.preparedContent).length) {
				return {};
			}
			let obj = {};
			Object.keys(this.preparedContent).forEach(key => {
				const newKey = key.replace(/[^\w]/gi, '');
				const map = {'<': '&lt;', '>': '&gt;'};
				const newValue = this.preparedContent[key].replace(
					/[<>]/g,
					m => map[m]
				);
				if (newKey && newValue) {
					obj[newKey] = newValue;
				}
			});
			return obj;
		}
	},
	methods: {
		/**
		 * When the input control loses focus
		 */
		blur() {
			this.isFocused = false;

			if (!this.renderPreparedContent) {
				const keys = Object.keys(this.preparedContentSanitized);

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

			const keys = Object.keys(this.preparedContentSanitized);
			if (keys.length) {
				let value = this.editorValue;
				// Replace {$tags} in the body text with their values
				if (this.renderPreparedContent) {
					keys.forEach(key => {
						value = value.replace(
							new RegExp('\\{\\$' + key + '\\}', 'g'),
							this.preparedContentSanitized[key]
						);
					});

					// Or replace {$tags} in the body text with placeholders
				} else {
					keys.forEach(key => {
						value = value.replace(
							new RegExp('\\{\\$' + key + '\\}', 'g'),
							this.getPlaceholder(key, this.preparedContentSanitized[key])
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
	padding: 1rem;
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
	padding: 0.5rem 1rem;
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
	// Ensure the toolbar is always visible
	.pkpFormField--richTextarea__toolbar .tox-tinymce-inline {
		display: block !important;
		visibility: visible !important;
	}

	.tox-tbtn:not(:first-child) {
		margin-left: 0.25rem;
	}

	// Remove focused outline from text input
	// Visual indicator already exists around whole component
	.pkpFormField--richTextarea__input {
		outline: none;
	}
}
</style>
