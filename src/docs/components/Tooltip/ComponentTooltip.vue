<script>
import Component from '@/docs/Component.vue';
import ExampleTooltip from './ExampleTooltip.vue';

export default {
	extends: Component,
	components: {
		ExampleTooltip
	},
	data() {
		return {
			name: 'Tooltip',
			examples: {
				ExampleTooltip: 'Base'
			}
		};
	}
};
</script>
