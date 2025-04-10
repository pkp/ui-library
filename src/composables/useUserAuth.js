import {useUrl} from '@/composables/useUrl';
import {useCurrentUser} from '@/composables/useCurrentUser';

/**
 * Provides utility functions for user authentication and impersonation.
 */
export function useUserAuth() {
	/**
	 * Get the redirect URL for the dashboard based on the user's role and submission ID.
	 *
	 * @param {number} roleId - The role ID of the user (e.g., author, manager).
	 * @param {number} submissionId - The ID of the submission.
	 * @returns {string} The redirect URL for the dashboard.
	 */
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

	/**
	 * Get the login-as URL for impersonating another user.
	 *
	 * @param {number} roleId - The role ID of the user being impersonated.
	 * @param {number} userId - The ID of the user being impersonated.
	 * @param {number} submissionId - The ID of the submission.
	 * @returns {string} The URL for logging in as another user.
	 */
	function getDashboardLoginAsUrl(roleId, userId, submissionId) {
		const redirectUrl = getDashboardAuthRedirect(roleId, submissionId);
		return `login/signInAsUser/${userId}?redirectUrl=${encodeURIComponent(redirectUrl)}`;
	}

	/**
	 * Get the logout-as URL for stopping impersonation and returning to the original user.
	 *
	 * @param {number} submissionId - The ID of the submission.
	 * @returns {string} The URL for logging out as the impersonated user.
	 */
	function getDashboardLogoutAsUrl(submissionId) {
		const redirectUrl = getDashboardAuthRedirect(
			pkp.const.ROLE_ID_MANAGER,
			submissionId,
		);
		return `login/signOutAsUser?redirectUrl=${encodeURIComponent(redirectUrl)}`;
	}

	/**
	 * Get the logout-as URL for the current user.
	 *
	 * If the user is on a submission page, the redirect URL will point to the same submission page.
	 * Otherwise, it will return a generic logout-as URL.
	 *
	 * @returns {string} The URL for logging out as the impersonated user.
	 */
	function getLogoutAsUrl() {
		const submissionId = new URLSearchParams(window.location.search).get(
			'workflowSubmissionId',
		);

		// If the user is currently on a submission page, build the redirect URL to the same submission page
		return submissionId
			? getDashboardLogoutAsUrl(submissionId)
			: 'login/signOutAsUser';
	}

	/**
	 * Get the logout URL for the current user.
	 *
	 * If the user is impersonating another user, it will return the logout-as URL.
	 * Otherwise, it will return the standard logout URL.
	 *
	 * @returns {string} The URL for logging out.
	 */
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
