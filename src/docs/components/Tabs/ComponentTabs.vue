<script>
import Component from '@/docs/Component.vue';
import ExampleTab from './ExampleTab.vue';
import Nested from './ExampleNested.vue';
import Side from './ExampleSide.vue';
import Default from './ExampleDefault.vue';
import Icon from './ExampleIcon.vue';
import Badge from './ExampleBadge.vue';

export default {
	extends: Component,
	components: {
		ExampleTab,
		Nested,
		Side,
		Default,
		Icon,
		Badge
	},
	data() {
		return {
			name: 'Tabs',
			examples: {
				ExampleTab: 'Base',
				Nested: 'Nested Tabs',
				Side: 'Nested Tabs (Side)',
				Default: 'Default Tab',
				Icon: 'Icon-only Tab',
				Badge: 'Badge Tab'
			}
		};
	}
};
</script>
