<script>
import Component from '@/docs/Component.vue';
import ExampleSpinner from './ExampleSpinner.vue';

export default {
	extends: Component,
	components: {
		ExampleSpinner
	},
	data() {
		return {
			name: 'Spinner',
			examples: {
				ExampleSpinner: 'Base'
			}
		};
	}
};
</script>
