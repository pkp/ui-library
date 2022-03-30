<template>
	<field-rich-textarea
		v-bind="textareaProps"
		ref="textarea"
		:init="compiledInit"
		:value="renderedValue"
		@change="fieldChanged"
	>
		<template slot="footer">
			<modal
				:closeLabel="__('common.close')"
				:name="preparedContentId"
				:title="insertModalLabel"
			>
				<insert-content
					:insertLabel="insertLabel"
					:items="preparedContent"
					:itemsLabel="preparedContentLabel"
					:searchLabel="searchLabel"
					ref="insertContent"
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
	extends: FieldRichTextarea,
	mixins: [preparedContent],
	components: {
		FieldRichTextarea,
		InsertContent,
		Modal
	},
	props: {
		/** @see InsertContent.props.insertLabel */
		insertLabel: {
			type: String,
			required: true
		},

		/**
		 * The title of the modal to insert content
		 */
		insertModalLabel: {
			type: String,
			required: true
		},

		/** @see InsertContent.props.preparedContent */
		preparedContent: {
			type: Array,
			default() {
				return [];
			}
		},

		/** @see InsertContent.props.itemsLabel */
		preparedContentLabel: {
			type: String,
			required: true
		},

		/** @see InsertContent.props.searchLabel */
		searchLabel: {
			type: String,
			default() {
				return '';
			}
		}
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
				Object.keys(parent.props).forEach(key => {
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
			const setup = function(editor) {
				if (self.preparedContent.length) {
					editor.ui.registry.addMenuButton('pkpInsert', {
						icon: 'non-breaking',
						fetch() {
							self.$modal.show(self.preparedContentId);
						}
					});
					editor.settings.toolbar += ' | pkpInsert';
				}
			};
			return {
				...this.init,
				setup: setup
			};
		},

		renderedValue() {
			return this.renderPreparedContent(
				this.currentValue,
				this.preparedContent
			);
		}
	},
	methods: {
		fieldChanged(name, prop, newVal, localeKey) {
			this.$emit('change', name, prop, newVal, localeKey);
		},
		insert(text) {
			this.$refs.textarea.$refs.editor.editor.insertContent(text);
			this.$modal.hide(this.preparedContentId);
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

//
</style>
