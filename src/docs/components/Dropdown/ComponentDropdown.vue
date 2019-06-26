<script>
import Component from '@/docs/Component.vue';
import ExampleDropdown from './ExampleDropdown.vue';

export default {
	extends: Component,
	components: {
		ExampleDropdown
	},
	data() {
		return {
			name: 'Dropdown',
			examples: {
				ExampleDropdown: 'Base'
			}
		};
	}
};
</script>
