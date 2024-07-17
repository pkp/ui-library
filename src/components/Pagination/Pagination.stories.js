import {ref} from 'vue';
import Pagination from './Pagination.vue';
export default {
	title: 'Components/Pagination',
	component: Pagination,
	render: (args) => ({
		components: {Pagination},
		setup() {
			const currentPage = ref(1);
			const isLoading = ref(false);

			/**
			 * Mock a server request delay when changing pages
			 */
			function setPage(page) {
				isLoading.value = true;
				currentPage.value = page;
				setTimeout(() => {
					isLoading.value = false;
				}, 1000);
			}

			return {currentPage, isLoading, setPage, args};
		},
		template: `
			<Pagination
				v-bind="args"
				:current-page="currentPage"
				:is-loading="isLoading"
				@set-page="setPage"
			/>
		`,
	}),
};

export const Default = {
	args: {
		lastPage: 10,
	},
};

export const MoreAdjacentPages = {
	args: {
		lastPage: 10,
		showAdjacentPages: 2,
	},
};
