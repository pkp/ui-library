<script>
import Example from '@/docs/Example.vue';
import ExampleIcon from './previews/PreviewIconInline.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ExampleIcon
	},
	data() {
		return {
			...config,
			title: 'Inline Icon',
			props: {icon: 'search', inline: true},
			component: 'example-icon'
		};
	}
};
</script>
