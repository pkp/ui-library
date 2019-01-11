<script>
import Example from '@/docs/Example.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PkpButton,
		Icon
	},
	data() {
		return {
			...config,
			props: {...config.props, label: 'Filters', icon: 'filter'},
			component: 'pkp-button'
		};
	}
};
</script>
