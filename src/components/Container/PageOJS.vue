<script>
import Page from '@/components/Container/Page.vue';
import DashboardPage from '@/pages/dashboard/DashboardPage.vue';
import UserInvitationPage from '@/pages/userInvitation/UserInvitationPage.vue';
import AcceptInvitationPage from '@/pages/acceptInvitation/AcceptInvitationPage.vue';
import InvitationPage from '@/pages/invitation/InvitationPage.vue';

export default {
	components: {
		DashboardPage,
		UserInvitationPage,
		AcceptInvitationPage,
		InvitationPage,
	},
	extends: Page,
};
</script>
