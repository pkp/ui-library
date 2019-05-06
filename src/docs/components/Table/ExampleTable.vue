<script>
import Example from '@/docs/Example.vue';
import PreviewTable from './previews/PreviewTable.vue';
import fileContent from '!raw-loader!./previews/PreviewTable.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewTable
	},
	data() {
		return {
			...config,
			component: 'preview-table',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
