<template>
	<field-radio-input v-bind="field" @change="change" />
</template>

<script>
import FieldRadioInput from '@/components/Form/fields/FieldRadioInput.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-radio-input';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldRadioInput
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
