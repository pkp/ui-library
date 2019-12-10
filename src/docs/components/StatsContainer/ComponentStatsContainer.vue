<script>
import Component from '@/docs/Component.vue';
import StatsPublicationsContainer from './ExampleStatsPublicationsContainer.vue';
import StatsEditorialContainer from './ExampleStatsEditorialContainer.vue';

export default {
	extends: Component,
	components: {
		StatsPublicationsContainer,
		StatsEditorialContainer
	},
	data() {
		return {
			name: 'StatsContainer',
			examples: {
				StatsPublicationsContainer: 'StatsPublicationsContainer',
				StatsEditorialContainer: 'StatsEditorialContainer'
			}
		};
	}
};
</script>
