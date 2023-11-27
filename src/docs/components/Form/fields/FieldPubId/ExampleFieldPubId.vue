<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldPubId from '@/components/Form/fields/FieldPubId.vue';
import config from './config';

export default {
	components: {
		FieldPubId,
	},
	extends: ExampleFieldBase,
	data() {
		return {
			...config,
			component: 'field-pub-id',
		};
	},
};
</script>
