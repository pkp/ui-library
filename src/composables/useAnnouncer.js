import {useAnnouncerStore} from '@/stores/announcerStore';

export function useAnnouncer() {
	const announcerStore = useAnnouncerStore();

	function announce(content, politeness = 'polite') {
		announcerStore.set(content, politeness);
	}

	return {announce};
}
