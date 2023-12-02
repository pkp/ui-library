import {ref} from 'vue';
import Search from './Search.vue';
export default {
	title: 'Components/Search',
	component: Search,
};

export const Default = {
	render: (args) => ({
		components: {Search},
		setup() {
			const searchPhrase = ref('');

			function setSearchPhrase(val) {
				searchPhrase.value = val;
			}
			return {searchPhrase, setSearchPhrase};
		},
		template: `
			<Search
				:search-phrase="searchPhrase"
				@search-phrase-changed="setSearchPhrase"
			/>
		`,
	}),

	args: {},
};
