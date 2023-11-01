import {defineStore} from 'pinia';
import {fetch} from '@/utils/fetch';
import {useDialogStore} from '@/stores/dialogStore';
import {useAnnouncerStore} from '@/stores/announcerStore';

/**
 * The allowed values for the direction of sorting
 */
const sortDirections = ['descending', 'ascending', 'none'];

export const useSubmissionsStore = defineStore('submissions', {
	state: () => {
		return {
			views: [],
			submissions: [],
			currentViewId: null,
			countPerPage: 0,
			submissionsCount: 0,
			apiUrl: null,
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
			filtersForm: null,
		};
	},
	getters: {
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

		/**
		 * The number of pages available
		 *
		 * @return {Number}
		 */
		lastPage() {
			return Math.ceil(this.submissionsCount / this.countPerPage);
		},

		/**
		 * A localized string with a count of the submissions being viewed
		 *
		 * eg - Showing 1 to 30 of 170
		 */
		showingXofX() {
			return this.t('common.showingXofX', {
				start: this.offset + 1,
				finish: Math.min(
					this.offset + this.countPerPage,
					this.submissionsCount,
				),
				total: this.submissionsCount,
			});
		},
	},
	// could also be defined as
	// state: () => ({ count: 0 })
	actions: {
		init(initStoreData) {
			this.views = initStoreData.views;
			this.columns = initStoreData.columns;
			this.submissions = initStoreData.submissions;
			this.currentViewId = initStoreData.currentViewId;
			this.submissionsCount = initStoreData.submissionsCount;
			this.apiUrl = initStoreData.apiUrl;
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
			const dialogStore = useDialogStore();
			const announcerStore = useAnnouncerStore();

			this.isLoadingSubmissions = true;
			announcerStore.set(this.t('common.loading'));

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
				data = await fetch(
					Object.hasOwn(this.currentView, 'op')
						? this.apiUrl + '/' + this.currentView.op
						: this.apiUrl,
					{query, queueName: 'submissions'},
				);
				this.submissions = data.items;
				this.submissionsCount = data.itemsMax;
				announcerStore.set(this.t('common.loaded'));
			} catch (e) {
				// aborted by subsequent request
				if (e.aborted === true) {
					return null;
				}

				dialogStore.openDialogNetworkError(e);
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
	},
});
