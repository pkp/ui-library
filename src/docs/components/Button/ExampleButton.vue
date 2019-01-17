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
			component: 'pkp-button'
		};
	}
};
</script>
