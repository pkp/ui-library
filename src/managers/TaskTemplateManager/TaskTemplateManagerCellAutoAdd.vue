<template>
	<TableCellSelect :checked="!!taskTemplate?.autoAdd" :labelled-by="labelIds" />
</template>

<script setup>
import {inject} from 'vue';
import TableCellSelect from '@/components/Table/TableCellSelect.vue';

const tableContext = inject('tableContext');

const props = defineProps({taskTemplate: {type: Object, required: true}});
const labelIds = `template_name_${props.taskTemplate.id} ${tableContext.tableId}_${props.index}`;
</script>
