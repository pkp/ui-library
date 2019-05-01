<template>
	<pagination
		:current-page="currentPage"
		:last-page="lastPage"
		:show-adjacent-pages="showAdjacentPages"
		:i18n="i18n"
		@set-page="setPage"
	/>
</template>

<script>
import PreviewPagination from './PreviewPagination.vue';

export default {
	extends: PreviewPagination,
	data() {
		return {
			...PreviewPagination.data(),
			showAdjacentPages: 2
		};
	}
};
</script>
