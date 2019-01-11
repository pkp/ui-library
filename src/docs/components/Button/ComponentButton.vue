<script>
import Component from '@/docs/Component.vue';
import Button from './ExampleButton.vue';
import Primary from './ExamplePrimary.vue';
import Warnable from './ExampleWarnable.vue';
import Link from './ExampleLink.vue';
import Active from './ExampleActive.vue';
import IconButton from './ExampleIcon.vue';

export default {
	extends: Component,
	components: {
		Button,
		Primary,
		Warnable,
		Link,
		Active,
		IconButton
	},
	data() {
		return {
			name: 'Button',
			examples: {
				Button: 'Base',
				Primary: 'Primary',
				Warnable: 'Warnable',
				Link: 'Link',
				Active: 'Active',
				IconButton: 'Icon'
			}
		};
	}
};
</script>
