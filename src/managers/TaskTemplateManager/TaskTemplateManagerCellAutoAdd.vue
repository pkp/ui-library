<template>
	<TableCellSelect
		:checked="!!taskTemplate?.include"
		:confirm-title="t('taskTemplates.confirmAutoAdd')"
		:confirm-message="confirmMsg"
		@change="taskTemplateManagerStore.templateUpdateAutoAdd({taskTemplate})"
	/>
</template>

<script setup>
import {computed} from 'vue';
import {t} from '@/utils/i18n';
import {useTaskTemplateManagerStore} from './taskTemplateManagerStore';
import TableCellSelect from '@/components/Table/TableCellSelect.vue';

const taskTemplateManagerStore = useTaskTemplateManagerStore();

const props = defineProps({
	taskTemplate: {type: Object, required: true},
	stage: {type: Object, required: true},
	index: {type: Number, required: true},
});

const confirmMsg = computed(() =>
	props.taskTemplate?.include
		? t('taskTemplates.confirmAutoAddDisable', {
				stage: props.stage.name,
			})
		: t('taskTemplates.confirmAutoAddEnable', {
				stage: props.stage.name,
			}),
);
</script>
