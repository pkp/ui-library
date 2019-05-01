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
import Pagination from '@/components/Pagination/Pagination.vue';
import {props} from '../config';

export default {
	components: {
		Pagination
	},
	data() {
		return {...props};
	},
	methods: {
		setPage(page) {
			this.currentPage = page;
		}
	}
};
</script>
