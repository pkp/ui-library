<template>
	<field-options v-bind="field" @change="change" />
</template>

<script>
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-options-user-locales';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldOptions
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
