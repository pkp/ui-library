<script>
import ExampleFieldText from './ExampleFieldText.vue';

export default {
	extends: ExampleFieldText,
	data() {
		const data = ExampleFieldText.data();
		return {
			...data,
			props: {
				...data.props,
				label: 'Title',
				size: 'large'
			}
		};
	}
};
</script>
