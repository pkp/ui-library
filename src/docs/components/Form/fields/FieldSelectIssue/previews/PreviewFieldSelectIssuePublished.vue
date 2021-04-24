<template>
	<field-select-issue v-bind="field" @change="change" />
</template>

<script>
import FieldSelectIssue from '@/components/Form/fields/FieldSelectIssue.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-select-issue';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldSelectIssue
	},
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				publicationStatus: 3, // PKPSubmission::STATUS_PUBLISHED
				value: 3
			}
		};
	}
};
</script>
