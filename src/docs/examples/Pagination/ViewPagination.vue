<template>
	<div class="viewPagination">
		<pagination
			:currentPage="currentPage"
			:lastPage="lastPage"
			:i18n="i18n"
			@setPage="setPage"
		/>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
	components: {
		Pagination,
	},
	data: function () {
		return {
			currentPage: 12,
			lastPage: 20,
			i18n: {
				paginationLabel: 'Other pages of this example component',
				goToLabel: 'Go to {$page}',
				pageLabel: 'Page {$page}',
				nextPageLabel: 'Next page',
				previousPageLabel: 'Previous page',
			},
		};
	},
	methods: {
		setPage: function (page) {
			this.currentPage = page;
		},
	},
};
</script>
