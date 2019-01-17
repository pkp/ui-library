<script>
import Example from '@/docs/Example.vue';
import PreviewBadge from './previews/PreviewButton.vue';
import fileContent from '!raw-loader!./previews/PreviewButton.vue';
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
				label: 'View all layout editors',
				isButton: true
			},
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
