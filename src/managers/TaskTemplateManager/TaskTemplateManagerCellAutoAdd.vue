<template>
	<TableCellSelect
		:checked="!!taskTemplate?.include"
		:labelled-by="labelIds"
		:confirm-title="t('taskTemplates.confirmAutoAdd')"
		:confirm-message="confirmMsg"
		@change="taskTemplateManagerStore.templateUpdateAutoAdd({taskTemplate})"
	/>
</template>

<script setup>
import {inject, computed} from 'vue';
import {t} from '@/utils/i18n';
import {useTaskTemplateManagerStore} from './taskTemplateManagerStore';
import TableCellSelect from '@/components/Table/TableCellSelect.vue';

const tableContext = inject('tableContext');
const taskTemplateManagerStore = useTaskTemplateManagerStore();

const props = defineProps({
	taskTemplate: {type: Object, required: true},
	stage: {type: Object, required: true},
});

const confirmMsg = computed(() =>
	props.taskTemplate?.include
		? t('taskTemplates.confirmAutoAddDisable', {
				stage: `<b>${props.stage.name}</b>`,
			})
		: t('taskTemplates.confirmAutoAddEnable', {
				stage: `<b>${props.stage.name}</b>`,
			}),
);

const labelIds = `template_name_${props.taskTemplate.id} ${tableContext.tableId}_${props.index}`;
</script>
