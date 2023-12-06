<template>
	<div class="submissions">
		<SubmissionsViews
			:views="store.views"
			:current-view="store.currentView"
			@load-view="store.loadView"
		/>
		<div class="submissions__list">
			<SubmissionsHeader
				:current-view="store.currentView"
				:submissions-count="store.submissionsPagination.itemCount"
			/>
			<SubmissionsTableControls
				:is-loading-submissions="store.isSubmissionsLoading"
				:active-filters-list="store.filtersFormList"
				:is-loading-page="isLoadingPage"
				:search-phrase="store.searchPhrase"
				@open-filters-modal="store.openFiltersModal"
				@clear-filters="store.clearFiltersForm"
				@search-phrase-changed="store.setSearchPhrase"
			/>
			<SubmissionsTable
				:submissions="store.submissions"
				:columns="store.columns"
				:sort-column="store.sortColumnId"
				:sort-direction="store.sortDirection"
				:pagination="store.submissionsPagination"
				@sort-column="store.applySort"
			/>
		</div>
	</div>
	<SideModal
		:open="store.isModalOpenedSummary"
		@close="store.closeSummaryModal"
	>
		<SubmissionSummaryModal :summary-submission="store.summarySubmission" />
	</SideModal>
	<SideModal
		close-label="Close"
		:open="store.isModalOpenedFilters"
		@close="store.closeFiltersModal"
	>
		<SubmissionsFiltersModal
			:filters-form-initial="store.filtersForm"
			@update-filters-form="store.updateFiltersForm"
		/>
	</SideModal>
	<SideModal
		close-label="Close"
		:open="store.isModalOpenedAssignParticipant"
		@close="store.closeAssignParticipantModal"
	>
		<AssignEditorsModal />
	</SideModal>
</template>
<script setup>
import {onUnmounted} from 'vue';
// store
import SubmissionsTable from '@/pages/submissions/SubmissionsTable.vue';
import SubmissionsViews from '@/pages/submissions/SubmissionsViews.vue';
import SubmissionsHeader from '@/pages/submissions/SubmissionsHeader.vue';
import SubmissionsTableControls from '@/pages/submissions/SubmissionsTableControls.vue';
import SubmissionSummaryModal from '@/pages/submissions/SubmissionSummaryModal.vue';
import SubmissionsFiltersModal from '@/pages/submissions/SubmissionsFiltersModal.vue';
import AssignEditorsModal from '@/pages/submissions/AssignEditorsModal.vue';

import SideModal from '@/components/Modal/SideModal.vue';
import {
	useSubmissionsPageStore,
	initSubmissionsPageStore,
	disposeSubmissionsPageStore,
} from './submissionsPageStore';

/** TODO rename to pageInitConfig */
const props = defineProps({storeData: {required: true, type: Object}});
initSubmissionsPageStore(props.storeData);
const store = useSubmissionsPageStore();

onUnmounted(() => {
	disposeSubmissionsPageStore();
});
</script>

<style lang="less">
/** TODO to be migrated to tailwindcss */
@import '../../styles/_import';

.pkp_page_submissions .app__main {
	background: @lift;
	padding: 0 1rem 0 0;
}

.submissions {
	display: grid;
	grid-template-columns: 292px auto;
	gap: 2rem;
}

.submissions__views,
.submissions__list {
	padding-top: 2rem;
}

.submissions__views {
	justify-self: stretch;
	border-inline-end: @bg-border-light;
}

.submissions__views__title {
	margin: 0 1rem;
	font-size: @font-base;
	line-height: 1.2em;
	text-transform: uppercase;
}

.submissions__views__list {
	margin: 2rem 0 0;
	padding: 0;
	list-style: none;
	font-size: @font-sml;
	line-height: @line-sml;
}

.submissions__view__button {
	display: flex;
	width: 100%;
	align-items: center;
	gap: 0.75rem;
	border: none;
	background: transparent;
	padding: 0.75rem 1rem;

	&:hover {
		background: @bg-very-light;
	}

	&:focus-visible {
		outline: 1px solid @primary;
	}
}

.submissions__view__count {
	display: inline-block;
	text-align: center;
	height: 1.5rem;
	line-height: 1.5rem;
	min-width: 1.5rem;
	padding-left: 0.4em;
	padding-right: 0.4em;
	outline: 1px solid;
	font-size: @font-tiny;
	border-radius: 1rem;
	font-weight: @normal;
}

.submissions__view__button--current {
	background: @primary;
	color: @lift;

	&:hover {
		background: @primary;
	}
}

.submissions__list__top {
	display: flex;
	flex-direction: row-reverse;
}

.submissions__list__title {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.submissions__list__controls {
	margin-bottom: 0.5rem;
}

.submissions__list__filters {
	display: flex;
	gap: 0.25em;
	align-items: center;
}

.submissions__list__item__title {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	max-width: 25em;
}

.submissions__list__item__author {
	font-weight: @semibold;
}

.submissions__list__item__stage {
	font-size: @font-tiny;
	line-height: @line-tiny;
}

.submissions__list__item__view {
	white-space: nowrap;
}

.submissions__list__footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem 0;
	font-size: @font-sml;
}
</style>
