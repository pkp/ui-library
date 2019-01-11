<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldUploadImage from '@/components/Form/fields/FieldUploadImage.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldUploadImage
	},
	data() {
		return {
			...config,
			component: 'field-upload-image'
		};
	}
};
</script>
