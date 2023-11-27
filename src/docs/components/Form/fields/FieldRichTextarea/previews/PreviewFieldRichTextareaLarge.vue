<template>
	<field-rich-textarea v-bind="field" size="large" value="" @change="change" />
</template>

<script>
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-rich-textarea-bio';

export default {
	components: {
		FieldRichTextarea,
	},
	extends: PreviewFieldBase,
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				isMultilingual: false,
			},
		};
	},
};
</script>
