<template>
	<div class="previewPagination">
		<pagination
			:current-page="currentPage"
			:last-page="10"
			:isLoading="isLoading"
			@set-page="setPage"
		/>
		<pagination
			:current-page="currentPage"
			:last-page="10"
			:show-adjacent-pages="2"
			:isLoading="isLoading"
			@set-page="setPage"
		/>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
	components: {
		Pagination
	},
	data() {
		return {
			currentPage: 1,
			isLoading: false
		};
	},
	methods: {
		/**
		 * Mock a server request delay when changing pages
		 */
		setPage(page) {
			this.isLoading = true;
			this.currentPage = page;
			setTimeout(() => {
				this.isLoading = false;
			}, 1000);
		}
	}
};
</script>

<style lang="less">
.previewPagination > * + * {
	margin-top: 2rem;
}
</style>
