<script>
import Component from '@/docs/Component.vue';
import ExampleOrderer from './ExampleOrderer.vue';
import Draggable from './ExampleDraggable.vue';

export default {
	extends: Component,
	components: {
		ExampleOrderer,
		Draggable
	},
	data() {
		return {
			name: 'Orderer',
			examples: {
				ExampleOrderer: 'Base',
				Draggable: 'Drag-and-Drop'
			}
		};
	}
};
</script>
