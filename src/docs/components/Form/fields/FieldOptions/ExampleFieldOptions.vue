<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldOptions
	},
	data() {
		return {
			...config,
			component: 'field-options'
		};
	}
};
</script>
