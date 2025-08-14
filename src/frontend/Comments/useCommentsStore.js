import {defineStore} from 'pinia';
import {ref} from 'vue';
export const useCommentsStore = defineStore('comments', () => {
	const messages = ref([
		{
			body: 'blabla',
			author: {name: 'name author', affiliation: 'affiliation', orcid: null},
		},
		{
			body: 'blabla 2',
			author: {
				name: 'name author 2',
				affiliation: 'affiliation 2',
				orcid: null,
			},
		},
	]);

	return {messages};
});
