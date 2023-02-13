<script>
import FieldRichTextarea from './FieldRichTextarea.vue';

export default {
	name: 'FieldRichText',
	extends: FieldRichTextarea,
	props: {
		i18nFormattingLabel: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			default() {
				return 'oneline';
			},
			validator(value) {
				return ['default', 'large', 'oneline'].includes(value);
			},
		},
	},
	computed: {
		/**
		 * TinyMce init properties
		 *
		 * @see https://www.tinymce.com/docs/configure/
		 * @return {Object}
		 */
		compiledInit() {
			let init = FieldRichTextarea.computed.compiledInit.apply(this);
			delete init.url_converter_callback;

			return {
				...init,
				...{
					// This will not have any impact on TinyMCE 6.0+ ,
					// @see https://github.com/tinymce/tinymce/discussions/7342
					forced_root_block: '',

					toolbar_groups: {
						formatgroup: {
							icon: 'text-color',
							tooltip: this.i18nFormattingLabel,
							items: 'bold italic underline superscript subscript',
						},
					},

					content_css: $.pkp.app.tinyMceOneLineContentCSS,

					// @see 6.0+ : https://www.tiny.cloud/docs/tinymce/6/content-formatting/
					// @see 5.0+ : https://www.tiny.cloud/docs/configure/content-formatting/#formats
					formats: {
						bold: [{inline: 'b', remove: 'all', exact: true}],
						italic: [{inline: 'i', remove: 'all', exact: true}],
						underline: [{inline: 'u', remove: 'all', exact: true}],
						subscript: [{inline: 'sub', remove: 'all', exact: true}],
						superscript: [{inline: 'sup', remove: 'all', exact: true}],
					},
					extended_valid_elements: 'b,i',
					invalid_elements: 'em strong',

					// Allow pasting while stripping all styles, tags, new lines and getting only text content
					// More details at https://www.tiny.cloud/docs/tinymce/6/copy-and-paste/
					paste_preprocess: (editor, args) => {
						args.content = $('<div>' + args.content + '</div>').text();
					},

					setup: (editor) => {
						// Disable new line by preventing enter key
						editor.on('keyDown', (event) => {
							if (parseInt(event.keyCode) === 13) {
								event.preventDefault();
								event.stopPropagation();
								return;
							}
						});
					},
				},
			};
		},
	},
	methods: {
		/**
		 * When TinyMCE emits the blur event
		 */
		blur() {
			FieldRichTextarea.methods.blur.apply(this);
			this.closeToolbar();
		},

		/**
		 * Close the popup toolbar
		 *
		 * The popup toolbar will remain open after the user moves focus away
		 * from the input field. This seems to be a bug with our implementation.
		 * I could not reproduce it in TinyMCE's official codepen examples, with
		 * the same version of TinyMCE we're using at the time of writing this
		 * (v5.10.7).
		 *
		 * This is a workaround that closes the popup toolbar when the TinyMCE
		 * editor fires the `blur` event. This works, but the `blur` event does
		 * not cover every case. It is possible to open the popup toolbar without
		 * moving focus into the editor. In such cases, the `blur` event is not
		 * fired.
		 *
		 * To prevent such cases, we have hidden the popup toolbar button when
		 * the field does not have focus. That way, it can not be opened unless
		 * the field is in a focus state so that the blur event will be fired.
		 *
		 * See the CSS comment below for the related CSS code.
		 */
		closeToolbar() {
			const toolbarButton = this.$el.querySelector('.tox-tbtn[aria-owns]');
			if (toolbarButton) {
				const toolbarPopup = document.getElementById(
					toolbarButton.getAttribute('aria-owns')
				);
				if (toolbarPopup) {
					const focusEl = document.activeElement;
					toolbarButton.click();
					if (focusEl) {
						focusEl.focus();
					}
				}
			}
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--richTextArea__control--oneline {
	display: flex;
	height: 2.5rem;

	.tox-tinymce {
		height: calc(
			2.5rem - 2px
		) !important; // Don't cover bottom border of field control
	}

	.tox .tox-editor-container {
		flex-direction: row-reverse;
	}

	.tox .tox-edit-area {
		margin-inline-start: 1rem;
	}

	.tox-editor-header {
		border-inline-start: @bg-border;
		margin-inline-start: 0.5rem;
	}

	.tox .tox-toolbar__primary {
		border-bottom: none;
	}

	.pkpFormField--richTextarea__controlFooter {
		order: -1; // Move to before the input
		width: 2.5rem;
		padding: 0.5rem;
		border-top: none;
		border-inline-end: @bg-border;
	}
}

/**
 * Hide the toolbar popup button when the field
 * is not focused. See the comment at closeToolbar().
 */
.tox-editor-header {
	display: none;
}

.pkpFormField--richTextarea.-isFocused
	.pkpFormField--richTextArea__control--oneline
	.tox-editor-header {
	display: flex;
}
</style>
