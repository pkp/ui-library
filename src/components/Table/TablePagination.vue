<template>
	<div
		class="flex items-center justify-between border-x border-b border-light px-2 py-2"
	>
		<span v-strip-unsafe-html="showingXofX" class=""></span>
		<Pagination
			v-if="pagination.pageCount > 1"
			:current-page="pagination.currentPage"
			:last-page="pagination.pageCount"
			:show-adjacent-pages="3"
			@set-page="(...args) => emit('setPage', ...args)"
		></Pagination>
	</div>
</template>

<script setup>
import Pagination from '@/components/Pagination/Pagination.vue';
import {defineProps, computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	/** Pagination object from fetchPaginated, required fields are currentPage, pageCount, firstItemIndex, lastItemIndex, itemCount */
	pagination: {type: Object, required: true},
});

const emit = defineEmits('set-page');

const {t} = useLocalize();
/*
 * A localized string with a count of the submissions being viewed
 *
 * eg - Showing 1 to 30 of 170
 */
const showingXofX = computed(() =>
	t('common.showingXofX', {
		start: props.pagination.firstItemIndex,
		finish: props.pagination.lastItemIndex,
		total: props.pagination.itemCount,
	}),
);
</script>
