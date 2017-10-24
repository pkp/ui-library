<template>
	<div class="pkpListPanel pkpListPanel--submissions" :class="classStatus">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">
				{{ i18n.title }}
				<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			</div>
			<ul class="pkpListPanel__actions">
				<li v-if="currentUserCanFilter">
					<button @click.prevent="toggleFilter" class="pkpButton" :class="{'-isActive': isFilterVisible}">
						<span class="fa fa-filter"></span>
						{{ i18n.filter }}
					</button>
				</li>
				<li v-if="currentUserCanAddSubmission">
					<a :href="addUrl" class="pkpButton">{{ i18n.add }}</a>
				</li>
			</ul>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<div class="pkpListPanel__body -pkpClearfix pkpListPanel__body--submissions">
			<select-list-panel-select-all
				v-if="showSelectAll"
				:label="i18n.selectAllLabel"
				:checked="selectAllChecked"
				@toggle="toggleSelectAll"
			/>
			<submissions-list-filter
				v-if="currentUserCanFilter"
				@filterList="updateFilter"
				:isVisible="isFilterVisible"
				:filters="filters"
				:activeFilters="activeFilters"
				:i18n="i18n"
			/>
			<div class="pkpListPanel__content pkpListPanel__content--submissions">
				<ul class="pkpListPanel__items" aria-live="polite">
					<submissions-list-item
						v-for="item in collection.items"
						@filterList="updateFilter"
						:key="item.id"
						:item="item"
						:i18n="i18n"
						:apiPath="apiPath"
						:infoUrl="infoUrl"
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
				:total="this.collection.maxItems"
				:i18n="i18n"
			/>
		</div>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import ListPanelCount from '@/components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from '@/components/ListPanel/ListPanelLoadMore.vue';
import SubmissionsListFilter from '@/components/ListPanel/submissions/SubmissionsListFilter.vue';
import SubmissionsListItem from '@/components/ListPanel/submissions/SubmissionsListItem.vue';
import SubmissionsListListeners from '@/mixins/ListPanel/submissions/listeners.js';

export default {
	extends: ListPanel,
	name: 'SubmissionsListPanel',
	mixins: [SubmissionsListListeners],
	components: {
		ListPanelSearch,
		ListPanelCount,
		ListPanelLoadMore,
		SubmissionsListFilter,
		SubmissionsListItem,
	},
	data: function () {
		return {
			addUrl: '',
			infoUrl: '',
		};
	},
	computed: {
		/**
		 * Can the current user filter the list?
		 */
		currentUserCanFilter: function () {
			return pkp.userHasRole(['manager', 'subeditor', 'assistant']);
		},

		/**
		 * Does the current user have a role which can create a new submission?
		 */
		currentUserCanAddSubmission: function () {
			return pkp.userHasRole(['manager', 'subeditor', 'assistant', 'author']);
		},
	},
};
</script>
