<script>
import Example from '@/docs/Example.vue';
import PreviewBadge from './previews/PreviewIcon.vue';
import fileContent from '!raw-loader!./previews/PreviewIcon.vue';
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
			props: {...config.props, label: '25 comments', isButton: true},
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
