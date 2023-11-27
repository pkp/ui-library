<template>
	<field-text
		v-bind="field"
		label="Copyright Holder"
		:opt-into-edit="true"
		opt-into-edit-label="Override"
		@change="change"
	/>
</template>

<script>
import FieldText from '@/components/Form/fields/FieldText.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-text-given-name';

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
				isRequired: false,
			},
		};
	},
};
</script>
