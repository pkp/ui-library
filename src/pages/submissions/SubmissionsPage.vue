<template>
	<div class="submissions">
		<div class="submissions__views">
			<h1 class="submissions__views__title">
				{{ t('navigation.submissions') }}
			</h1>
			<ul class="submissions__views__list">
				<li v-for="view in views" :key="view.id" class="submissions__view">
					<button
						class="submissions__view__button"
						:class="
							currentView.id === view.id
								? 'submissions__view__button--current'
								: ''
						"
						@click="loadView(view)"
					>
						<span class="submissions__view__count">
							{{ view.count }}
						</span>
						<span class="submissions__view__name">
							{{ view.name }}
						</span>
					</button>
				</li>
			</ul>
		</div>
		<div class="submissions__list">
			<div class="submissions__list__top">
				<pkp-button element="a" href="{url page='submission'}">
					{{ t('manager.newSubmission') }}
				</pkp-button>
			</div>
			<h2 class="submissions__list__title" id="table-title">
				{{ currentView.name }}
				<span class="submissions__view__count">
					{{ submissionsMax }}
				</span>
			</h2>
			<div id="table-controls" class="submissions__list__controls">
				<button-row>
					<template #end>
						<pkp-button @click="openFilters">
							{{ t('common.filter') }}
						</pkp-button>
						<span v-if="isLoadingSubmissions">
							<spinner></spinner>
							{{ t('common.loading') }}
						</span>
					</template>
					<Search
						:search-phrase="searchPhrase"
						:search-label="t('editor.submission.search')"
						@search-phrase-changed="setSearchPhrase"
					></Search>
				</button-row>
				<div v-if="activeFiltersList.length" class="submissions__list__filters">
					<badge
						v-for="filter in activeFiltersList"
						:key="filter.name + filter.value"
					>
						<strong>{{ filter.name }}:</strong>
						{{ filter.value }}
					</badge>
					<pkp-button :is-warnable="true" :is-link="true" @click="clearFilters">
						<!--{translate key="common.filtersClear"}-->
					</pkp-button>
				</div>
			</div>
			<PkpTable aria-labelledby="table-title" aria-describedby="table-controls">
				<template #head>
					<TableHeader
						v-for="column in columns"
						:key="column.id"
						:canSort="column.sortable"
						:sortDirection="sortColumn === column.id ? sortDirection : 'none'"
					>
						{{ column.header }}
					</TableHeader>
				</template>
				<tr v-for="submission in submissions" :key="submission.id">
					<component
						:is="column.componentName"
						v-for="column in columns"
						:key="column.id"
						:submission="submission"
					/>
				</tr>
			</PkpTable>
			<div class="submissions__list__footer">
				<span class="submission__list__showing" v-html="showingXofX"></span>
				<pagination
					v-if="lastPage > 1"
					:current-page="currentPage"
					:is-loading="isLoadingPage"
					:last-page="lastPage"
					:show-adjacent-pages="3"
					@set-page="setPage"
				></pagination>
			</div>
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
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import ColumnActions from '@/pages/submissions/columnActions.vue';
import ColumnActivity from '@/pages/submissions/columnActivity.vue';
import ColumnDays from '@/pages/submissions/columnDays.vue';
import ColumnId from '@/pages/submissions/columnId.vue';
import ColumnStage from '@/pages/submissions/columnStage.vue';
import ColumnTitle from '@/pages/submissions/columnTitle.vue';

//import SideModal from '@/components/Modal/SideModal.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import Search from '@/components/Search/Search.vue';
//import StageBubble from '@/components/StageBubble/StageBubble.vue';
import PkpTable from '@/components/TableNext/Table.vue';
//////import TableCell from '@/components/TableNext/TableCell.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import ajaxError from '@/mixins/ajaxError';
import localizeSubmission from '@/mixins/localizeSubmission.js';
import {v4 as uuidv4} from 'uuid';

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
	mixins: [ajaxError, localizeSubmission],
	components: {
		ButtonRow,
		//SideModal,
		Pagination,
		Search,
		PkpTable,
		TableHeader,
		ColumnActions,
		ColumnActivity,
		ColumnDays,
		ColumnId,
		ColumnStage,
		ColumnTitle,
	},
	props: {
		apiUrl: String,
		assignParticipantUrl: String,
		// to be renamed
		count: {
			type: Number,
			default: 30,
		},
		initCurrentViewId: String,
		filtersForm: Object,
		initSubmissions: Array,
		initCountMax: Number,
		views: Array,
		columns: Array,
	},
	data() {
		console.log('HELLo', this.hi);
		return {
			activeFilters: {},
			currentViewId: this.initCurrentViewId,
			i18nReviewRound: 'blabla',
			i18nShowingXofX: 'oioii',
			isLoadingPage: false,
			isLoadingSubmissions: false,
			offset: 0,
			searchPhrase: '',
			sortColumn: '',
			sortDirection: '',
			submissions: this.initSubmissions,
			submissionsMax: this.initCountMax,
			summarySubmission: null,
			isModalOpenedFilters: false,
			isModalOpenedSummary: false,
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
			return this.t('common.showingXofX', {
				start: this.offset + 1,
				finish: Math.min(this.offset + this.count, this.submissionsMax),
				total: this.submissionsMax,
			});
		},
	},
	methods: {
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
		get(cb) {
			this.isLoadingSubmissions = true;
			this.$announcer.set(this.t('common.loading'));
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
				url: Object.hasOwn(this.currentView, 'op')
					? this.apiUrl + '/' + this.currentView.op
					: this.apiUrl,
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
					this.$announcer.set(this.t('common.loaded'));
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
		openFilters() {
			this.isModalOpenedFilters = true;
		},

		/**
		 * Open the submission summary panel
		 */
		openSummary(submission) {
			this.summarySubmission = submission;
			this.isModalOpenedSummary = true;
		},

		/**
		 * Fired when the filters form is saved
		 */
		saveFilters(data) {
			this.activeFilters = Object.fromEntries(
				Object.entries(data).filter(([key, value]) => {
					return (Array.isArray(value) && value.length) || !!value;
				}),
			);
			this.get(() => (this.isModalOpenedFilters = false));
		},

		/**
		 * Sync changes to the filter form's state data
		 *
		 * Fired when a field in the form changes
		 */
		/*setFiltersForm(id, data) {
			this.filtersForm = {
				...this.filtersForm,
				...data,
			};
		},*/

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
		/*if (!this.currentViewId) {
			this.currentViewId = this.views[0].id;
		}*/
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
