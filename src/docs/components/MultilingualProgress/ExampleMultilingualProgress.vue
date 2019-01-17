<script>
import Example from '@/docs/Example.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		MultilingualProgress
	},
	data() {
		return {
			...config,
			component: 'multilingual-progress'
		};
	}
};
</script>
