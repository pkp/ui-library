<script>
import FieldRichTextarea from './FieldRichTextarea.vue';

export default {
	name: 'FieldRichText',
	extends: FieldRichTextarea,
	props: {
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
						// Disbale new line by preventing enter key
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
};
</script>

<style lang="less">
.pkpFormField--richTextarea
	.pkpFormField--richTextArea__control--oneline
	.tox-edit-area {
	margin-top: -5px !important;
}

.pkpFormField--richTextarea .pkpFormField--richTextArea__control--oneline {
	.pkpFormField--richTextarea__input,
	.tox-tinymce {
		height: 5em !important;
	}
}

.pkpFormField--richTextarea.-isFocused
	.pkpFormField--richTextArea__control--oneline {
	.pkpFormField--richTextarea__input,
	.tox-tinymce {
		height: 10em !important;
	}
}

.pkpFormField--richTextarea
	.pkpFormField--richTextArea__control--oneline
	.tox-editor-header {
	display: none;
}

.pkpFormField--richTextarea.-isFocused
	.pkpFormField--richTextArea__control--oneline
	.tox-editor-header {
	display: block;
}
</style>
