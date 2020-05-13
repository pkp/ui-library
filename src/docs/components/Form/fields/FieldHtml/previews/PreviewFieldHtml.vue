<template>
	<field-html v-bind="field" @change="change" />
</template>

<script>
import FieldHtml from '@/components/Form/fields/FieldHtml.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-html-lorem';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldHtml
	},
	data() {
		return {
			field: {
				...fieldBase,
				...field
			}
		};
	}
};
</script>
