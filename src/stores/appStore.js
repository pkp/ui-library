import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useThrottleFn} from '@vueuse/core';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardPageStore';

export const useAppStore = defineStore('app', () => {
	/**
	 * Handle the communication between dashboard store and the SideNav
	 *
	 * View count reload is trigger everytime submission listing changes,
	 * but not less often than 5s apart
	 * */

	/**
	 * Editor Dashboard
	 */
	const shouldReloadViewCountsEditorDashboard = ref(false);
	const triggerReloadViewsCountEditorDashboard = useThrottleFn(
		() => {
			shouldReloadViewCountsEditorDashboard.value = true;
			// Reset the flag after a short delay to allow re-triggering
			setTimeout(() => {
				shouldReloadViewCountsEditorDashboard.value = false;
			}, 100);
		},
		5000,
		true, // trailing true to trigger at the end as well
		true,
	);

	const shouldReloadViewCountsMySubmissions = ref(false);
	const triggerReloadViewsCountMySubmissions = useThrottleFn(
		() => {
			shouldReloadViewCountsMySubmissions.value = true;
			// Reset the flag after a short delay to allow re-triggering
			setTimeout(() => {
				shouldReloadViewCountsMySubmissions.value = false;
			}, 100);
		},
		5000,
		true, // trailing true to trigger at the end as well
		true,
	);

	const shouldReloadViewCountsReviewAssignments = ref(false);
	const triggerReloadViewsCountReviewAssignments = useThrottleFn(
		() => {
			shouldReloadViewCountsReviewAssignments.value = true;
			// Reset the flag after a short delay to allow re-triggering
			setTimeout(() => {
				shouldReloadViewCountsReviewAssignments.value = false;
			}, 100);
		},
		5000,
		true, // trailing true to trigger at the end as well
		true,
	);

	function triggerReloadViewsCount(dashboardPage) {
		switch (dashboardPage) {
			case DashboardPageTypes.EDITORIAL_DASHBOARD:
				triggerReloadViewsCountEditorDashboard();
				break;
			case DashboardPageTypes.MY_SUBMISSIONS:
				triggerReloadViewsCountMySubmissions();
				break;
			case DashboardPageTypes.MY_REVIEW_ASSIGNMENTS:
				triggerReloadViewsCountReviewAssignments();
				break;
		}
	}

	return {
		triggerReloadViewsCount,
		shouldReloadViewCountsEditorDashboard,
		shouldReloadViewCountsMySubmissions,
		shouldReloadViewCountsReviewAssignments,
	};
});
