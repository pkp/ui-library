<template>
	<field-text v-bind="field" label="Title" size="large" @change="change" />
</template>

<script>
import FieldText from '@/components/Form/fields/FieldText.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-text-doi-prefix';

export default {
	components: {
		FieldText,
	},
	extends: PreviewFieldBase,
	data() {
		return {
			field: {
				...fieldBase,
				...field,
			},
		};
	},
};
</script>
