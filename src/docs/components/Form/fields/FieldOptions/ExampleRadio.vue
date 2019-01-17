<script>
import ExampleFieldOptions from './ExampleFieldOptions.vue';
import props from '../../helpers/field-options-emails';

export default {
	extends: ExampleFieldOptions,
	data() {
		const data = ExampleFieldOptions.data();
		return {
			...data,
			props: {...props, showWhen: null}
		};
	}
};
</script>
