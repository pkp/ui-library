import {ref, computed, watch} from 'vue';
import ListPanel from './ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import Expander from '@/components/Expander/Expander.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import Search from '@/components/Search/Search.vue';

import ItemsMock from './mocks/items.js';
import './ListPanel.stories.less';
export default {
	title: 'ListPanel/ListPanel',
	component: ListPanel,
};

export const Base = {
	render: (args) => ({
		components: {ListPanel},
		setup() {
			return {args};
		},
		template: `
			<ListPanel v-bind="args" />
		`,
	}),

	args: {items: [...ItemsMock], title: 'List Panel'},
};

export const WithActions = {
	render: (args) => ({
		components: {ListPanel, PkpHeader},
		setup() {
			return {args};
		},
		template: `
			<ListPanel v-bind="args">
				<template #header>
					<PkpHeader>
						<h2>List Panel with Actions</h2>
						<template #actions>
							<PkpButton @click="openModal">Add Item</PkpButton>
							<PkpButton :is-warnable="true" @click="openModal">
								Reset Defaults
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
			</ListPanel>
		`,
	}),

	args: {items: [...ItemsMock]},
};

export const WithDescription = {
	render: (args) => ({
		components: {ListPanel, PkpHeader},
		setup() {
			return {args};
		},
		template: `
			<ListPanel v-bind="args" class="previewListPanelDescription">
				<template #header>
					<PkpHeader>
						<h2>ListPanel with Description</h2>
					</PkpHeader>
					<p>
						This is an example of description text that can be displayed with the
						panel. This is an example of description text that can be displayed with
						the panel.
					</p>
				</template>
			</ListPanel>
		`,
	}),

	args: {items: [...ItemsMock]},
};

export const WithNoItems = {
	render: (args) => ({
		components: {ListPanel},
		setup() {
			return {args};
		},
		template: `
			<ListPanel v-bind="args"  />
		`,
	}),

	args: {items: [], title: 'ListPanel with No Items'},
};

export const WithFilter = {
	render: (args) => ({
		components: {ListPanel, PkpHeader, PkpFilter},
		setup() {
			const activeFilters = ref({});
			const colorFilters = ref([
				{
					param: 'color',
					title: 'Red',
					value: 'red',
				},
				{
					param: 'color',
					title: 'Green',
					value: 'green',
				},
				{
					param: 'color',
					title: 'Blue',
					value: 'blue',
				},
			]);
			const isSidebarVisible = ref(false);

			function toggleFilters() {
				isSidebarVisible.value = !isSidebarVisible.value;
			}

			function addFilter(param, value) {
				activeFilters.value[param] = value;
			}
			function removeFilter(param, value) {
				delete activeFilters.value[param];
			}
			function isFilterActive(param, value) {
				if (!Object.keys(activeFilters.value).includes(param)) {
					return false;
				}
				if (Array.isArray(activeFilters.value[param])) {
					return activeFilters[param].value.includes(value);
				}
				return activeFilters.value[param] === value;
			}

			const items = ref([...ItemsMock]);

			return {
				activeFilters,
				colorFilters,
				isSidebarVisible,
				toggleFilters,
				addFilter,
				removeFilter,
				isFilterActive,
				items,
			};
		},
		template: `
			<ListPanel :items="items" :is-sidebar-visible="isSidebarVisible" >
				<template #header>
					<PkpHeader>
						<h2>List Panel with Filter</h2>
						<template #actions>
							<PkpButton :is-active="isSidebarVisible" @click="toggleFilters">
								<Icon icon="Filter" class="h-4 w-4" :inline="true" />
								Filters
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #sidebar>
					<PkpHeader :is-one-line="false">
						<h3>
							<Icon icon="Filter" class="h-4 w-4" :inline="true" />
							Filters
						</h3>
					</PkpHeader>
					<PkpFilter
						v-for="filter in colorFilters"
						:key="filter.value"
						:param="filter.param"
						:title="filter.title"
						:value="filter.value"
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</template>
			</ListPanel>
		`,
	}),

	args: {},
};

export const WithItemActions = {
	render: (args) => ({
		components: {ListPanel},
		setup() {
			function openModal(title) {
				alert('You opened a modal for ' + title + '.');
			}

			return {args, openModal};
		},
		template: `
			<ListPanel v-bind="args">
				<template #item-actions="{item}">
					<PkpButton @click="openModal(item.title)">Edit</PkpButton>
					<PkpButton :is-warnable="true" @click="openModal(item.title)">
						Delete
					</PkpButton>
				</template>
			</ListPanel>
		`,
	}),

	args: {items: [...ItemsMock], title: 'List Panel with Item Actions'},
};

export const WithExpandableItem = {
	render: (args) => ({
		components: {ListPanel, Expander, List, ListItem},
		setup() {
			function openModal(title) {
				alert('Edit ' + title);
			}
			function toggleExpanded(id) {
				if (args.expanded.includes(id)) {
					args.expanded = args.expanded.filter((k) => k !== id);
				} else {
					args.expanded.push(id);
				}
			}
			return {args, openModal, toggleExpanded};
		},
		template: `
			<ListPanel v-bind="args">
				<template #item-actions="{item}">
					<PkpButton @click="openModal(item.title)">Edit</PkpButton>
					<Expander
						:is-expanded="args.expanded.includes(item.id)"
						:item-name="item.title"
						@toggle="toggleExpanded(item.id)"
					/>
				</template>
				<template #item-expanded="{item}">
					<List>
						<ListItem>Ut enim ad minim veniam, quis nostrud</ListItem>
						<ListItem>
							Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
						</ListItem>
					</List>
					<div class="listPanel__itemExpandedActions">
						<PkpButton @click="openModal(item.title)">Approve</PkpButton>
						<PkpButton :is-warnable="true" @click="openModal(item.title)">
							Decline
						</PkpButton>
					</div>
				</template>
			</ListPanel>
		`,
	}),

	args: {
		items: [...ItemsMock],
		title: 'List Panel with Item Expander',
		expanded: [],
	},
};

export const WithPagination = {
	render: (args) => ({
		components: {ListPanel, Pagination},
		setup() {
			let manyItems = [];
			for (let i = 1; i < 31; i++) {
				const item = ItemsMock[i % 3];
				manyItems.push({
					id: i,
					title: item.title + ' ' + i,
					subtitle: item.subtitle,
				});
			}

			const allItems = ref(manyItems);
			const count = ref(5);
			const isLoading = ref(false);
			const items = ref(manyItems.slice(0, 5));
			const itemsMax = ref(manyItems.length);
			const offset = ref(0);

			const currentPage = computed(
				() => Math.floor(offset.value / count.value) + 1,
			);
			const lastPage = computed(() => Math.ceil(itemsMax.value / count.value));

			function setPage(page) {
				// Mock a delay for a remote request
				isLoading.value = true;
				setTimeout(() => {
					offset.value = page * count.value - count.value;
					items.value = allItems.value.slice(
						offset.value,
						count.value + offset.value,
					);
					isLoading.value = false;
				}, 1000);
			}

			return {
				allItems,
				count,
				isLoading,
				items,
				itemsMax,
				offset,
				args,
				currentPage,
				lastPage,
				setPage,
			};
		},
		template: `
			<ListPanel v-bind="args">
				<template #footer>
					<Pagination
						v-if="lastPage > 1"
						:current-page="currentPage"
						:is-loading="isLoading"
						:last-page="lastPage"
						@set-page="setPage"
					/>
				</template>
			</ListPanel>
		`,
	}),

	args: {
		items: [...ItemsMock],
		title: 'List Panel with Pagination',
		expanded: [],
	},
};

export const WithSearch = {
	render: (args) => ({
		components: {ListPanel, Search, PkpHeader},
		setup() {
			const items = ref([...ItemsMock]);
			const originalItems = ref([...ItemsMock]);
			const searchPhrase = ref('');

			/**
			 * Normally you would send the search request to the server
			 */
			function setSearchPhrase(_searchPhrase) {
				searchPhrase.value = _searchPhrase;
				if (!searchPhrase.value.length) {
					items.value = [...originalItems.value];
				} else {
					items.value = originalItems.value.filter((item) => {
						return (
							new RegExp(_searchPhrase, 'i').test(item.title) ||
							new RegExp(_searchPhrase, 'i').test(item.subtitle)
						);
					});
				}
			}

			return {args, items, originalItems, searchPhrase, setSearchPhrase};
		},
		template: `
			<ListPanel :items="items">
				<template #header>
					<PkpHeader>
						<h2>List Panel with Search</h2>
						<template #actions>
							<Search
								:search-phrase="searchPhrase"
								@search-phrase-changed="setSearchPhrase"
							/>
						</template>
					</PkpHeader>
				</template>
			</ListPanel>
		`,
	}),

	args: {
		items: [...ItemsMock],
		title: 'List Panel with Item Expander',
		expanded: [],
	},
};

export const WithSelect = {
	render: (args) => ({
		components: {ListPanel, PkpHeader},
		setup() {
			const id = 'previewListPanelSelect';
			const canSelectAll = ref(true);
			const isSelectAllOn = ref(false);
			const items = ref([...ItemsMock]);
			const selected = ref([]);

			watch(selected, (newVal, oldVal) => {
				isSelectAllOn.value =
					selected.value.length && selected.value.length === items.value.length;
			});

			function toggleSelectAll() {
				if (isSelectAllOn.value) {
					selected.value = [];
				} else {
					selected.value = items.value.map((i) => i.id);
				}
			}

			return {
				args,
				items,
				id,
				canSelectAll,
				selected,
				isSelectAllOn,
				toggleSelectAll,
			};
		},
		template: `
			<fieldset class="previewListPanelSelect">
				<legend class="-screenReader">List Panel with Select</legend>
				<ListPanel :items="items">
					<template #header>
						<PkpHeader>
							<h2>List Panel with Select</h2>
						</PkpHeader>
						<div v-if="canSelectAll" class="listPanel__selectAllWrapper">
							<input
								:id="id + '-selectAll'"
								type="checkbox"
								:checked="isSelectAllOn"
								@click="toggleSelectAll"
							/>
							<label class="listPanel__selectAllLabel" :for="id + '-selectAll'">
								Select All
							</label>
						</div>
					</template>
					<template #item="{item}">
						<div class="listPanel__itemSummary">
							<label class="listPanel__selectWrapper">
								<div class="listPanel__selector">
									<input
										v-model="selected"
										type="checkbox"
										name="submissions[]"
										:value="item.id"
									/>
								</div>
								<div class="listPanel__itemIdentity">
									<div class="listPanel__itemTitle">
										{{ item.title }}
									</div>
									<div class="listPanel__itemSubTitle">
										{{ item.subtitle }}
									</div>
								</div>
							</label>
						</div>
					</template>
				</ListPanel>
			</fieldset>
		`,
	}),
};
