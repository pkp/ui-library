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

			// This will not have any impact on TinyMCE 6.0+ ,
			// More details at https://github.com/tinymce/tinymce/discussions/7342
			init.forced_root_block = '';

			init.setup = (editor) => {
				// Disbale new line by preventing enter key
				editor.on('keyDown', (event) => {
					if (parseInt(event.keyCode) === 13) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
				});

				// Disbale any text paste form outside
				editor.on('paste', (event) => {
					event.preventDefault();
					event.stopPropagation();
					return;
				});
			};

			return init;
		},
	},
};
</script>

<style lang="less">
.pkpFormField--richTextarea
	.pkpFormField--richTextArea__control--oneline
	.tox-edit-area {
	margin-top: -10px !important;
}

.pkpFormField--richTextarea .pkpFormField--richTextArea__control--oneline {
	.pkpFormField--richTextarea__input,
	.tox-tinymce {
		height: 4em !important;
	}
}
.pkpFormField--richTextarea.-isFocused
	.pkpFormField--richTextArea__control--oneline {
	.pkpFormField--richTextarea__input,
	.tox-tinymce {
		height: 8em !important;
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
