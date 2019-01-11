<script>
import Component from '@/docs/Component.vue';
import SettingsContainer from './ExampleSettingsContainer.vue';

export default {
	extends: Component,
	components: {
		SettingsContainer
	},
	data() {
		return {
			name: 'SettingsContainer',
			examples: {
				SettingsContainer: 'Base'
			}
		};
	}
};
</script>
