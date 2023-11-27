<template>
	<field-show-ensuring-link v-bind="field" @change="change" />
</template>

<script>
import FieldShowEnsuringLink from '@/components/Form/fields/FieldShowEnsuringLink.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-show-ensuring-link';

export default {
	components: {
		FieldShowEnsuringLink,
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
