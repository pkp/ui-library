<template>
	<TableCell>
		<div
			class="flex justify-end"
			:style="{'padding-inline-end': `${depth + 0.5}rem`}"
		>
			<DropdownActions
				:label="t('common.moreActions')"
				button-variant="ellipsis"
				:actions="itemActions"
				@action="(actionName) => categoryManagerStore[actionName](category)"
			/>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useCategoryManagerStore} from '@/managers/CategoryManager/categoryManagerStore.js';
import {computed} from 'vue';

const props = defineProps({
	category: {type: Object, required: true},
	depth: {type: Number, default: 0},
});
const categoryManagerStore = useCategoryManagerStore();

const itemActions = computed(() =>
	categoryManagerStore.getItemActions({category: props.category}),
);
</script>
