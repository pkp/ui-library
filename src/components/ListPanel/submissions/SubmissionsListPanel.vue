<template>
	<div class="submissionsListPanel">
		<list-panel
			:is-sidebar-visible="isSidebarVisible"
			:items="items"
			class="listPanel--submissions"
		>
			<template #header>
				<pkp-header>
					<h2>{{ title }}</h2>
					<spinner v-if="isLoading" />
					<template #actions>
						<search
							:search-phrase="searchPhrase"
							@search-phrase-changed="setSearchPhrase"
						/>
						<pkp-button
							:is-active="isSidebarVisible"
							@click="isSidebarVisible = !isSidebarVisible"
						>
							<icon icon="filter" :inline="true" />
							{{ t('common.filter') }}
						</pkp-button>
						<pkp-button
							v-if="addUrl && currentUserCanAddSubmission"
							element="a"
							:href="addUrl"
						>
							{{ t('submission.submit.newSubmissionSingle') }}
						</pkp-button>
					</template>
				</pkp-header>
			</template>
			<template #sidebar>
				<pkp-header :is-one-line="false">
					<h3>
						<icon icon="filter" :inline="true" />
						{{ t('common.filter') }}
					</h3>
				</pkp-header>
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="listPanel__block"
				>
					<pkp-header v-if="filterSet.heading">
						<h4>{{ filterSet.heading }}</h4>
					</pkp-header>
					<component
						:is="filter.filterType || 'pkp-filter'"
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
						@update-filter="addFilter"
					/>
				</div>
			</template>

			<template #itemsEmpty>
				<template v-if="isLoading">
					<spinner />
					{{ t('common.loading') }}
				</template>
				<template v-else>
					{{ t('submission.list.empty') }}
				</template>
			</template>

			<template #item="{item}">
				<slot name="item" :item="item">
					<submissions-list-item
						:key="item.id"
						:item="item"
						:api-url="apiUrl"
						:info-url="infoUrl"
						:assign-participant-url="assignParticipantUrl"
						@addFilter="addFilter"
					/>
				</slot>
			</template>
			<template #footer>
				<pagination
					v-if="lastPage > 1"
					:current-page="currentPage"
					:is-loading="isLoading"
					:last-page="lastPage"
					@set-page="setPage"
				/>
			</template>
		</list-panel>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import PkpFilterSlider from '@/components/Filter/FilterSlider.vue';
import PkpFilterAutosuggest from '@/components/Filter/FilterAutosuggest.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import SubmissionsListItem from '@/components/ListPanel/submissions/SubmissionsListItem.vue';
import fetch from '@/mixins/fetch';

export default {
	components: {
		ListPanel,
		Pagination,
		PkpFilter,
		PkpFilterSlider,
		PkpFilterAutosuggest,
		PkpHeader,
		Search,
		SubmissionsListItem,
	},
	mixins: [fetch],
	props: {
		addUrl: {
			type: String,
			required: true,
		},
		allowSubmissions: {
			type: Boolean,
			default() {
				return true;
			},
		},
		assignParticipantUrl: {
			type: String,
			default() {
				return '';
			},
		},
		filters: {
			type: Array,
			default() {
				return [];
			},
		},
		id: {
			type: String,
			required: true,
		},
		infoUrl: {
			type: String,
			required: true,
		},
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		itemsMax: {
			type: Number,
			defaut() {
				return 0;
			},
		},
		title: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			isSidebarVisible: false,
		};
	},
	computed: {
		/**
		 * Can the current user filter the list?
		 */
		currentUserCanFilter() {
			return this.userHasRole([
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
			]);
		},

		/**
		 * Does the current user have a role which can create a new submission?
		 */
		currentUserCanAddSubmission() {
			return (
				this.allowSubmissions &&
				this.userHasRole([
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_ASSISTANT,
					pkp.const.ROLE_ID_AUTHOR,
					pkp.const.ROLE_ID_REVIEWER,
				])
			);
		},
	},
	mounted() {
		/**
		 * Refresh the list when a submission is updated
		 */
		pkp.eventBus.$on('updated:submission', () => this.get());

		/**
		 * Remove a submission from the list when it is deleted
		 */
		pkp.eventBus.$on('deleted:submission', (data) => {
			if (
				!data.id ||
				!this.items.find((submission) => submission.id === data.id)
			) {
				return;
			}
			this.setItems(
				this.items.filter((item) => {
					return data.id !== item.id;
				}),
				this.itemsMax - 1,
			);
		});
	},
	unmounted() {
		pkp.eventBus.$off('updated:submission');
		pkp.eventBus.$off('deleted:submission');
	},
	methods: {
		/**
		 * Add a filter
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		addFilter(param, value) {
			// Don't allow other filters to be active when the
			// isIncomplete filter is active
			if (param === 'isIncomplete') {
				this.activeFilters = {isIncomplete: value};
				this.get();
			} else {
				let newFilters = {...this.activeFilters};
				if (Object.prototype.hasOwnProperty.call(newFilters, 'isIncomplete')) {
					delete newFilters.isIncomplete;
				}
				if (
					[
						'isOverdue',
						'daysInactive',
						'assignedTo',
						'issueIds',
						'sectionIds',
						'categoryIds',
						'assignedTo',
					].includes(param)
				) {
					newFilters[param] = value;
				} else {
					if (!newFilters[param]) {
						newFilters[param] = [];
					}
					newFilters[param].push(value);
				}
				this.activeFilters = newFilters;
			}
		},

		/**
		 * Is a filter currently active?
		 *
		 * @param {string} param The filter param
		 * @param {mixed} value The filter value
		 * @return {Boolean}
		 */
		isFilterActive(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return false;
			} else if (Array.isArray(this.activeFilters[param])) {
				return this.activeFilters[param].includes(value);
			} else if (['isOverdue', 'daysInactive'].includes(param)) {
				return true;
			} else {
				return this.activeFilters[param] === value;
			}
		},

		/**
		 * Remove a filter
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		removeFilter(param, value) {
			let newFilters = {...this.activeFilters};
			if (
				[
					'isIncomplete',
					'isOverdue',
					'daysInactive',
					'issueIds',
					'sectionIds',
					'categoryIds',
					'assignedTo',
				].includes(param)
			) {
				delete newFilters[param];
			} else {
				newFilters[param] = newFilters[param].filter((v) => v !== value);
			}
			this.activeFilters = newFilters;
		},

		/**
		 * Update the list of items
		 *
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			this.$emit('set', this.id, {
				items,
				itemsMax,
			});
		},

		/**
		 * Helper function to determine if the current user has a role
		 *
		 * @param int|array roles The role ID to look for (pkp.const.ROLE_ID...)
		 * @return bool
		 */
		userHasRole(roles) {
			if (!Array.isArray(roles)) {
				roles = [roles];
			}

			var hasRole = false;
			roles.forEach((role) => {
				if (pkp.currentUser.roles.indexOf(role) > -1) {
					hasRole = true;
				}
			});

			return hasRole;
		},
	},
};
</script>
