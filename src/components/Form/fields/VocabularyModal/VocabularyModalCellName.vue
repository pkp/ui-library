<template>
	<TableCell>
		<label
			v-if="item.selectable"
			:style="{'padding-inline-start': `${depth + 0.5}rem`}"
			class="flex items-center gap-x-2"
			:class="{'text-base-bold': depth === 0}"
		>
			<input
				type="checkbox"
				:checked="vocabularymodalStore.isSelected(item)"
				@change="vocabularymodalStore.toggleItemSelection(item)"
			/>
			<span>{{ item.label }}</span>
		</label>
		<span
			v-else
			:class="{'text-base-bold': depth === 0}"
			:style="{'padding-inline-start': `${depth + 0.5}rem`}"
		>
			{{ item.label }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useVocabularyModalStore} from './vocabularyModalStore';

defineProps({
	item: {
		type: Object,
		required: true,
	},
	depth: {
		type: Number,
		required: true,
	},
});

const vocabularymodalStore = useVocabularyModalStore();
</script>
