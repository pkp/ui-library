<template>
	<field-text v-bind="field" label="Journal Initials" value="JP K" />
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
			field: {
				...fieldBase,
				name: 'initials',
				allErrors: {
					initials: ['The journal initials can not contain any spaces.']
				}
			}
		};
	}
};
</script>
