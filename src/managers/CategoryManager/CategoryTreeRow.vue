<template>
	<TableRow>
		<TableCell>
			<span
				class="my-0.5 items-center px-2"
				:class="{'font-bold': depth <= 2}"
				:style="{'padding-left': `${depth - 0.9}rem`}"
			>
				{{ category.localizedTitle }}
			</span>
		</TableCell>

		<TableCell>
			<span class="category__manager__assigendEditors">
				{{ category.assignedEditors.map((editor) => editor.name).join(', ') }}
			</span>
		</TableCell>

		<TableCell>
			<div
				class="category__manager__table_row_actions flex cursor-pointer justify-end gap-4"
			>
				<DropdownActions
					:label="t('common.moreActions')"
					button-variant="ellipsis"
					:actions="categoryManagerStore.getItemActions()"
					@action="
						(actionName) =>
							categoryManagerStore.handleItemAction(actionName, category)
					"
				/>
				<span
					v-if="category.subCategories?.length"
					@click="categoryManagerStore.toggleItemExpansion(category.id)"
				>
					<Icon
						:icon="
							categoryManagerStore.expanded.includes(category.id)
								? 'Dropup'
								: 'Dropdown'
						"
						class="h-6 w-6 text-primary"
					/>
				</span>
			</div>
		</TableCell>
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
import Icon from '@/components/Icon/Icon.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import CategoryTreeRow from '@/managers/CategoryManager/CategoryTreeRow.vue';
import {useCategoryManagerStore} from './categoryManagerStore.js';

const props = defineProps({
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
const categoryManagerStore = useCategoryManagerStore(props);
</script>
