<template>
	<field-rich-textarea
		v-bind="field"
		toolbar="bold italic superscript subscript | link | blockquote bullist numlist | image | code"
		plugins="paste,link,lists,image,code"
		value=""
		@change="change"
	/>
</template>

<script>
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-rich-textarea-description';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldRichTextarea
	},
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				isMultilingual: false
			}
		};
	}
};
</script>
