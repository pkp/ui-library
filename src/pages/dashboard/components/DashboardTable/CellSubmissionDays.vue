<template>
	<TableCell>{{ days }}</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import {useDate} from '@/composables/useDate';

import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({
	item: {type: Object, required: true},
});

const {calculateDaysBetweenDates} = useDate();

const days = computed(() => {
	return calculateDaysBetweenDates(props.item.dateLastActivity, new Date());
});
</script>
