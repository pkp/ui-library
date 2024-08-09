<script>
import Page from '@/components/Container/Page.vue';
import DashboardPage from '@/pages/dashboard/DashboardPage.vue';
import UserInvitationPage from '@/pages/userInvitation/UserInvitationPage.vue';
import AcceptInvitationPage from '@/pages/acceptInvitation/AcceptInvitationPage.vue';

export default {
	components: {
		DashboardPage,
		UserInvitationPage,
		AcceptInvitationPage,
	},
	extends: Page,
};
</script>
