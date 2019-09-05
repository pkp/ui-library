<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldSelectIssue from '@/components/Form/fields/FieldSelectIssue.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldSelectIssue
	},
	data() {
		return {
			...config,
			component: 'field-select-issue'
		};
	}
};
</script>
