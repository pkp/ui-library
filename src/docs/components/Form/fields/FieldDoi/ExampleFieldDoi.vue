<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldDoi from '@/components/Form/fields/FieldDoi.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldDoi
	},
	data() {
		return {
			...config,
			component: 'field-doi'
		};
	}
};
</script>
