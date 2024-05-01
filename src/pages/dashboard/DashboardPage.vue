<template>
	<div class="flex min-h-screen gap-8 text-base-normal">
		<div class="flex-none border-l border-r border-light">
			<DashboardViews
				:title="store.dashboardPageTitle"
				:icon="store.dashboardPageIcon"
				:dashboard-page="store.dashboardPage"
				:views="store.views"
				:current-view="store.currentView"
				@load-view="store.loadView"
			/>
		</div>
		<div class="flex-grow">
			<h2 class="flex items-center gap-4 py-6 text-5xl-bold">
				{{
					`${store.currentView.name} (${store.submissionsPagination.itemCount})`
				}}
			</h2>
			<div class="mt-2">
				<div class="flex justify-between">
					<PkpButton @click="store.openFiltersModal">
						{{ t('common.filter') }}
					</PkpButton>
					<div>
						<Search
							:search-phrase="searchPhrase"
							:search-label="t('editor.submission.search')"
							@search-phrase-changed="
								(...args) => store.setSearchPhrase(...args)
							"
						></Search>
					</div>
				</div>
			</div>
			<div class="mt-4">
				<ActiveFilters
					:active-filters-list="store.filtersFormList"
					@clear-filters="store.clearFiltersForm"
				/>
			</div>
			<div class="mt-4">
				<DashboardTable
					:items="store.submissions"
					:columns="store.columns"
					:sort-descriptor="store.sortDescriptor"
					:pagination="store.submissionsPagination"
					@sort-column="store.applySort"
					@set-page="store.setCurrentPage"
				/>
			</div>
		</div>
	</div>
</template>
<script setup>
import PkpButton from '@/components/Button/Button.vue';
import ActiveFilters from './components/ActiveFilters.vue';
import DashboardTable from './components/DashboardTable/DashboardTable.vue';
import DashboardViews from '@/pages/dashboard/components/DashboardViews.vue';
import Search from '@/components/Search/Search.vue';

import {useDashboardPageStore} from './dashboardPageStore';

const props = defineProps({
	dashboardPage: {
		required: true,
		type: String,
		validator: (prop) =>
			[
				'EDITORIAL_DASHBOARD',
				'MY_REVIEW_ASSIGNMENTS',
				'MY_SUBMISSIONS',
			].includes(prop),
	},
	/** Form for selection type of revision */
	selectRevisionDecisionForm: {type: Object, required: true},
	/** TODO */
	selectRevisionRecommendationForm: {type: Object, required: true},
	/** Grid url assigning participant */
	assignParticipantUrl: {
		type: String,
		required: true,
	},
	/** Grid url adding reviewer */
	addReviewerUrl: {
		type: String,
		required: true,
	},
	/** Grid url for resending request to reviewer */
	resendRequestReviewerUrl: {type: String, required: true},
	/** Grid url adding reviewer */
	unassignReviewerUrl: {
		type: String,
		required: true,
	},
	/** Grid url review details */
	reviewDetailsUrl: {
		type: String,
		required: true,
	},
	/** editReviewUrl */
	editReviewUrl: {
		type: String,
		required: true,
	},
	/** assignToIssueUrl */
	assignToIssueUrl: {
		type: String,
		required: true,
	},
	/** viewActivityLogUrl */
	viewActivityLogUrl: {
		type: String,
		required: true,
	},
	/** fileUploadWizardUrl */
	fileUploadWizardUrl: {
		type: String,
		required: true,
	},

	/** List of Views */
	views: {
		type: Array,
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

const store = useDashboardPageStore(props);
</script>

<style>
.pkp_page_dashboard .app__main {
	@apply bg-secondary p-0;
}
</style>
