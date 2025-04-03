<template>
	<div class="category__manager">
		<div class="mt-2">
			<div class="flex justify-between">
				<div class="flex flex-row items-center gap-x-3 text-2xl-bold">
					<span>{{ t('manager.setup.categories') }}</span>
				</div>
				<div class="flex flex-row items-center gap-x-3">
					<template v-if="categoryManagerStore.isOrdering">
						<PkpButton
							class="category__manager__saveOrder"
							:is-active="categoryManagerStore.isOrdering"
							:disabled="categoryManagerStore.isLoading"
							@click="categoryManagerStore.saveOrdering"
						>
							{{ t('common.saveOrdering') }}
						</PkpButton>
						<PkpButton
							class="category__manager__cancelOrder"
							:is-warnable="true"
							@click="categoryManagerStore.cancelOrdering"
						>
							{{ t('common.cancel') }}
						</PkpButton>
					</template>
					<template v-else>
						<PkpButton
							class="category__manager__order"
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
							class="category__manager__addCategory"
							:disabled="categoryManagerStore.isLoading"
							@click="categoryManagerStore.handleItemAction('categoryAdd')"
						>
							{{ t('manager.category.add') }}
						</PkpButton>
					</template>
				</div>
			</div>
		</div>

		<!--Reka UI Tree component: https://reka-ui.com/docs/components/tree-->
		<TreeRoot
			v-slot="{flattenItems}"
			class="pt-2"
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
					<TableColumn class="empty__action__column"></TableColumn>
				</TableHeader>

				<TableBody>
					<TableRow
						v-for="item in flattenItems"
						:key="item.key"
						class="category__manager__table_row"
					>
						<TableCell>
							<TreeItem
								:key="item.value.id"
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
							<span class="category__manager__assigendEditors">
								{{
									item.value.assignedEditors
										.map((editor) => editor.name)
										.join(', ')
								}}
							</span>
						</TableCell>
						<TableCell :style="{'padding-right': `${item.level + 1}rem`}">
							<template
								v-if="categoryManagerStore.isOrdering && !item.value.parentId"
							>
								<Orderer
									:item-id="item.value.id"
									:item-title="item.value.title[primaryLocale]"
									:is-draggable="false"
									@up="categoryManagerStore.itemOrderUp(item.value)"
									@down="categoryManagerStore.itemOrderDown(item.value)"
								/>
							</template>
							<template v-if="!categoryManagerStore.isOrdering">
								<div
									class="category__manager__table_row_actions flex cursor-pointer justify-end gap-4"
								>
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
							</template>
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
	 * - `title` (object, required): The title of the category, by locale.
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
	 * The locale to use when displaying multilingual text.
	 */
	primaryLocale: {
		type: String,
		required: true,
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

<style lang="less">
.category__manager__table_row {
	.orderer__up,
	.orderer__down {
		top: unset;
		height: 1.5rem;
	}

	.orderer__up {
		right: 6rem;
	}

	.orderer__down {
		right: 2.5rem;
	}
}
</style>
