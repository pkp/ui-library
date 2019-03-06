<script>
import Component from '@/docs/Component.vue';
import Container from './ExampleContainer.vue';

export default {
	extends: Component,
	components: {
		Container
	},
	data() {
		return {
			name: 'Container',
			examples: {
				Container: 'Base'
			}
		};
	}
};
</script>
