<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldTextarea from '@/components/Form/fields/FieldTextarea.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldTextarea
	},
	data() {
		return {
			...config,
			component: 'field-textarea'
		};
	}
};
</script>
