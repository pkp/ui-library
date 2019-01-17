<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldUpload from '@/components/Form/fields/FieldUpload.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldUpload
	},
	data() {
		return {
			...config,
			component: 'field-upload'
		};
	}
};
</script>
