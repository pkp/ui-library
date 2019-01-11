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
				label: 'Journal Path',
				size: 'large',
				prefix: 'https://publicknowledgeproject.com/'
			}
		};
	}
};
</script>
