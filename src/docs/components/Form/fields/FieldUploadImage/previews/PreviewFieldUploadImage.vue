<template>
	<field-upload-image v-bind="field" @change="change" />
</template>

<script>
import FieldUploadImage from '@/components/Form/fields/FieldUploadImage.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-upload-image-logo';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldUploadImage
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
