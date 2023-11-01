import {defineStore} from 'pinia';

export const useAnnouncerStore = defineStore('announcer', {
	state: () => {
		return {
			politeness: {},
			content: '',
		};
	},
	actions: {
		set(content, politeness = 'polite') {
			this.politeness = politeness;
			this.content = content;
		},
	},
});
