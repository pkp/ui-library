<template>
	<template v-for="item in items" :key="item.identifier">
		<TableRow>
			<component
				:is="Components[column.component] || column.component"
				v-for="(column, i) in store.columns"
				:key="i"
				:item="item"
				:depth="depth"
			/>
			<TableCellTreeExpand
				:is-displayed="item?.items?.length"
				:is-expanded="store.expandedIds.includes(item.identifier)"
				@toggle="store.toggleItemExpansion(item.identifier)"
			></TableCellTreeExpand>
		</TableRow>
		<VocabularyTableRows
			v-if="item?.items?.length && store.expandedIds.includes(item.identifier)"
			:items="item.items"
			:depth="depth + 1"
		/>
	</template>
</template>

<script setup>
import TableRow from '@/components/Table/TableRow.vue';
import TableCellTreeExpand from '@/components/Table/TableCellTreeExpand.vue';
import VocabularyModalCellName from './VocabularyModalCellName.vue';
import {useVocabularyModalStore} from './vocabularyModalStore';

defineProps({
	depth: {type: Number, default: 0},
	items: {type: Array, default: () => []},
});

const Components = {VocabularyModalCellName};

const store = useVocabularyModalStore();
</script>
