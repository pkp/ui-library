import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useThrottleFn} from '@vueuse/core';

export const useAppStore = defineStore('app', () => {
	/**
	 * Handle the communication between dashboard store and the SideNav
	 *
	 * View count reload is trigger everytime submission listing changes,
	 * but not less often than 5s apart
	 * */

	const shouldReloadNavigationCounts = ref(false);

	const triggerNavigationReloadCounts = useThrottleFn(
		() => {
			shouldReloadNavigationCounts.value = true;
			// Reset the flag after a short delay to allow re-triggering
			setTimeout(() => {
				shouldReloadNavigationCounts.value = false;
			}, 100);
		},
		5000,
		true, // trailing true to trigger at the end as well
		true,
	); // Throttle to once every 10 seconds

	return {
		shouldReloadNavigationCounts,
		triggerNavigationReloadCounts,
	};
});
