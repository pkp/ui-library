<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldText
	},
	data() {
		return {
			...config,
			component: 'field-text'
		};
	}
};
</script>
