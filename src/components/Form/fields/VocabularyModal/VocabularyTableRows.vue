<template>
	<template v-for="item in items" :key="item.identifier">
		<TableRow>
			<TableCell>
				<label
					v-if="depth > 0"
					:style="{'padding-inline-start': `${depth + 0.5}rem`}"
					class="flex items-center gap-x-2"
				>
					<input
						type="checkbox"
						:checked="selectedItemIds.includes(item.identifier)"
						@change="emit('toggleItemSelection', item)"
					/>
					<span>{{ item.name }}</span>
				</label>
				<span v-else :class="{'text-base-bold': depth === 0}">
					{{ item.name }}
				</span>
			</TableCell>
			<TableCell>
				<div
					class="flex justify-center"
					:style="{'padding-inline-start': `${depth + 0.5}rem`}"
				>
					<Icon
						v-if="item?.items?.length"
						class="h-6 w-6 cursor-pointer text-primary"
						:icon="
							expandedIds.includes(item.identifier) ? 'Dropup' : 'Dropdown'
						"
						@click="emit('toggleItemExpansion', item.identifier)"
					/>
				</div>
			</TableCell>
		</TableRow>
		<VocabularyTableRows
			v-if="item?.items?.length && expandedIds.includes(item.identifier)"
			:items="item.items"
			:depth="depth + 1"
			:expanded-ids="expandedIds"
			:selected-item-ids="selectedItemIds"
			@toggle-item-expansion="(...args) => emit('toggleItemExpansion', ...args)"
			@toggle-item-selection="(...args) => emit('toggleItemSelection', ...args)"
		/>
	</template>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import TableRow from '@/components/Table/TableRow.vue';
import Icon from '@/components/Icon/Icon.vue';

defineProps({
	depth: {type: Number, default: 0},
	items: {type: Array, default: () => []},
	expandedIds: {type: Array, default: () => []},
	selectedItemIds: {type: Array, default: () => []},
});

const emit = defineEmits(['toggleItemExpansion', 'toggleItemSelection']);
</script>
