<template>
	<div>
		<div class="min-h-screentext-base-normal me-3 ms-5 text-base-normal">
			<div class="">
				<div class="mt-2">
					<div class="flex justify-between">
						<div class="flex flex-row items-center gap-x-3 text-2xl-bold">
							<span>Categories</span>
						</div>
						<div class="flex flex-row items-center gap-x-3">
							<PkpButton>Order</PkpButton>
							<PkpButton
								@click="categoryManagerStore.handleItemAction('categoryAdd')"
							>
								Add Category
							</PkpButton>
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
					<TableRow v-for="item in flattenItems" :key="item.key">
						<TableCell>
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

						<TableCell>{{ !item.parentId ? 'TBD' : '' }}</TableCell>
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

// import CategoryTree from './CategoryTree.vue';
// import PkpHeader from '@/components/Header/Header.vue';
import PkpButton from '@/components/Button/Button.vue';
// import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps({
	categories: {
		type: Array,
		required: true,
		// TODO validate this prop
		validator: (value) => {
			return true;
		},
	},
	apiUrl: {
		type: String,
		default: '',
		required: true,
	},
	primaryLocale: {
		type: String,
		required: true,
	},
	columns: {
		// todo: validate this prop
		type: Array,
		required: true,
	},
	/**
	 * Empty Category Form used when creating new categories. However, this form is not used for editing a category.
	 * Instead, the form for editing will be fetched from API with firm fields populated.
	 **/
	categoryForm: {
		type: Object,
		required: true,
	},
});

const categoryManagerStore = useCategoryManagerStore(props);
</script>
