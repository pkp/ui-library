<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldColor from '@/components/Form/fields/FieldColor.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldColor
	},
	data() {
		return {
			...config,
			component: 'field-color'
		};
	}
};
</script>
