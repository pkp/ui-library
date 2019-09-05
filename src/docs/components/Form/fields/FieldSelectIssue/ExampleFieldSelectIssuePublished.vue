<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldSelectIssuePublished from '@/components/Form/fields/FieldSelectIssue.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldSelectIssuePublished
	},
	data() {
		return {
			...config,
			component: 'field-select-issue-published',
			props: {
				...config.props,
				publicationStatus: 3, // STATUS_PUBLISHED
				value: 3
			}
		};
	}
};
</script>
