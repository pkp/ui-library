<template>
	<div class="pkpListPanel--submissions" :class="classes">

		<!-- Header -->
		<pkp-header>
			{{ title }}
			<spinner v-if="isLoading" />
			<template slot="actions">
				<search
					:searchPhrase="searchPhrase"
					:searchLabel="i18n.search"
					:clearSearchLabel="i18n.clearSearch"
					@searchPhraseChanged="setSearchPhrase"
				/>
				<pkp-button
					v-if="currentUserCanFilter"
					:isActive="isSidebarVisible"
					icon="filter"
					:label="i18n.filter"
					@click="toggleSidebar"
				/>
				<pkp-button
					v-if="currentUserCanAddSubmission"
					element="a"
					:href="addUrl"
					:label="i18n.add"
				/>
			</template>
		</pkp-header>

		<!-- Body of the panel, including items and sidebar -->
		<div class="pkpListPanel__body -pkpClearfix">

			<!-- Filters in the sidebar -->
			<div v-if="filters.length" ref="sidebar" class="pkpListPanel__sidebar" :class="{'-isVisible': isSidebarVisible}">
				<pkp-header class="pkpListPanel__sidebarHeader">
					<icon icon="filter" :inline="true" />
					{{ i18n.filter }}
				</pkp-header>
				<div v-for="(filterSet, index) in filters" :key="index" class="pkpListPanel__filterSet">
					<pkp-header v-if="filterSet.heading">
						{{ filterSet.heading }}
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						:i18n="i18n"
						@add-filter="addSubmissionFilter"
						@remove-filter="removeFilter"
					/>
				</div>
			</div>

			<!-- Content -->
			<div class="pkpListPanel__content" aria-live="polite">

				<!-- Items -->
				<template v-if="items.length">
					<submissions-list-item
						v-for="item in items"
						:key="item.id"
						:item="item"
						:i18n="i18n"
						:apiUrl="apiUrl"
						:infoUrl="infoUrl"
						:assignParticipantUrl="assignParticipantUrl"
						:csrfToken="csrfToken"
						@addFilter="addFilter"
					/>
				</template>

				<!-- Loading indicator when loading and no items exist -->
				<div v-else-if="isLoading" class="pkpListPanel__empty">
					<spinner />
					{{ i18n.loading }}
				</div>

				<!-- Indicator when no items exist -->
				<div v-else class="pkpListPanel__empty">
					{{ i18n.empty }}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div v-if="lastPage > 1" class="pkpListPanel__footer">
			<pagination
				:currentPage="currentPage"
				:lastPage="lastPage"
				:i18n="i18n"
				@set-page="setPage"
			/>
		</div>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpButton from '@/components/Button/Button.vue';
import Search from '@/components/Search/Search.vue';
import SubmissionsListItem from '@/components/ListPanel/submissions/SubmissionsListItem.vue';
import SubmissionsListListeners from '@/mixins/ListPanel/submissions/listeners.js';

export default {
	extends: ListPanel,
	mixins: [SubmissionsListListeners],
	components: {
		Pagination,
		PkpButton,
		Search,
		SubmissionsListItem
	},
	props: {
		addUrl: {
			type: String,
			required: true
		},
		infoUrl: {
			type: String,
			required: true
		},
		assignParticipantUrl: {
			type: String,
			default() {
				return '';
			}
		},
		csrfToken: {
			type: String,
			required: true
		}
	},
	computed: {
		/**
		 * Can the current user filter the list?
		 */
		currentUserCanFilter: function() {
			return pkp.userHasRole([
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT
			]);
		},

		/**
		 * Does the current user have a role which can create a new submission?
		 */
		currentUserCanAddSubmission: function() {
			return pkp.userHasRole([
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
				pkp.const.ROLE_ID_AUTHOR
			]);
		}
	},
	methods: {
		/**
		 * Wrapper for ListPanel.addFilter which removes other filters when
		 * the isIncomplete filter is added, and removes the isIncomplete filter
		 * when other filters are added.
		 *
		 * @param String param
		 * @param mixed value
		 */
		addSubmissionFilter(param, value) {
			// Don't allow other filters to be active when the
			// isIncomplete filter is active
			if (param === 'isIncomplete') {
				this.activeFilters = {isIncomplete: [value]};
				this.get();
			} else {
				if (Object.keys(this.activeFilters).includes('isIncomplete')) {
					delete this.activeFilters.isIncomplete;
				}
				this.addFilter(param, value);
			}
		}
	}
};
</script>
