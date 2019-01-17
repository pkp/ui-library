<script>
import Component from '@/docs/Component.vue';
import MultilingualProgress from './ExampleMultilingualProgress.vue';

export default {
	extends: Component,
	components: {
		MultilingualProgress
	},
	data() {
		return {
			name: 'MultilingualProgress',
			examples: {
				MultilingualProgress: 'Base'
			}
		};
	}
};
</script>
