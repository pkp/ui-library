<template>
	<field-text
		v-bind="field"
		label="Journal Initials"
		tooltip="Enter two to four letters that uniquely identify your journal."
		value=""
	/>
</template>

<script>
import FieldText from '@/components/Form/fields/FieldText.vue';
import fieldBase from '../../../helpers/field-base';

export default {
	components: {
		FieldText
	},
	data() {
		return {
			field: fieldBase
		};
	}
};
</script>
