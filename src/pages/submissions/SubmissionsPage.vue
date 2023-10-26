<template>
	<div class="submissions">
		<SubmissionsViews />
		<div class="submissions__list">
			<div class="submissions__list__top">
				<pkp-button element="a" href="{url page='submission'}">
					{{ t('manager.newSubmission') }}
				</pkp-button>
			</div>
			<h2 class="submissions__list__title" id="table-title">
				{{ $store.submissions.currentView.name }}
				<span class="submissions__view__count">
					{{ $store.submissions.submissionsCount }}
				</span>
			</h2>
			<div id="table-controls" class="submissions__list__controls">
				<ButtonRow>
					<template #end>
						<pkp-button @click="openFilters">
							{{ t('common.filter') }}
						</pkp-button>
						<span v-if="$store.submissions.isLoadingSubmissions">
							<spinner></spinner>
							{{ t('common.loading') }}
						</span>
					</template>
					<Search
						:search-phrase="searchPhrase"
						:search-label="t('editor.submission.search')"
						@search-phrase-changed="setSearchPhrase"
					></Search>
				</ButtonRow>
				<div
					v-if="$store.submissions.activeFiltersList.length"
					class="submissions__list__filters"
				>
					<Badge
						v-for="filter in $store.submissions.activeFiltersList"
						:key="filter.name + filter.value"
					>
						<strong>{{ filter.name }}:</strong>
						{{ filter.value }}
					</Badge>
					<pkpButton :is-warnable="true" :is-link="true" @click="clearFilters">
						{{ t('common.filtersClear') }}
					</pkpButton>
				</div>
			</div>
			<SubmissionsTable />
		</div>
	</div>
	<!--<side-modal
        v-if="summarySubmission"    
        close-label="Close"
        name="summary"
        type="side"
        :open="isModalOpenedSummary"
        @close="isModalOpenedSummary = false"
    >
            {include file="dashboard/summary.tpl"}
    </side-modal>
    <side-modal
        close-label="Close"
        :open="isModalOpenedFilters"
        @close="isModalOpenedFilters = false"
    >
        <template #header>
            <h2>
                {translate key="common.filter"}
            </h2>
        </template>
        <panel>
            <panel-section>
                <pkp-form
                    v-bind="filtersForm"
                    @set="setFiltersForm"
                    @success="saveFilters"
                ></pkp-form>
            </panel-section>
        </panel>
    </side-modal>-->
</template>
<script type="text/javascript">
// store
import {useSubmissionsStore} from '@/pages/submissions/submissionsStore.js';
import SubmissionsTable from '@/pages/submissions/SubmissionsTable.vue';
import SubmissionsViews from '@/pages/submissions/SubmissionsViews.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';

//import SideModal from '@/components/Modal/SideModal.vue';
import Search from '@/components/Search/Search.vue';
import ajaxError from '@/mixins/ajaxError';
import localizeSubmission from '@/mixins/localizeSubmission.js';

/**
 * A unique ID for the most recent request for submissions
 *
 * This is used to fix issues where the user makes a second request
 * for submissions before their first request is returned. The ID can
 * be used to discard responses for outdated requests.
 */
//let lastRequest;

export default {
	name: 'SubmissionsPage',
	mixins: [ajaxError, localizeSubmission],
	components: {
		ButtonRow,
		//SideModal,
		Search,
		SubmissionsTable,
		SubmissionsViews,
	},
	props: {
		storeData: Object,
	},
	data() {
		return {};
	},
	computed: {},
	mounted() {},
	created() {
		this.$store.submissions = useSubmissionsStore(this.$pinia);
		console.log('hi', this.storeData, this);
		this.$store.submissions.init(this.storeData);
	},
	methods: {
		//created() {
		/**
		 * Set the current view to the first available
		 * view when the page is loaded
		 */
		/*if (!this.currentViewId) {
			this.currentViewId = this.views[0].id;
		}*/
		//},
	},
};
</script>

<style lang="less">
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
