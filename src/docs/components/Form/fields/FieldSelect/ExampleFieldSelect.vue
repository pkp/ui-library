<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldSelect
	},
	data() {
		return {
			...config,
			component: 'field-select'
		};
	}
};
</script>
