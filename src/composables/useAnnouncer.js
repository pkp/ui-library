import {useAnnouncerStore} from '@/stores/announcerStore';

/**
 * Provides functions for making announcements to screen readers
 */
export function useAnnouncer() {
	const announcerStore = useAnnouncerStore();

	/**
	 * Announce content to screen readers
	 * @param {string} content - The content to announce
	 * @param {string} [politeness='polite'] - The politeness level ('polite' or 'assertive')
	 */
	function announce(content, politeness = 'polite') {
		announcerStore.set(content, politeness);
	}

	return {announce};
}
