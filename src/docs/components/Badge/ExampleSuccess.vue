<script>
import Example from '@/docs/Example.vue';
import PreviewSuccess from './previews/PreviewSuccess.vue';
import fileContent from '!raw-loader!./previews/PreviewSuccess.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewSuccess
	},
	data() {
		return {
			...config,
			component: 'preview-success',
			props: {...config.props, label: '', isSuccess: true},
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
