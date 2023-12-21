<template>
	<field-rich-textarea
		v-bind="textareaProps"
		ref="textarea"
		:init="compiledInit"
		:value="renderedValue"
		@change="fieldChanged"
	>
		<template #footer>
			<slot name="footer" />
			<modal
				:close-label="t('common.close')"
				:name="preparedContentId"
				:title="insertModalLabel"
				:open="isModalPreparedContentOpened"
				@close="isModalPreparedContentOpened = false"
			>
				<insert-content
					ref="insertContent"
					:insert-label="insertLabel"
					:items="preparedContent"
					:items-label="preparedContentLabel"
					:search-label="searchLabel"
					@insert="insert"
				/>
			</modal>
		</template>
	</field-rich-textarea>
</template>

<script>
import FieldRichTextarea from './FieldRichTextarea.vue';
import InsertContent from '@/components/InsertContent/InsertContent.vue';
import Modal from '@/components/Modal/Modal.vue';
import preparedContent from '../../../mixins/preparedContent';

export default {
	name: 'FieldPreparedContent',
	components: {
		FieldRichTextarea,
		InsertContent,
		Modal,
	},
	extends: FieldRichTextarea,
	mixins: [preparedContent],
	props: {
		/** @see InsertContent.props.insertLabel */
		insertLabel: {
			type: String,
			required: true,
		},

		/**
		 * The title of the modal to insert content
		 */
		insertModalLabel: {
			type: String,
			required: true,
		},

		/** @see InsertContent.props.preparedContent, An optional object containing preset information. When preset information exists, a button will appear in the toolbar. */
		preparedContent: {
			type: Array,
			default() {
				return [];
			},
		},

		/** @see InsertContent.props.itemsLabel */
		preparedContentLabel: {
			type: String,
			required: true,
		},

		/** @see InsertContent.props.searchLabel */
		searchLabel: {
			type: String,
			default() {
				return '';
			},
		},
	},
	data() {
		return {
			isModalPreparedContentOpened: false,
		};
	},
	computed: {
		/**
		 * Get the props that should be passed down to
		 * the FieldRichTextarea component
		 *
		 * Searches parent components recursively to look
		 * for accepted props
		 */
		textareaProps() {
			let props = {};
			let parent = FieldRichTextarea;
			while (parent) {
				Object.keys(parent.props).forEach((key) => {
					if (typeof this[key] !== 'undefined') {
						props[key] = this[key];
					}
				});
				parent = parent.extends ? parent.extends : null;
			}
			return props;
		},

		/**
		 * ID attribute for the prepared content modal
		 *
		 * @return {String}
		 */
		preparedContentId() {
			return this.compileId('preparedContent');
		},

		/**
		 * TinyMce init properties
		 *
		 * @see https://www.tinymce.com/docs/configure/
		 * @return {Object}
		 */
		compiledInit() {
			let self = this;

			// Add the insert content button
			const setup = function (editor) {
				if (self.init.setup) {
					self.init.setup.call(this, editor);
				}
				if (self.preparedContent.length) {
					editor.ui.registry.addButton('pkpInsert', {
						icon: 'plus',
						text: self.t('common.insertContent'),
						onAction() {
							self.isModalPreparedContentOpened = true;
						},
					});
					editor.settings.toolbar += ' | pkpInsert';
				}
			};
			return {
				...this.init,
				setup: setup,
			};
		},

		renderedValue() {
			const render = (value) => {
				return this.renderPreparedContent(value, this.preparedContent);
			};
			let newValue = {};
			if (this.isMultilingual) {
				Object.keys(this.value).forEach((localeKey) => {
					newValue[localeKey] = render(this.value[localeKey]);
				});
			} else {
				newValue = render(this.value);
			}
			return newValue;
		},
	},
	methods: {
		fieldChanged(name, prop, newVal, localeKey) {
			this.$emit('change', name, prop, newVal, localeKey);
		},
		insert(text) {
			this.$refs.textarea.$refs.editor.editor.insertContent(text);
			this.isModalPreparedContentOpened = false;
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

//
</style>
