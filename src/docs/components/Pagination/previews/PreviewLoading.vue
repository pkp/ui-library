<template>
	<pagination
		:current-page="currentPage"
		:last-page="lastPage"
		:is-loading="isLoading"
		:i18n="i18n"
		@set-page="setPage"
	/>
</template>

<script>
import PreviewPagination from './PreviewPagination.vue';

export default {
	extends: PreviewPagination,
	methods: {
		/**
		 * Mock a server request delay when changing pages
		 */
		setPage(page) {
			this.isLoading = true;
			this.currentPage = page;
			setTimeout(() => {
				this.isLoading = false;
			}, 2000);
		}
	}
};
</script>
