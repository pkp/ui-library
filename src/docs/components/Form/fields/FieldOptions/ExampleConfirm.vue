<script>
import ExampleFieldOptions from './ExampleFieldOptions.vue';
import props from '../../helpers/field-options-confirmation';

export default {
	extends: ExampleFieldOptions,
	data() {
		const data = ExampleFieldOptions.data();
		return {
			...data,
			props: {...props}
		};
	}
};
</script>
