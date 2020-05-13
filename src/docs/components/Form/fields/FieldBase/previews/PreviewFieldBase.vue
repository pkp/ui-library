<template>
	<field-text v-bind="field" @change="change" />
</template>

<script>
import FieldText from '@/components/Form/fields/FieldText.vue';
import fieldBase from '../../../helpers/field-base';
import email from '../../../helpers/field-text-email';

export default {
	components: {
		FieldText
	},
	data() {
		return {
			field: {
				...fieldBase,
				...email,
				isRequired: false
			}
		};
	},
	methods: {
		change(name, prop, newValue, localeKey) {
			if (localeKey) {
				this.field[prop][localeKey] = newValue;
			} else {
				this.field[prop] = newValue;
			}
		}
	}
};
</script>
