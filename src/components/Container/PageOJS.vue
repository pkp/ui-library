<script>
import Page from '@/components/Container/Page.vue';
import DashboardPage from '@/pages/dashboard/DashboardPage.vue';
import UserInvitationPage from '@/pages/userInvitation/UserInvitationPage.vue';

export default {
	components: {
		DashboardPage,
		UserInvitationPage,
	},
	extends: Page,
};
</script>
