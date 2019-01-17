<script>
import Example from '@/docs/Example.vue';
import PreviewBadge from './previews/PreviewWarnable.vue';
import fileContent from '!raw-loader!./previews/PreviewWarnable.vue';
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
			props: {...config.props, label: '7 new messages', isWarnable: true},
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
