<template>
	<TableRow>
		<component
			:is="Components[column.component] || column.component"
			v-for="(column, i) in categoryManagerStore.columns"
			:key="i"
			:category="category"
			:depth="depth"
			v-bind="column.props"
		></component>
		<CategoryCellToggleSubCategories :category="category" :depth="depth" />
	</TableRow>

	<template
		v-if="
			category.subCategories?.length &&
			categoryManagerStore.expanded.includes(category.id)
		"
	>
		<CategoryTreeRow
			v-for="subCategory in category.subCategories"
			:key="subCategory.id"
			:category="subCategory"
			:depth="depth + 1"
		/>
	</template>
</template>
<script setup>
import TableRow from '@/components/Table/TableRow.vue';
import CategoryTreeRow from '@/managers/CategoryManager/CategoryTreeRow.vue';
import CategoryManagerCellName from './CategoryManagerCellName.vue';
import CategoryManagerCellAssignedTo from './CategoryManagerCellAssignedTo.vue';
import CategoryManagerCellMoreActions from './CategoryManagerCellMoreActions.vue';
import {useCategoryManagerStore} from './categoryManagerStore.js';
import CategoryCellToggleSubCategories from './CategoryCellToggleSubCategories.vue';

defineProps({
	/**
	 * The category object to display.
	 */
	category: {
		type: Object,
		required: true,
	},
	/**
	 * The depth of the category in the tree.
	 * Used for indentation.
	 */
	depth: {
		type: Number,
		default: 1,
		required: false,
	},
});

const Components = {
	CategoryManagerCellName,
	CategoryManagerCellAssignedTo,
	CategoryManagerCellMoreActions,
};
const categoryManagerStore = useCategoryManagerStore();
</script>
