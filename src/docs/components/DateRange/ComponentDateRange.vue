<script>
import Component from '@/docs/Component.vue';
import DateRange from './ExampleDateRange.vue';

export default {
	extends: Component,
	components: {
		DateRange
	},
	data() {
		return {
			name: 'DateRange',
			examples: {
				DateRange: 'Base'
			}
		};
	}
};
</script>
