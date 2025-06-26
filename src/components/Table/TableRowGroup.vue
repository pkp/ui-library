<template>
	<slot />
	<tr v-if="isGroupEmpty">
		<TableCell
			:colspan="tableContext.columnsCount.value"
			padding-variant="spacious"
		>
			<slot v-if="slots['no-group-content']" name="no-group-content" />
			<span v-else>{{ emptyText }}</span>
		</TableCell>
	</tr>
</template>

<script setup>
import {computed, inject, onMounted, provide, useId, useSlots} from 'vue';
import {t} from '@/utils/i18n';
import TableCell from './TableCell.vue';

const groupId = useId();
const slots = useSlots();

const tableContext = inject('tableContext');

// Group is empty if it only has the header row
const isGroupEmpty = computed(
	() => tableContext.getGroupRowCount(groupId) === 1,
);

const props = defineProps({
	emptyText: {type: String, default: ''},
});

const emptyText = computed(() => {
	return props.emptyText || t('grid.noItems');
});

onMounted(() => {
	tableContext?.markHasGroups();
});

provide('groupId', groupId);
</script>
