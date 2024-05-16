<script>
import Page from '@/components/Container/Page.vue';
import SubmissionsPage from '@/pages/submissions/SubmissionsPage.vue';
import UserInvitationPage from '@/pages/userInvitation/UserInvitationPage.vue';
import AcceptInvitationPage from '@/pages/acceptInvitation/AcceptInvitationPage.vue';

export default {
	components: {
		SubmissionsPage,
		UserInvitationPage,
		AcceptInvitationPage,
	},
	extends: Page,
};
</script>
