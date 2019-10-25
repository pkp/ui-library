<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldPubId from '@/components/Form/fields/FieldPubId.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldPubId
	},
	data() {
		return {
			...config,
			component: 'field-pub-id'
		};
	}
};
</script>
