<template>
	<div class="viewPagination">
		<pagination
			:current-page="currentPage"
			:last-page="lastPage"
			:i18n="i18n"
			@set-page="setPage"
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
				pageLabel: 'Page {$pageNumber}',
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
