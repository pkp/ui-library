<script>
import Example from '@/docs/Example.vue';
import Container from '@/components/Container/Container.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		Container
	},
	data() {
		return {
			...config,
			title: 'Container',
			component: 'container',
			template: ''
		};
	}
};
</script>
