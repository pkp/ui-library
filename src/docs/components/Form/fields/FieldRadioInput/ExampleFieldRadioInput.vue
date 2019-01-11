<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldRadioInput from '@/components/Form/fields/FieldRadioInput.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldRadioInput
	},
	data() {
		return {
			...config,
			component: 'field-radio-input'
		};
	}
};
</script>
