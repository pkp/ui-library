<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldArchivingPn from '@/components/Form/fields/FieldArchivingPn.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldArchivingPn
	},
	data() {
		return {
			...config,
			component: 'field-archiving-pn'
		};
	}
};
</script>
