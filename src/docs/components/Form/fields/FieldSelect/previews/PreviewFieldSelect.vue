<template>
	<field-select v-bind="field" @change="change" />
</template>

<script>
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-select-country';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldSelect
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
