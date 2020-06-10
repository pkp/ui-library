<template>
	<field-metadata-setting v-bind="field" @change="change" />
</template>

<script>
import FieldMetadataSetting from '@/components/Form/fields/FieldMetadataSetting.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import fieldMetadata from '../../../helpers/field-metadata';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldMetadataSetting
	},
	data() {
		return {
			field: {
				...fieldBase,
				...fieldMetadata
			}
		};
	}
};
</script>
