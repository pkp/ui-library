<template>
	<field-select-issue v-bind="field" @change="change" />
</template>

<script>
import FieldSelectIssue from '@/components/Form/fields/FieldSelectIssue.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-select-issue';

export default {
	components: {
		FieldSelectIssue,
	},
	extends: PreviewFieldBase,
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				publicationStatus: 5, // PKPSubmission::STATUS_SCHEDULED
				value: 4,
			},
		};
	},
};
</script>
