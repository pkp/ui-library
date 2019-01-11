<script>
import Example from '@/docs/Example.vue';
import SettingsContainer from '@/components/SettingsContainer/SettingsContainer.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		SettingsContainer
	},
	data() {
		return {
			...config,
			title: 'SettingsContainer',
			component: 'settings-container',
			template: ''
		};
	}
};
</script>
