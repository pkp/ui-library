<template>
	<field-archiving-pn v-bind="field" @change="change" />
</template>

<script>
import FieldArchivingPn from '@/components/Form/fields/FieldArchivingPn.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import fieldArchivingPn from '../../../helpers/field-archiving-pn';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldArchivingPn
	},
	data() {
		return {
			field: {
				...fieldBase,
				...fieldArchivingPn
			}
		};
	}
};
</script>
