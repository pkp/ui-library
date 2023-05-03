<script type="text/javascript">
import Page from './Page.vue';
import ButtonRow from '../ButtonRow/ButtonRow.vue';
import Modal from '../Modal/Modal.vue';
import Pagination from '../Pagination/Pagination.vue';
import Search from '../Search/Search.vue';
import StageBubble from '../StageBubble/StageBubble.vue';
import PkpTable from '../Table/Table.vue';
import TableCell from '../Table/TableCell.vue';
import TableHeader from '../Table/TableHeader.vue';
import ajaxError from '@/mixins/ajaxError';
import localizeSubmission from '@/mixins/localizeSubmission.js';
import {v4 as uuidv4} from 'uuid';

/**
 * Track the previously focused element before
 * an action occured.
 *
 * Used to reset focus after a modal or similar
 * popup is closed.
 */
let lastFocusedEl;

/**
 * A unique ID for the most recent request for submissions
 *
 * This is used to fix issues where the user makes a second request
 * for submissions before their first request is returned. The ID can
 * be used to discard responses for outdated requests.
 */
let lastRequest;

/**
 * The allowed values for the direction of sorting
 */
const sortDirections = ['descending', 'ascending', 'none'];

export default {
	name: 'SubmissionsPage',
	extends: Page,
	mixins: [ajaxError, localizeSubmission],
	components: {
		ButtonRow,
		Modal,
		Pagination,
		Search,
		PkpTable,
		StageBubble,
		TableCell,
		TableHeader,
	},
	data() {
		return {
			activeFilters: {},
			apiUrl: '',
			count: 30,
			currentViewId: '',
			filtersForm: {},
			i18nListUpdated: '',
			i18nLoadingPage: '',
			i18nShowingXofX: '',
			isLoadingPage: false,
			isLoadingSubmissions: false,
			offset: 0,
			searchPhrase: '',
			sortColumn: '',
			sortDirection: '',
			submissions: [],
			submissionsMax: 0,
			summarySubmission: null,
			views: [],
		};
	},
	computed: {
		/**
		 * The current page of results being viewed
		 *
		 * @return {Number}
		 */
		currentPage() {
			return Math.floor(this.offset / this.count) + 1;
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
			return Math.ceil(this.submissionsMax / this.count);
		},

		/**
		 * A localized string with a count of the submissions being viewed
		 *
		 * eg - Showing 1 to 30 of 170
		 */
		showingXofX() {
			return this.i18nShowingXofX
				.replace('{$start}', this.offset + 1)
				.replace(
					'{$finish}',
					Math.min(this.offset + this.count, this.submissionsMax)
				)
				.replace('{$total}', this.submissionsMax);
		},
	},
	methods: {
		/**
		 * Get a view by it's id
		 */
		findView(id) {
			return this.views.find((view) => view.id === id);
		},

		/**
		 * Get submissions matching the current request params
		 *
		 * @param {Function} cb A callback function to fire when successful
		 */
		get(cb) {
			this.isLoadingSubmissions = true;
			this.$announcer.set(this.__('common.loading'));
			const uuid = uuidv4();
			lastRequest = uuid;

			let data = {
				...this.currentView.queryParams,
				...this.activeFilters,
				count: this.count,
				offset: this.offset,
			};

			if (this.sortColumn && this.sortDirection !== 'none') {
				data.orderBy = this.sortColumn;
				data.orderDirection =
					this.sortDirection === 'descending' ? 'DESC' : 'ASC';
			}

			if (this.searchPhrase) {
				data.searchPhrase = this.searchPhrase;
			}

			$.ajax({
				url: this.apiUrl,
				context: this,
				data,
				error(r) {
					if (lastRequest !== uuid) {
						return;
					}
					this.ajaxErrorCallback(r);
				},
				success(r) {
					if (lastRequest !== uuid) {
						return;
					}
					this.submissions = r.items;
					this.submissionsMax = r.itemsMax;
					this.$announcer.set(this.__('common.loaded'));
					if (cb) {
						cb.apply(this, [r]);
					}
				},
				complete() {
					if (lastRequest !== uuid) {
						return;
					}
					this.isLoadingSubmissions = false;
				},
			});
		},

		/**
		 * Open one of the pre-set views
		 */
		loadView(view) {
			this.activeFilters = {};
			this.currentViewId = view.id;
			this.offset = 0;
			this.searchPhrase = '';
			this.$nextTick(() => {
				this.get((r) => {
					this.findView(view.id).count = r.itemsMax;
				});
			});
		},

		/**
		 * Open the panel to select filters
		 */
		openFilters() {
			lastFocusedEl = document.activeElement;
			this.$modal.show('filters');
		},

		/**
		 * Open the submission summary panel
		 */
		openSummary(submission) {
			lastFocusedEl = document.activeElement;
			this.summarySubmission = submission;
			this.$modal.show('summary');
		},

		/**
		 * Reset the focus to lastFocusedEl
		 *
		 * Used to restore focus after a modal is closed
		 */
		resetFocusToList() {
			lastFocusedEl.focus();
		},

		/**
		 * Fired when the filters form is saved
		 */
		saveFilters(data) {
			this.activeFilters = Object.fromEntries(
				Object.entries(data).filter(([key, value]) => {
					return (Array.isArray(value) && value.length) || !!value;
				})
			);
			this.get(() => this.$modal.hide('filters'));
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
		setPage(page) {
			this.isLoadingPage = true;
			this.offset = this.count * (page - 1);
			this.get(() => (this.isLoadingPage = false));
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
	created() {
		/**
		 * Set the current view to the first available
		 * view when the page is loaded
		 */
		if (!this.currentViewId) {
			this.currentViewId = this.views[0].id;
		}
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

.submissions__view {
	border-top: @bg-border-light;
}

.submissions__view__button {
	display: flex;
	width: 100%;
	align-items: center;
	gap: 1rem;
	border: none;
	background: transparent;
	padding: 1rem;

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
	height: 2rem;
	line-height: 2rem;
	min-width: 2rem;
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
