<script>
import UsersListPanel from '@/components/ListPanel/users/UsersListPanel.vue';
import ExampleUsersListPanel from './ExampleUsersListPanel.vue';

export default {
	extends: UsersListPanel,
	name: 'ExampleMergeUsersListPanel',
	data: function () {
		let data = ExampleUsersListPanel.data();
		data.mergeUserSourceId = 2;

		return data;
	},
};
</script>
