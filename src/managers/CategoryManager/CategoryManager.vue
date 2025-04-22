<template>
	<div class="category__manager">
		<div class="mt-2">
			<div class="flex justify-between">
				<div class="flex flex-row items-center gap-x-3 text-2xl-bold">
					<span>{{ t('grid.category.categories') }}</span>
				</div>
				<div class="flex flex-row items-center gap-x-3">
					<PkpButton
						class="category__manager__addCategory"
						:disabled="categoryManagerStore.isLoading"
						@click="categoryManagerStore.handleItemAction('categoryAdd')"
					>
						{{ t('grid.category.add') }}
					</PkpButton>
				</div>
			</div>
		</div>

		<PkpTable>
			<TableHeader>
				<TableColumn
					v-for="column in categoryManagerStore.columns"
					:id="column.name"
					:key="column.name"
				>
					{{ column.label }}
				</TableColumn>
				<TableColumn class="empty__action__column"></TableColumn>
			</TableHeader>

			<TableBody>
				<CategoryTreeRow
					v-for="category in categoryManagerStore.categories"
					:key="category.id"
					:category="category"
				/>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import {useCategoryManagerStore} from './categoryManagerStore.js';
import PkpButton from '@/components/Button/Button.vue';
import CategoryTreeRow from '@/managers/CategoryManager/CategoryTreeRow.vue';

const props = defineProps({
	/**
	 * An Array of category objects to display.
	 * Each object should contain
	 * - `title` (object, required): The title of the category, by locale.
	 * - `localizedTitle` (string, required): The localized title of the category.
	 * - `id` (number, required): Unique category ID.
	 * - `path` (string, required): The path identifier for the category
	 * - `assignedEditors` (array, optional): Editorial users assigned to category.
	 * - `subCategories` (array, optional): Array of categories that the category is a parent of.
	 */
	categories: {
		type: Array,
		required: true,
		validator: (categories) => {
			return categories.every((category) => {
				const hasTitle =
					typeof category.title === 'object' &&
					Object.keys(category.title).length;
				const hasId = typeof category.id === 'number' && category.id > 0;
				const hasPath =
					typeof category.path === 'string' && category.path.trim() !== '';

				return hasTitle && hasId && hasPath;
			});
		},
	},
	/**
	 * An array of objects representing columns in the table displayed in this component.
	 */
	columns: {
		type: Array,
		required: true,
	},
	/**
	 * Empty Category Form used when creating new categories. However, this form is not used for editing a category.
	 * Instead, the form for editing will be fetched from API with form fields populated.
	 **/
	categoryForm: {
		type: Object,
		required: true,
	},
});

const categoryManagerStore = useCategoryManagerStore(props);
</script>
