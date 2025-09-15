<template>
	<TableCellSelect :checked="!!template?.autoAdd" :labelled-by="labelIds" />
</template>

<script setup>
import {inject} from 'vue';
import TableCellSelect from '@/components/Table/TableCellSelect.vue';

const tableContext = inject('tableContext');

const props = defineProps({template: {type: Object, required: true}});
const labelIds = `template_name_${props.template.id} ${tableContext.tableId}_${props.index}`;
</script>
