<template>
	<div class="pkpListPanel pkpListPanel--submissions" :class="classStatus">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">
				{{ i18n.title }}
				<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			</div>
			<ul class="pkpListPanel__actions">
				<li v-if="currentUserCanFilter">
					<pkp-button
						:label="i18n.filter"
						icon="filter"
						:isActive="isFilterVisible"
						@click="toggleFilter"
					/>
				</li>
				<li v-if="currentUserCanAddSubmission">
					<pkp-button
						element="a"
						:href="addUrl"
						:label="i18n.add"
					/>
				</li>
			</ul>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<div class="pkpListPanel__body -pkpClearfix pkpListPanel__body--submissions">
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
						v-for="item in items"
						@filterList="updateFilter"
						:key="item.id"
						:item="item"
						:i18n="i18n"
						:apiPath="apiPath"
						:infoUrl="infoUrl"
						:assignParticipantUrl="assignParticipantUrl"
						:csrfToken="csrfToken"
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
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import ListPanelCount from '@/components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from '@/components/ListPanel/ListPanelLoadMore.vue';
import SubmissionsListFilter from '@/components/ListPanel/submissions/SubmissionsListFilter.vue';
import SubmissionsListItem from '@/components/ListPanel/submissions/SubmissionsListItem.vue';
import SubmissionsListListeners from '@/mixins/ListPanel/submissions/listeners.js';
import PkpButton from '@/components/Button/Button.vue';

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
		PkpButton,
	},
	data: function () {
		return {
			addUrl: '',
			infoUrl: '',
			assignParticipantUrl: '',
			csrfToken: '',
		};
	},
	computed: {
		/**
		 * Can the current user filter the list?
		 */
		currentUserCanFilter: function () {
			return pkp.userHasRole([pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SUB_EDITOR, pkp.const.ROLE_ID_ASSISTANT]);
		},

		/**
		 * Does the current user have a role which can create a new submission?
		 */
		currentUserCanAddSubmission: function () {
			return pkp.userHasRole([pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SUB_EDITOR, pkp.const.ROLE_ID_ASSISTANT, pkp.const.ROLE_ID_AUTHOR]);
		},
	},
};
</script>
