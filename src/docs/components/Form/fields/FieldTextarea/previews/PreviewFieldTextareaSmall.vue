<template>
	<field-textarea
		v-bind="field"
		label="Mailing Address"
		size="small"
		@change="change"
	/>
</template>

<script>
import FieldTextarea from '@/components/Form/fields/FieldTextarea.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-textarea-metatags';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldTextarea
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
