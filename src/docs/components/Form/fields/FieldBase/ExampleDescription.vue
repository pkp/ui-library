<script>
import ExampleFieldBase from './ExampleFieldBase.vue';

export default {
	extends: ExampleFieldBase,
	data() {
		const data = ExampleFieldBase.data();
		return {
			...data,
			props: {
				...data.props,
				label: 'Journal Initials',
				description:
					'Enter two to four letters that uniquely identify your journal.',
				size: 'small'
			}
		};
	}
};
</script>
