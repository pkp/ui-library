<script>
import Component from '@/docs/Component.vue';
import ExampleHelpButton from './ExampleHelpButton.vue';

export default {
	extends: Component,
	components: {
		ExampleHelpButton
	},
	data() {
		return {
			name: 'Help Button',
			examples: {
				ExampleHelpButton: 'Base'
			}
		};
	}
};
</script>
