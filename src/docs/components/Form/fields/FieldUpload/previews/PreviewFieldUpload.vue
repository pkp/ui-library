<template>
	<field-upload v-bind="field" @change="change" />
</template>

<script>
import FieldUpload from '@/components/Form/fields/FieldUpload.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-upload-css';

export default {
	components: {
		FieldUpload,
	},
	extends: PreviewFieldBase,
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				uploadFileLabel: 'Add File',
				restoreLabel: 'Restore',
			},
		};
	},
};
</script>
