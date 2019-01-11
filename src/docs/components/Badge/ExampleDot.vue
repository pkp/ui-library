<script>
import Example from '@/docs/Example.vue';
import PreviewBadge from './previews/PreviewDot.vue';
import fileContent from '!raw-loader!./previews/PreviewDot.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewBadge
	},
	data() {
		return {
			...config,
			component: 'preview-badge',
			props: {
				...config.props,
				label: 'Participant assigned as author',
				hasDot: true
			},
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
