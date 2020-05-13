<template>
	<field-pub-id v-bind="field" @change="change" />
</template>

<script>
import FieldPubId from '@/components/Form/fields/FieldPubId.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-doi';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldPubId
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
