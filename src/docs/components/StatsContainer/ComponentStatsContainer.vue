<script>
import Component from '@/docs/Component.vue';
import StatsContainer from './ExampleStatsContainer.vue';

export default {
	extends: Component,
	components: {
		StatsContainer
	},
	data() {
		return {
			name: 'StatsContainer',
			examples: {
				StatsContainer: 'Base'
			}
		};
	}
};
</script>
