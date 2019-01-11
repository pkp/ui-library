<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldShowEnsuringLink from '@/components/Form/fields/FieldShowEnsuringLink.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldShowEnsuringLink
	},
	data() {
		return {
			...config,
			component: 'field-show-ensuring-link'
		};
	}
};
</script>
