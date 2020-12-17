<template>
	<field-rich-textarea v-bind="field" value="" @change="change" />
</template>

<script>
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-rich-textarea-abstract';

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
				wordLimit: 200,
				isMultilingual: false
			}
		};
	}
};
</script>
