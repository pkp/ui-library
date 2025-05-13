<template>
	<PkpTable>
		<template #label>{{ t('grid.category.categories') }}</template>
		<template #top-controls>
			<PkpButton @click="categoryManagerStore.categoryAdd">
				{{ t('grid.category.add') }}
			</PkpButton>
		</template>
		<TableHeader>
			<TableColumn v-for="(column, i) in categoryManagerStore.columns" :key="i">
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>

			<!-- Expand/Collapse column. Defined here so that it is always available as the last column. -->
			<TableColumn>
				<span class="sr-only">
					{{ t('manager.category.toggleSubcategories') }}
				</span>
			</TableColumn>
		</TableHeader>

		<TableBody>
			<CategoryTreeRow
				v-for="category in categoryManagerStore.categories"
				:key="category.id"
				:category="category"
			/>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import PkpButton from '@/components/Button/Button.vue';
import CategoryTreeRow from '@/managers/CategoryManager/CategoryTreeRow.vue';
import {useCategoryManagerStore} from '@/managers/CategoryManager/categoryManagerStore.js';

const props = defineProps({
	/**
	 * Category Form used to create/update categories.
	 */
	categoryForm: {
		type: Object,
		required: true,
	},
});

const categoryManagerStore = useCategoryManagerStore(props);
</script>
