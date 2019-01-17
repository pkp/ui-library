<script>
import Example from '@/docs/Example.vue';
import PreviewBadge from './previews/PreviewStage.vue';
import fileContent from '!raw-loader!./previews/PreviewStage.vue';
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
				label: 'Currently in the submission stage',
				stage: 'submission',
				isButton: 'true'
			},
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
