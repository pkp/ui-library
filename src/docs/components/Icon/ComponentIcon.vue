<script>
import Component from '@/docs/Component.vue';
import Icon from './ExampleIcon.vue';
import Inline from './ExampleInline.vue';
import Help from './ExampleHelp.vue';
import Warning from './ExampleWarning.vue';

export default {
	extends: Component,
	components: {
		Icon,
		Inline,
		Help,
		Warning
	},
	data() {
		return {
			name: 'Icon',
			examples: {
				Icon: 'Base',
				Inline: 'Inline',
				Help: 'Help',
				Warning: 'Warning'
			}
		};
	}
};
</script>
