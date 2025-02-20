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

const {calculateDaysFromNow} = useDate();

const days = computed(() => {
	return calculateDaysFromNow(props.item.dateLastActivity);
});
</script>
