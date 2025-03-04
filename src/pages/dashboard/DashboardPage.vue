<template>
	<div class="me-3 ms-5 min-h-screen text-base-normal">
		<div class="">
			<span>
				<h1 class="flex-inline items-center gap-4 py-6 text-5xl-bold">
					{{
						`${store.currentView.name} (${store.submissionsPagination.itemCount})`
					}}
					<span class="ms-3">
						<Spinner
							size-variant="big"
							:class="!store.isSubmissionsLoading ? 'invisible' : ''"
						/>
					</span>
				</h1>
			</span>

			<div class="mt-2">
				<div class="flex justify-between">
					<div class="flex flex-row items-center gap-x-3">
						<component
							:is="Components[action.component] || action.component"
							v-bind="action.props || {}"
							v-for="(action, i) in store.leftControlItems"
							:key="i"
						></component>
					</div>
					<div class="flex flex-row items-center gap-x-3">
						<component
							:is="Components[action.component] || action.component"
							v-bind="action.props || {}"
							v-for="(action, i) in store.rightControlItems"
							:key="i"
						></component>
					</div>
				</div>
			</div>
			<div class="mt-4">
				<DashboardActiveFilters
					:active-filters-list="store.filtersFormList"
					@clear-filters="store.clearFiltersForm"
					@remove-filter="store.clearFiltersFormField"
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
import DashboardActiveFilters from './components/DashboardActiveFilters.vue';
import DashboardTable from './components/DashboardTable/DashboardTable.vue';
import DashboardControlBulkActions from './components/DashboardControlBulkActions.vue';
import DashboardControlBulkDeleteButton from './components/DashboardControlBulkDeleteButton.vue';
import DashboardActionButton from './components/DashboardActionButton.vue';
import DashboardControlSearch from './components/DashboardControlSearch.vue';

import {useDashboardPageStore} from './dashboardPageStore';
import Spinner from '@/components/Spinner/Spinner.vue';

const Components = {
	DashboardControlBulkActions,
	DashboardControlBulkDeleteButton,
	DashboardActionButton,
	DashboardControlSearch,
};

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
	/** Form for selection type of revision for recommending editor */
	selectRevisionRecommendationForm: {type: Object, required: true},
	/** Forms used by managers or other components within dashboard/workflow */
	componentForms: {type: Object, required: true},
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
	/** context settings {supportsCitations, } */
	publicationSettings: {
		type: Object,
		required: true,
	},
});

const store = useDashboardPageStore(props);
</script>

<style>
.pkp_page_dashboard {
	@apply min-w-fit;
}

.pkp_page_dashboard .app__main {
	@apply bg-secondary p-0;
}
</style>
