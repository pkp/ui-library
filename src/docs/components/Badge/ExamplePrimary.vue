<script>
import Example from '@/docs/Example.vue';
import PreviewBadge from './previews/PreviewPrimary.vue';
import fileContent from '!raw-loader!./previews/PreviewPrimary.vue';
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
				label: '4 assigned submissions',
				isPrimary: true
			},
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
