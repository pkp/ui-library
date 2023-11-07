<template>
	<div class="submissions">
		<SubmissionsViews
			:views="views"
			:current-view="currentView"
			@load-view="loadView"
		/>
		<div class="submissions__list">
			<SubmissionsHeader
				:current-view="currentView"
				:submissions-count="submissionsCount"
			/>
			<SubmissionsTableControls
				:is-loading-submissions="isLoadingSubmissions"
				:search-phrase="searchPhrase"
				:active-filters-list="activeFiltersList"
				:is-loading-page="isLoadingPage"
				@open-filters-modal="openFiltersModal"
				@clear-filters="clearFilters"
				@search-phrase-changed="setSearchPhrase"
			/>
			<SubmissionsTable
				:submissions="submissions"
				:columns="columns"
				:sort-column="sortColumn"
				:submissions-count="submissionsCount"
				:count-per-page="countPerPage"
				:offset="offset"
				:current-page="currentPage"
			/>
		</div>
	</div>
	<SideModal :open="isModalOpenedSummary" @close="closeSummaryModal">
		<SubmissionSummaryModal :summary-submission="summarySubmission" />
	</SideModal>
	<SideModal
		close-label="Close"
		:open="isModalOpenedFilters"
		@close="closeFiltersModal"
	>
		<SubmissionsFiltersModal
			:filters-form="filtersForm"
			@set="setFiltersForm"
			@success="saveFilters"
		/>
	</SideModal>
	<SideModal close-label="Close" :open="false">
		<AssignEditorsModal />
	</SideModal>
</template>
<script type="text/javascript">
// store
import SubmissionsTable from '@/pages/submissions/SubmissionsTable.vue';
import SubmissionsViews from '@/pages/submissions/SubmissionsViews.vue';
import SubmissionsHeader from '@/pages/submissions/SubmissionsHeader.vue';
import SubmissionsTableControls from '@/pages/submissions/SubmissionsTableControls.vue';
import SubmissionSummaryModal from '@/pages/submissions/SubmissionSummaryModal.vue';
import SubmissionsFiltersModal from '@/pages/submissions/SubmissionsFiltersModal.vue';
import AssignEditorsModal from '@/pages/submissions/AssignEditorsModal.vue';

import SideModal from '@/components/Modal/SideModal.vue';
import ajaxError from '@/mixins/ajaxError';
import routeQueryParams from '@/mixins/routeQueryParams';

import localizeSubmission from '@/mixins/localizeSubmission.js';

const sortDirections = ['descending', 'ascending', 'none'];

import {pkpFetch} from '@/utils/pkpFetch';

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
	components: {
		SubmissionsTable,
		SubmissionsViews,
		SubmissionsHeader,
		SubmissionsTableControls,
		SubmissionSummaryModal,
		SideModal,
		SubmissionsFiltersModal,
		AssignEditorsModal,
	},
	mixins: [ajaxError, localizeSubmission, routeQueryParams],

	provide() {
		return {
			pageComponent: this,
		};
	},
	props: {
		storeData: Object,
	},
	data() {
		return {
			views: [],
			submissions: [],
			currentViewId: null,
			countPerPage: 0,
			submissionsCount: 0,
			apiUrl: null,
			assignParticipantUrl: null,
			isLoadingPage: false,
			isLoadingSubmissions: false,
			sortColumn: '',
			sortDirection: '',
			searchPhrase: '',
			offset: 0,
			activeFilters: {},
			summarySubmission: null,
			isModalOpenedFilters: false,
			isModalOpenedSummary: false,
			isModalOpenedAssignEditors: false,
			filtersForm: null,
		};
	},
	computed: {
		/**
		 * The activeFilters reproduced as an array of individual
		 * filters to show to the user
		 *
		 * @return {Array}
		 */
		activeFiltersList() {
			let list = [];
			for (const key in this.activeFilters) {
				const field = this.getFiltersField(key);
				if (!field) {
					return;
				}
				switch (field.component) {
					case 'field-options':
						this.activeFilters[key].forEach((value) => {
							const option = field.options.find(
								(option) => option.value === value,
							);
							list.push({
								queryParam: key,
								queryValue: option.value,
								name: field.label,
								value: option.label,
							});
						});
						break;
				}
			}
			return list;
		},
		/**
		 * The current page of results being viewed
		 *
		 * @return {Number}
		 */
		currentPage() {
			return Math.floor(this.offset / this.countPerPage) + 1;
		},

		/**
		 * The selected view of submissions
		 *
		 * eg - Assigned to me
		 *
		 * @return {Object}
		 */
		currentView() {
			return this.views.find((view) => view.id === this.currentViewId);
		},
	},
	created() {
		this.init(this.storeData);
	},
	methods: {
		init(initStoreData) {
			this.views = initStoreData.views;
			this.columns = initStoreData.columns;
			this.submissions = initStoreData.submissions;
			this.currentViewId = initStoreData.currentViewId;
			this.submissionsCount = initStoreData.submissionsCount;
			this.apiUrl = initStoreData.apiUrl;
			this.assignParticipantUrl = initStoreData.assignParticipantUrl;
			this.countPerPage = initStoreData.countPerPage;
			this.filtersForm = initStoreData.filtersForm;
		},
		increment() {
			this.count++;
		},
		/**
		 * Remove all active filters
		 */
		clearFilters() {
			this.activeFilters = {};
			this.get();
		},

		/**
		 * Get a view by it's id
		 *
		 * @param {String} id The id of the view to get
		 */
		findView(id) {
			return this.views.find((view) => view.id === id);
		},

		/**
		 * Get submissions matching the current request params
		 *
		 * @param {Function} cb A callback function to fire when successful
		 */
		async get() {
			//const dialogStore = useDialogStore();
			//const announcerStore = useAnnouncerStore();

			console.log('GET');
			this.isLoadingSubmissions = true;
			this.$announcer.set(this.t('common.loading'));

			let query = {
				...this.currentView.queryParams,
				...this.activeFilters,
				count: this.countPerPage,
				offset: this.offset,
			};

			if (this.sortColumn && this.sortDirection !== 'none') {
				query.orderBy = this.sortColumn;
				query.orderDirection =
					this.sortDirection === 'descending' ? 'DESC' : 'ASC';
			}

			if (this.searchPhrase) {
				query.searchPhrase = this.searchPhrase;
			}
			let data = null;
			try {
				data = await pkpFetch(
					Object.hasOwn(this.currentView, 'op')
						? this.apiUrl + '/' + this.currentView.op
						: this.apiUrl,
					{query, queueName: 'submissions'},
				);
				console.log(data);
				this.submissions = data.items;
				this.submissionsCount = data.itemsMax;
				this.$announcer.set(this.t('common.loaded'));
			} catch (e) {
				// aborted by subsequent request
				if (e.aborted === true) {
					return null;
				}
				// TODO
				//dialogStore.openDialogNetworkError(e);
			}

			this.isLoadingSubmissions = false;
			return data;
		},

		/**
		 * Get a field in the filters form
		 *
		 * @param {String} name The field's name
		 * @return {Object} The object which describes the field
		 */
		getFiltersField(name) {
			return this.filtersForm.fields.find((field) => field.name === name);
		},

		/**
		 * Open one of the pre-set views
		 */
		async loadView(view) {
			console.log('load view');
			this.activeFilters = {};
			this.currentViewId = view.id;
			this.offset = 0;
			this.searchPhrase = '';
			const data = await this.get();
			if (data.itemsMax) {
				this.findView(view.id).count = data.itemsMax;
			}
		},

		/**
		 * Load a modal displaying the assign participant options
		 */
		openAssignParticipant(submission) {
			var opts = {
				title: this.t('submission.list.assignEditor'),
				url: this.assignParticipantUrl
					.replace('__id__', submission.id)
					.replace('__stageId__', submission.stageId),
				closeCallback: () => {
					this.resetFocusToList();
				},
			};

			$(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabIndex="-1"></div>',
			).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);
		},

		/**
		 * Open the panel to select filters
		 */
		openFiltersModal() {
			this.isModalOpenedFilters = true;
		},

		closeFiltersModal() {
			this.isModalOpenedFilters = false;
		},

		openAssignEditorsModal() {
			this.isModalOpenedAssignEditors = true;
		},

		closeAssignEditorsModal() {
			this.isModalOpenedAssignEditors = false;
		},

		/**
		 * Open the submission summary panel
		 */
		openSummaryModal(submission) {
			this.summarySubmission = submission;
			this.isModalOpenedSummary = true;
		},

		closeSummaryModal() {
			console.log('close summary modal');
			//this.summarySubmission = null;
			this.isModalOpenedSummary = false;
		},

		/**
		 * Fired when the filters form is saved
		 */
		async saveFilters(data) {
			this.activeFilters = Object.fromEntries(
				Object.entries(data).filter(([key, value]) => {
					return (Array.isArray(value) && value.length) || !!value;
				}),
			);
			await this.get();
			this.closeFiltersModal();
		},

		/**
		 * Sync changes to the filter form's state data
		 *
		 * Fired when a field in the form changes
		 */
		setFiltersForm(id, data) {
			console.log('SET Filters form:', JSON.stringify(data, null, 2));
			this.filtersForm = {
				...this.filtersForm,
				...data,
			};
		},

		/**
		 * Change the current page
		 */
		async setPage(page) {
			this.isLoadingPage = true;
			this.offset = this.countPerPage * (page - 1);
			await this.get();
			this.isLoadingPage = false;
		},

		/**
		 * Set the search phrase
		 */
		setSearchPhrase(value) {
			if (this.searchPhrase == value) {
				return;
			}
			this.searchPhrase = value;
			this.offset = 0;
			this.get();
		},

		/**
		 * Sort the list by a column
		 */
		sort(column) {
			if (column === this.sortColumn) {
				const i = sortDirections.findIndex((dir) => dir === this.sortDirection);
				this.sortDirection =
					i + 1 === sortDirections.length
						? sortDirections[0]
						: sortDirections[i + 1];
			} else {
				this.sortColumn = column;
				this.sortDirection = sortDirections[0];
			}
			this.get();
		},

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
