import {useUrl} from '@/composables/useUrl';
import {useCurrentUser} from '@/composables/useCurrentUser';

export function useUserAuth() {
	function getDashboardAuthRedirect(roleId, submissionId) {
		let redirectUrl = '';
		if (roleId === pkp.const.ROLE_ID_AUTHOR) {
			const {pageUrl: authorRedirectUrl} = useUrl(
				`dashboard/mySubmissions?workflowSubmissionId=${submissionId}`,
			);
			redirectUrl = authorRedirectUrl.value;
		} else {
			const {pageUrl: editorialRedirectUrl} = useUrl(
				`dashboard/editorial?workflowSubmissionId=${submissionId}`,
			);
			redirectUrl = editorialRedirectUrl.value;
		}

		return redirectUrl;
	}

	function getDashboardLoginAsUrl(roleId, userId, submissionId) {
		const redirectUrl = getDashboardAuthRedirect(roleId, submissionId);
		return `login/signInAsUser/${userId}?redirectUrl=${encodeURIComponent(redirectUrl)}`;
	}

	function getDashboardLogoutAsUrl(submissionId) {
		const redirectUrl = getDashboardAuthRedirect(
			pkp.const.ROLE_ID_MANAGER,
			submissionId,
		);
		return `login/signOutAsUser?redirectUrl=${encodeURIComponent(redirectUrl)}`;
	}

	function getLogoutAsUrl() {
		const submissionId = new URLSearchParams(window.location.search).get(
			'workflowSubmissionId',
		);

		// if the user is currently on a submission page, build the redirect url to the same submission page
		return submissionId
			? getDashboardLogoutAsUrl(submissionId)
			: 'login/signOutAsUser';
	}

	function getLogoutUrl() {
		const {isUserLoggedInAs} = useCurrentUser();
		return isUserLoggedInAs() ? getLogoutAsUrl() : 'login/signOut';
	}

	return {
		getDashboardLoginAsUrl,
		getLogoutAsUrl,
		getLogoutUrl,
	};
}
