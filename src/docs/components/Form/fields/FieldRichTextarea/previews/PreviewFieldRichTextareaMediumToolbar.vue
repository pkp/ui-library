<template>
	<field-rich-textarea
		v-bind="field"
		toolbar="bold italic superscript subscript | link | blockquote bullist numlist"
		plugins="paste,link,noneditable,lists"
		value=""
		@change="change"
	/>
</template>

<script>
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-rich-textarea-bio';

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
