import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const useProgressStore = defineStore('progress', () => {
	/**
	 * Background spinner currently used on workflow page
	 * Detects all fetch activity on current screen
	 * */
	const screenFetchesInProgress = ref({});
	const screensInProgress = computed(() => {
		const screens = [];
		Object.keys(screenFetchesInProgress.value).forEach((key) => {
			if (screenFetchesInProgress.value[key] > 0) {
				screens.push(key);
			}
		});

		return screens;
	});

	function fetchStarted(screenName = 'base') {
		if (
			Object.prototype.hasOwnProperty.call(
				screenFetchesInProgress.value,
				screenName,
			)
		) {
			screenFetchesInProgress.value[screenName] = 0;
		}

		screenFetchesInProgress.value[screenName]++;
	}

	function fetchFinished(screenName = 'base') {
		screenFetchesInProgress.value[screenName]--;
	}

	/**
	 * Fullscreen spinner
	 */

	const isFullScreenSpinner = ref(false);
	function startFullScreenSpinner() {
		isFullScreenSpinner.value = true;
	}
	function stopFullScreenSpinner() {
		isFullScreenSpinner.value = false;
	}

	return {
		fetchStarted,
		fetchFinished,
		screensInProgress,

		/**
		 * Full Screen spinner
		 */
		isFullScreenSpinner,
		startFullScreenSpinner,
		stopFullScreenSpinner,
	};
});
