<script>
import ExampleDescription from './ExampleDescription.vue';

export default {
	extends: ExampleDescription,
	data() {
		const data = ExampleDescription.data();
		return {
			...data,
			props: {
				...data.props,
				label: 'Journal Initials',
				description: '',
				tooltip: data.props.description
			}
		};
	}
};
</script>
