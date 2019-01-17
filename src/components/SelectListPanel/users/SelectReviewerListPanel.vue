<template>
	<div class="pkpListPanel pkpListPanel--select pkpListPanel--selectReviewer">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">
				{{ i18n.title }}
				<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			</div>
			<ul class="pkpListPanel__actions">
				<li>
					<pkp-button
						:label="i18n.filter"
						icon="filter"
						:isActive="isFilterVisible"
						@click="toggleFilter"
					/>
				</li>
			</ul>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<list-panel-notice
				v-if="i18n.notice"
				:notice="i18n.notice"
				:type="noticeType"
			/>
			<select-reviewer-list-filter
				:isVisible="isFilterVisible"
				:activeFilters="activeFilters"
				:i18n="i18n"
				@filterList="updateFilter"
			/>
			<div class="pkpListPanel__content">
				<ul class="pkpListPanel__items" aria-live="polite">
					<select-reviewer-list-item
						v-for="item in items"
						:key="item.id"
						:item="item"
						:inputName="inputName"
						:inputType="inputType"
						:selected="selected"
						:currentlyAssigned="currentlyAssigned"
						:warnOnAssignment="warnOnAssignment"
						:i18n="i18n"
						@toggle="toggleItemSelection"
					/>
				</ul>
			</div>
		</div>
		<div class="pkpListPanel__footer -pkpClearfix">
			<list-panel-load-more
				v-if="canLoadMore"
				@loadMore="loadMore"
				:isLoading="isLoading"
				:i18n="i18n"
			/>
			<list-panel-count
				:count="itemCount"
				:total="this.itemsMax"
				:i18n="i18n"
			/>
		</div>
	</div>
</template>

<script>
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import ListPanelNotice from '@/components/ListPanel/ListPanelNotice.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import ListPanelCount from '@/components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from '@/components/ListPanel/ListPanelLoadMore.vue';
import SelectReviewerListFilter from '@/components/SelectListPanel/users/SelectReviewerListFilter.vue';
import SelectReviewerListItem from '@/components/SelectListPanel/users/SelectReviewerListItem.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	extends: SelectListPanel,
	name: 'SelectReviewerListPanel',
	components: {
		ListPanelNotice,
		ListPanelSearch,
		ListPanelCount,
		ListPanelLoadMore,
		SelectReviewerListFilter,
		SelectReviewerListItem,
		PkpButton
	},
	data: function() {
		return {
			activeFilters: {},
			currentlyAssigned: [],
			warnOnAssignment: []
		};
	},
	watch: {
		/**
		 * Broadcast the selected reviewer
		 */
		selected: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			const selectedReviewers = this.items.filter(item => {
				return this.selected.includes(item.id);
			});

			pkp.eventBus.$emit('reviewersSelected', selectedReviewers);
		}
	}
};
</script>
