<template>
	<field-text v-bind="field" label="Title" size="large" @change="change" />
</template>

<script>
import FieldText from '@/components/Form/fields/FieldText.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-text-doi-prefix';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldText
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
