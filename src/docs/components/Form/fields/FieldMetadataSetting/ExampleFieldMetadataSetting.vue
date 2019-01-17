<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldMetadataSetting from '@/components/Form/fields/FieldMetadataSetting.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldMetadataSetting
	},
	data() {
		return {
			...config,
			component: 'field-metadata-setting'
		};
	}
};
</script>
