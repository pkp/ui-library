<template>
	<fieldset class="pkpListPanel--selectReviewer" :class="classes">

		<!-- Header -->
		<pkp-header>
			<legend>{{ title }}</legend>
			<spinner v-if="isLoading" />
			<template slot="actions">
				<search
					:searchPhrase="searchPhrase"
					:searchLabel="i18n.search"
					:clearSearchLabel="i18n.clearSearch"
					@searchPhraseChanged="setSearchPhrase"
				/>
				<pkp-button
					:isActive="isSidebarVisible"
					icon="filter"
					:label="i18n.filter"
					@click="toggleSidebar"
				/>
			</template>
		</pkp-header>

		<!-- Optional description -->
		<notification v-if="description" type="info">
			{{ description }}
		</notification>

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
					<filter-slider
						v-for="(filter, index) in filterSet.filters"
						:key="index"
						v-bind="filter"
						:isFilterActive="Object.keys(activeFilters).includes(filter.param)"
						:isVisible="isSidebarVisible"
						:i18n="i18n"
						@add-filter="setFilter"
						@update-filter="setFilter"
						@remove-filter="removeParamFilters"
					/>
				</div>
			</div>

			<!-- Content -->
			<div class="pkpListPanel__content" aria-live="polite">

				<!-- Items -->
				<template v-if="items.length">
					<select-reviewer-list-item
						v-for="item in items"
						:currentlyAssigned="currentlyAssigned.includes(item.id)"
						:key="item.id"
						:item="item"
						:selected="selected"
						:selectorName="selectorName"
						:selectorType="selectorType"
						:warnOnAssignment="warnOnAssignment.includes(item.id)"
						:i18n="i18n"
						@update:selected="updateSelected"
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
	</fieldset>
</template>

<script>
import FilterSlider from '@/components/Filter/FilterSlider.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Notification from '@/components/Notification/Notification.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpButton from '@/components/Button/Button.vue';
import Search from '@/components/Search/Search.vue';
import SelectReviewerListItem from '@/components/ListPanel/users/SelectReviewerListItem.vue';

export default {
	extends: ListPanel,
	components: {
		FilterSlider,
		Notification,
		Pagination,
		PkpButton,
		Search,
		SelectReviewerListItem
	},
	props: {
		currentlyAssigned: {
			type: Array,
			default() {
				return [];
			}
		},
		warnOnAssignment: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		/**
		 * A wrapper for ListPanel::setFilter() which converts the
		 * slider filter values that are arrays [0, 20] into a string
		 * that is expected by the API "0-20".
		 *
		 * @param String param
		 * @param mixed value
		 */
		setFilter: function(param, value) {
			if (Array.isArray(value) && value.length === 2) {
				value = value.join('-');
			}
			ListPanel.methods.setFilter.apply(this, [param, value]);
		}
	},
	watch: {
		/**
		 * Broadcast the selected reviewer on the global
		 * event bus so that the reviewer selection form can
		 * retrieve the reviewer details.
		 */
		selected: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			const selectedReviewers = this.items.filter(
				item => this.selected === item.id
			);
			pkp.eventBus.$emit('reviewersSelected', selectedReviewers);
		}
	}
};
</script>
