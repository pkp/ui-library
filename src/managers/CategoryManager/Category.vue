<template>
	<div>
		<div class="min-h-screentext-base-normal me-3 ms-5 text-base-normal">
			<div class="">
				<div class="mt-2">
					<div class="flex justify-between">
						<div class="flex flex-row items-center gap-x-3 text-2xl-bold">
							<span>{{ t('manager.setup.categories') }}</span>
						</div>
						<div class="flex flex-row items-center gap-x-3">
							<template v-if="categoryManagerStore.isOrdering">
								<PkpButton
									:is-active="categoryManagerStore.isOrdering"
									:disabled="categoryManagerStore.isLoading"
									@click="categoryManagerStore.saveOrdering"
								>
									{{ t('common.saveOrdering') }}
								</PkpButton>
								<PkpButton
									:is-warnable="true"
									@click="categoryManagerStore.cancelOrdering"
								>
									{{ t('common.cancel') }}
								</PkpButton>
							</template>
							<template v-else>
								<PkpButton
									:disabled="
										categoryManagerStore.isLoading ||
										!categoryManagerStore.categories.length
									"
									@click="categoryManagerStore.initOrdering"
								>
									{{ t('common.order') }}
								</PkpButton>
								<PkpButton
									v-if="!categoryManagerStore.isOrdering"
									:disabled="categoryManagerStore.isLoading"
									@click="categoryManagerStore.handleItemAction('categoryAdd')"
								>
									{{ t('manager.categories.addCategory') }}
								</PkpButton>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
		<TreeRoot
			v-slot="{flattenItems}"
			class="bg-white text-stone-700 rounded-lg shadow-sm text-sm select-none list-none p-2 font-medium"
			:items="categoryManagerStore.categories"
			:get-key="(item) => item.id"
			:expanded="categoryManagerStore.expanded"
			:get-children="
				(item) => (item.subCategories ? item.subCategories : undefined)
			"
		>
			<PkpTable>
				<TableHeader>
					<TableColumn
						v-for="column in categoryManagerStore.columns"
						:id="column.name"
						:key="column.name"
					>
						{{ column.label }}
					</TableColumn>
					<TableColumn id="empty-action-column"></TableColumn>
				</TableHeader>

				<TableBody>
					<TableRow
						v-for="item in flattenItems"
						:key="item.key"
						class="category__table_row"
					>
						<TableCell>
							<!-- Only allow ordering on top level parent categories -->
							<Orderer
								v-if="categoryManagerStore.isOrdering && !item.value.parentId"
								:item-id="item.value.id"
								:item-title="item.value.title[primaryLocale]"
								:is-draggable="false"
								@up="categoryManagerStore.itemOrderUp(item.value)"
								@down="categoryManagerStore.itemOrderDown(item.value)"
							/>
							<TreeItem
								v-slot="{}"
								:key="item._id"
								:style="{'padding-left': `${item.level - 0.9}rem`}"
								v-bind="item.bind"
								class="my-0.5 items-center px-2"
								:class="{'font-bold': item.level <= 2}"
							>
								<div class="bg-blue-100 py-1 pl-2">
									{{ item.value.title[primaryLocale] }}
								</div>
							</TreeItem>
						</TableCell>

						<TableCell>
							<span>
								{{
									item.value.assignedEditors
										.map((editor) => editor.name)
										.join(', ')
								}}
							</span>
						</TableCell>
						<TableCell :style="{'padding-right': `${item.level + 1}rem`}">
							<div class="flex cursor-pointer justify-end gap-4">
								<DropdownActions
									:label="t('common.moreActions')"
									button-variant="ellipsis"
									:actions="categoryManagerStore.getItemActions()"
									@action="
										(actionName) =>
											categoryManagerStore.handleItemAction(
												actionName,
												item.value,
											)
									"
								/>
								<span
									v-if="item.hasChildren"
									@click="
										categoryManagerStore.toggleItemExpansion(item.value.id)
									"
								>
									<Icon
										:icon="
											categoryManagerStore.expanded.includes(item.value.id)
												? 'Dropup'
												: 'Dropdown'
										"
										class="h-6 w-6 text-primary"
									/>
								</span>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		</TreeRoot>
	</div>
</template>

<script setup>
import {TreeItem, TreeRoot} from 'reka-ui';
import Icon from '@/components/Icon/Icon.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useCategoryManagerStore} from './categoryManagerStore.js';
import PkpButton from '@/components/Button/Button.vue';
import Orderer from '@/components/Orderer/Orderer.vue';

const props = defineProps({
	/**
	 * An Array of category objects to display.
	 * Each object should contain
	 * - `title` (string, required): The title of the category.
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
					typeof category.title === 'string' && category.title.trim() !== '';
				const hasId = typeof category.id === 'number' && category.id > 0;
				const hasPath =
					typeof category.path === 'string' && category.path.trim() !== '';

				return hasTitle && hasId && hasPath;
			});
		},
	},
	apiUrl: {
		type: String,
		required: true,
	},
	primaryLocale: {
		type: String,
		required: true,
	},
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

<style lang="less">
.category__table_row {
	//td {
	.orderer__dragDrop,
	.orderer__up,
	.orderer__down {
		width: 4em;
		top: unset;
		height: 1.5rem;
	}

	.orderer__up {
		right: 4em;
	}
	//}
}
</style>
