<template>
	<field-color v-bind="field" @change="change" />
</template>

<script>
import FieldColor from '@/components/Form/fields/FieldColor.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import fieldColor from '../../../helpers/field-color';

export default {
	components: {
		FieldColor,
	},
	extends: PreviewFieldBase,
	data() {
		return {
			field: {
				...fieldBase,
				...fieldColor,
			},
		};
	},
};
</script>
