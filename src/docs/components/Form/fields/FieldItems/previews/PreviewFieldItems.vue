<template>
	<field-items v-bind="field" @change="change" />
</template>

<script>
import FieldItems from '@/components/Form/fields/FieldItems.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-items';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldItems
	},
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				isRequired: false
			}
		};
	}
};
</script>
