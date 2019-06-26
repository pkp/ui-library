<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldSelectIssueScheduled from '@/components/Form/fields/FieldSelectIssue.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldSelectIssueScheduled
	},
	data() {
		return {
			...config,
			component: 'field-select-issue-scheduled',
			props: {
				...config.props,
				publicationStatus: 5, // STATUS_SCHEDULED
				value: 4
			}
		};
	}
};
</script>
