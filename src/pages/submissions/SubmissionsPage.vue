<template>
	<div class="grid grid-cols-[292px_auto] gap-8 bg-medium/30 text-base-normal">
		<DashboardViews
			:title="t('navigation.submissions')"
			:views="store.views"
			:current-view="store.currentView"
			@load-view="store.loadView"
		/>
		<div class="submissions__list">
			<SubmissionsHeader
				:current-view="store.currentView"
				:submissions-count="store.submissionsPagination.itemCount"
			/>
			<div class="mt-6">
				<SubmissionsTableControls
					:is-loading-submissions="store.isSubmissionsLoading"
					:active-filters-list="store.filtersFormList"
					:is-loading-page="isLoadingPage"
					:search-phrase="store.searchPhrase"
					@open-filters-modal="store.openFiltersModal"
					@clear-filters="store.clearFiltersForm"
					@search-phrase-changed="store.setSearchPhrase"
				/>
			</div>
			<div class="mt-4">
				<SubmissionsTable
					:submissions="store.submissions"
					:columns="store.columns"
					:sort-descriptor="store.sortDescriptor"
					:pagination="store.submissionsPagination"
					@sort-column="store.applySort"
					@set-page="store.setCurrentPage"
				/>
			</div>
		</div>
	</div>
	<SideModal
		:open="store.isModalOpenedSummary"
		@close="store.closeSummaryModal"
	>
		<SubmissionSummaryModal :summary-submission="store.summarySubmission" />
	</SideModal>
	<SideModal
		:open="store.isModalOpenedFilters"
		@close="store.closeFiltersModal"
	>
		<SubmissionsFiltersModal
			:filters-form-initial="store.filtersForm"
			@update-filters-form="store.updateFiltersForm"
		/>
	</SideModal>
	<SideModal
		:open="store.isModalOpenedAssignParticipant"
		@close="store.closeAssignParticipantModal"
	>
		<AssignEditorsModal />
	</SideModal>
</template>
<script setup>
import SubmissionsTable from '@/pages/submissions/SubmissionsTable.vue';
import DashboardViews from '@/pages/submissions/DashboardViews.vue';
import SubmissionsHeader from '@/pages/submissions/SubmissionsHeader.vue';
import SubmissionsTableControls from '@/pages/submissions/SubmissionsTableControls.vue';
import SubmissionSummaryModal from '@/pages/submissions/SubmissionSummaryModal.vue';
import SubmissionsFiltersModal from '@/pages/submissions/SubmissionsFiltersModal.vue';
import AssignEditorsModal from '@/pages/submissions/AssignEditorsModal.vue';

import SideModal from '@/components/Modal/SideModal.vue';
import {useSubmissionsPageStore} from './submissionsPageStore';

const props = defineProps({
	/** API url assigning participant */
	assignParticipantUrl: {
		type: String,
		required: true,
	},
	/** List of Views */
	views: {
		type: Array,
		required: true,
	},
	/** Initial view that should be selected*/
	currentViewId: {
		type: Number,
		required: true,
	},
	/** Filters form config  */
	filtersForm: {
		type: Object,
		required: true,
	},
	/** List of columns */
	columns: {
		type: Array,
		required: true,
	},
	/** How many submissions to show per page */
	countPerPage: {
		type: Number,
		required: true,
	},
});

const store = useSubmissionsPageStore(props);
</script>

<style>
.pkp_page_submissions .app__main {
	@apply bg-lightest p-0;
}
</style>
