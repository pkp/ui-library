<script>
import Component from '@/docs/Component.vue';
import ExampleList from './ExampleList.vue';

export default {
	extends: Component,
	components: {
		ExampleList
	},
	data() {
		return {
			name: 'List',
			examples: {
				ExampleList: 'Base'
			}
		};
	}
};
</script>
