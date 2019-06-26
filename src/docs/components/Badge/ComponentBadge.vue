<script>
import Component from '@/docs/Component.vue';
import ExampleBadge from './ExampleBadge.vue';
import Primary from './ExamplePrimary.vue';
import Success from './ExampleSuccess.vue';
import Warnable from './ExampleWarnable.vue';
import Dot from './ExampleDot.vue';
import Stage from './ExampleStage.vue';
import Button from './ExampleButton.vue';
import IconBadge from './ExampleIcon.vue';

export default {
	extends: Component,
	components: {
		ExampleBadge,
		Primary,
		Success,
		Warnable,
		Dot,
		Stage,
		Button,
		IconBadge
	},
	data() {
		return {
			name: 'Badge',
			examples: {
				ExampleBadge: 'Base',
				Primary: 'Primary',
				Success: 'Success',
				Warnable: 'Warnable',
				Dot: 'Dot',
				Stage: 'Stage',
				Button: 'Button',
				IconBadge: 'Icon'
			}
		};
	}
};
</script>
