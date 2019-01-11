<script>
import Example from '@/docs/Example.vue';
import PkpButton from '@/components/Button/Button.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PkpButton
	},
	data() {
		return {
			...config,
			props: {...config.props, isPrimary: true},
			component: 'pkp-button'
		};
	}
};
</script>
