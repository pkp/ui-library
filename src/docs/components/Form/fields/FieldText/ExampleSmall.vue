<script>
import ExampleFieldText from './ExampleFieldText.vue';
import doiProps from '../../helpers/field-text-doi-prefix';

export default {
	extends: ExampleFieldText,
	data() {
		const data = ExampleFieldText.data();
		return {
			...data,
			props: {
				...data.props,
				...doiProps
			}
		};
	}
};
</script>
