import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useAnnouncerStore = defineStore('announcer', () => {
	const politeness = ref('');
	const content = ref('');

	function set(_content, _politeness = 'polite') {
		politeness.value = _politeness;
		content.value = _content;
	}

	return {politeness, content, set};
});
