<script>
import ExampleFieldTextarea from './ExampleFieldTextarea.vue';

export default {
	extends: ExampleFieldTextarea,
	data() {
		const data = ExampleFieldTextarea.data();
		return {
			...data,
			props: {
				...data.props,
				label: 'References',
				size: 'large'
			}
		};
	}
};
</script>
