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
				size: 'small',
				value: 'JP K',
				allErrors: {
					base: ['The journal initials can not contain any spaces.']
				}
			}
		};
	}
};
</script>
