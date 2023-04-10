<template>
	<div class="submissionsListPanel">
		<table-panel
			:isSidebarVisible="isSidebarVisible"
			:items="items"
			class="listPanel--submissions"
		>
			<pkp-header slot="header">
				<h2>{{ title }}</h2>
				<spinner v-if="isLoading" />
				<template slot="actions">
					<search
						:searchPhrase="searchPhrase"
						@search-phrase-changed="setSearchPhrase"
					/>
					<pkp-button
						:isActive="isSidebarVisible"
						@click="isSidebarVisible = !isSidebarVisible"
					>
						<icon icon="filter" :inline="true" />
						{{ __('common.filter') }}
					</pkp-button>
					<pkp-button
						v-if="addUrl && currentUserCanAddSubmission"
						element="a"
						:href="addUrl"
					>
						{{ __('submission.submit.newSubmissionSingle') }}
					</pkp-button>
				</template>
			</pkp-header>

			<template slot="sidebar">
				<pkp-header :isOneLine="false">
					<h3>
						<icon icon="filter" :inline="true" />
						{{ __('common.filter') }}
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
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						:is="filter.filterType || 'pkp-filter'"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
						@update-filter="addFilter"
					/>
				</div>
			</template>

			<template slot="itemsEmpty">
				<template v-if="isLoading">
					<spinner />
					{{ __('common.loading') }}
				</template>
				<template v-else>
					{{ __('submission.list.empty') }}
				</template>
			</template>
			<template slot="myTable">
				<pkp-table
					labelled-by="publicationDetailTableLabel"
					:columns="tableColumns"
					:rows="items"
					:order-by="orderBy"
					:order-direction="orderDirection"
					@order-by="setOrderBy"
				>
					<template slot-scope="{row, rowIndex}">
						<submission-table-cell
							v-for="(column, columnIndex) in tableColumns"
							:key="column.name"
							:column="column"
							:row="row"
							:item="row"
							:tabindex="!rowIndex && !columnIndex ? 0 : -1"
							:apiUrl="apiUrl"
							:infoUrl="infoUrl"
							:assignParticipantUrl="assignParticipantUrl"
							:getParticipantsApiUrl="getParticipantsApiUrl"
							:openSubmissionsInANewTab="openSubmissionsInANewTab"
							@addFilter="addFilter"
						></submission-table-cell>
					</template>
				</pkp-table>
			</template>

			<pagination
				v-if="lastPage > 1"
				slot="footer"
				:currentPage="currentPage"
				:isLoading="isLoading"
				:lastPage="lastPage"
				@set-page="setPage"
			/>
		</table-panel>
	</div>
</template>

<script>
import TablePanel from '@/components/Panel/TablePanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import PkpFilterSlider from '@/components/Filter/FilterSlider.vue';
import PkpFilterAutosuggest from '@/components/Filter/FilterAutosuggest.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import fetch from '@/mixins/fetch';
import PkpTable from '@/components/Table/Table.vue';
import SubmissionTableCell from '@/components/Table/SubmissionTableCell.vue';

export default {
	name: 'SubmissionsTablePanel',
	mixins: [fetch],
	components: {
		TablePanel,
		Pagination,
		PkpFilter,
		PkpFilterSlider,
		PkpFilterAutosuggest,
		PkpHeader,
		Search,
		PkpTable,
		SubmissionTableCell
	},
	props: {
		addUrl: {
			type: String,
			required: true
		},
		assignParticipantUrl: {
			type: String,
			default() {
				return '';
			}
		},
		filters: {
			type: Array,
			default() {
				return [];
			}
		},
		id: {
			type: String,
			required: true
		},
		infoUrl: {
			type: String,
			required: true
		},
		getParticipantsApiUrl: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			default() {
				return [];
			}
		},
		itemsMax: {
			type: Number,
			defaut() {
				return 0;
			}
		},
		title: {
			type: String,
			required: true
		},
		allowSubmissions: {
			type: Boolean,
			default() {
				return true;
			}
		},
		tableColumns: {
			type: Array,
			default() {
				return [];
			}
		},
		orderBy: {
			type: String,
			default() {
				return '';
			}
		},
		orderDirection: {
			type: Boolean,
			default() {
				return false;
			}
		},
		openSubmissionsInANewTab: {
			type: Boolean,
			required: true
		},
		offset: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			isSidebarVisible: false
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
				pkp.const.ROLE_ID_ASSISTANT
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
					pkp.const.ROLE_ID_REVIEWER
				])
			);
		}
	},
	methods: {
		/**
		 * The params to send with each GET request
		 *
		 * @param string
		 * @return Object
		 */
		getParams2() {
			let params = {
				...this.activeFilters
			};

			if (this.searchPhrase) {
				params.searchPhrase = this.searchPhrase;
			}

			if (this.orderBy) {
				params.orderBy = this.orderBy;
				params.orderDirection = this.orderDirection ? 'DESC' : 'ASC';
			}
			return params;
		},
		/**
		 * Get the list of items from the server based on the current params
		 */
		getItems() {
			let self = this;

			this.isLoadingItems = true;
			this.latestItemsGetRequest = $.pkp.classes.Helper.uuid();

			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				data: this.getParams2(),
				_uuid: this.latestItemsGetRequest,
				error(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.setItems(r.items, r.itemsMax);
				},
				complete(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.isLoadingItems = false;
				}
			});
		},

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
				if (newFilters.hasOwnProperty('isIncomplete')) {
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
						'assignedTo'
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
					'assignedTo'
				].includes(param)
			) {
				delete newFilters[param];
			} else {
				newFilters[param] = newFilters[param].filter(v => v !== value);
			}
			this.activeFilters = newFilters;
		},

		/**
		 * Update the list of items
		 *
		 * @param array items
		 * @param int itemsMax
		 */
		setItems(items, itemsMax) {
			this.$emit('set', this.id, {
				items,
				itemsMax
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
			roles.forEach(role => {
				if (pkp.currentUser.roles.indexOf(role) > -1) {
					hasRole = true;
				}
			});

			return hasRole;
		},
		/**
		 * Set the orderBy and orderDirection values
		 *
		 * @param string orderBy What param to order by
		 * @param boolean orderDirection true = DESC, false = ASC
		 */
		setOrderBy(orderBy, orderDirection) {
		this.$emit('set', this.id, {
				orderBy,
				orderDirection
			});
		}
	},
	mounted() {
		/**
		 * Refresh the list when a submission is updated
		 */
		pkp.eventBus.$on('updated:submission', () => this.get());

		/**
		 * Remove a submission from the list when it is deleted
		 */
		pkp.eventBus.$on('deleted:submission', data => {
			if (
				!data.id ||
				!this.items.find(submission => submission.id === data.id)
			) {
				return;
			}
			this.setItems(
				this.items.filter((item) => {
					return data.id !== item.id;
				}),
				this.itemsMax - 1
			);
		});
	},
	watch: {
		orderBy(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			let offset = 0;
			this.$emit('set', this.id, {
				offset
			});
			this.getItems();
		},
		orderDirection(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			let offset = 0;
			this.$emit('set', this.id, {
				offset
			});
			this.getItems();
		}
	},
	destroyed() {
		pkp.eventBus.$off('updated:submission');
		pkp.eventBus.$off('deleted:submission');
	}
};
</script>

<style lang="less">
.width {
	max-width: 100% !important;
}
</style>
