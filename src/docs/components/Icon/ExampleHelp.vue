<script>
import Example from '@/docs/Example.vue';
import Icon from '@/components/Icon/Icon.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		Icon
	},
	data() {
		return {
			...config,
			title: 'Inline Icon',
			props: {icon: 'info-circle'},
			component: 'icon'
		};
	}
};
</script>
