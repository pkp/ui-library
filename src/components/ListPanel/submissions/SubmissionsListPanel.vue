<template>
	<div class="submissionsListPanel">
		<ListPanel
			:is-sidebar-visible="isSidebarVisible"
			:items="items"
			class="listPanel--submissions"
		>
			<template #header>
				<PkpHeader>
					<h2>{{ title }}</h2>
					<Spinner v-if="isLoading" />
					<template #actions>
						<Search
							:search-phrase="searchPhrase"
							@search-phrase-changed="setSearchPhrase"
						/>
						<PkpButton
							v-if="currentUserCanBulkDeleteIncompleteSubmissions"
							:is-warnable="hasSubmissionsSelectedForDeletion"
							@click="promptDeleteConfirmation"
						>
							{{ t('common.delete') }}
						</PkpButton>
						<PkpButton
							:is-active="isSidebarVisible"
							@click="isSidebarVisible = !isSidebarVisible"
						>
							<Icon icon="filter" :inline="true" />
							{{ t('common.filter') }}
						</PkpButton>
						<PkpButton
							v-if="addUrl && currentUserCanAddSubmission"
							element="a"
							:href="addUrl"
						>
							{{ t('submission.submit.newSubmissionSingle') }}
						</PkpButton>
					</template>
				</PkpHeader>
			</template>
			<template #sidebar>
				<PkpHeader :is-one-line="false">
					<h3>
						<Icon icon="filter" :inline="true" />
						{{ t('common.filter') }}
					</h3>
				</PkpHeader>
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="listPanel__block"
				>
					<PkpHeader v-if="filterSet.heading">
						<h4>{{ filterSet.heading }}</h4>
					</PkpHeader>
					<component
						:is="filter.filterType || 'pkp-filter'"
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
						@update-filter="addFilter"
					/>
				</div>
			</template>

			<template #itemsEmpty>
				<template v-if="isLoading">
					<Spinner />
					{{ t('common.loading') }}
				</template>
				<template v-else>
					{{ t('submission.list.empty') }}
				</template>
			</template>

			<template v-if="hasSubmissionsSelectedForDeletion" #sub-action>
				<div>
					<span class="font-bold">
						{{ t('admin.submissions.incomplete.bulkDelete.selectionStatus') }}
					</span>
					<span class="text-primary">
						<PkpButton
							:is-link="true"
							@click="toggleAllIncompleteSubmissionsSelection()"
						>
							{{ checkAllIncompleteSubmissionText }}
						</PkpButton>
					</span>
				</div>
			</template>
			<template #item="{item}">
				<slot name="item" :item="item">
					<SubmissionsListItem
						:key="item.id"
						:item="item"
						:api-url="apiUrl"
						:info-url="infoUrl"
						:assign-participant-url="assignParticipantUrl"
						:is-selected-for-deletion="
							selectedIncompleteSubmissions.includes(item.id)
						"
						@addFilter="addFilter"
						@selectedForBulkDelete="toggleSubmissionSelection"
					/>
				</slot>
			</template>
			<template #footer>
				<Pagination
					v-if="lastPage > 1"
					:current-page="currentPage"
					:is-loading="isLoading"
					:last-page="lastPage"
					@set-page="setPage"
				/>
			</template>
		</ListPanel>
	</div>
</template>

<script>
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import PkpFilterSlider from '@/components/Filter/FilterSlider.vue';
import PkpFilterAutosuggest from '@/components/Filter/FilterAutosuggest.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import SubmissionsListItem from '@/components/ListPanel/submissions/SubmissionsListItem.vue';
import dialog from '@/mixins/dialog';
import fetch from '@/mixins/fetch';

export default {
	components: {
		PkpButton,
		Spinner,
		Icon,
		ListPanel,
		Pagination,
		PkpFilter,
		PkpFilterSlider,
		PkpFilterAutosuggest,
		PkpHeader,
		Search,
		SubmissionsListItem,
	},
	mixins: [fetch, dialog],
	props: {
		/** The URL to make a new submission. */
		addUrl: {
			type: String,
			required: true,
		},
		/** Whether or not the journal, press or preprint server allows submissions. */
		allowSubmissions: {
			type: Boolean,
			default() {
				return true;
			},
		},
		/**  The URL to the component handler to assign a participant to a submission. */
		assignParticipantUrl: {
			type: String,
			default() {
				return '';
			},
		},
		/** An array of [Filters](../?path=/docs/components-filter-base--docs) to change the view of the submissions list. */
		filters: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** The URL to the component handler for the submission's activity log and notes. */
		infoUrl: {
			type: String,
			required: true,
		},
		/** An array of submissions.  */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A count of all submissions the user can access in the journal, press or preprint server. */
		itemsMax: {
			type: Number,
			defaut() {
				return 0;
			},
		},
		/** The title of the list panel. */
		title: {
			type: String,
			required: true,
		},
	},
	emits: [
		/** Emitted when a prop should be changed. Payload: `(id, newProps) */
		'set',
	],
	data() {
		return {
			isSidebarVisible: false,
			selectedIncompleteSubmissions: [],
		};
	},
	computed: {
		/**
		 * Can the current user filter the list?
		 */
		currentUserCanFilter() {
			return this.userHasRole([
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
			]);
		},

		/**
		 * Does the current user have a role which can create a new submission?
		 */
		currentUserCanAddSubmission() {
			return (
				this.allowSubmissions &&
				this.userHasRole([
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_ASSISTANT,
					pkp.const.ROLE_ID_AUTHOR,
					pkp.const.ROLE_ID_REVIEWER,
				])
			);
		},

		/**
		 * Does the user currently have any Incomplete submissions selected for deletion?
		 * @returns {Boolean}
		 */
		hasSubmissionsSelectedForDeletion() {
			return !!this.selectedIncompleteSubmissions.length;
		},

		/**
		 * Has the user selected all incomplete submissions?
		 * @returns {Boolean}
		 */
		hasSelectedAllIncompleteSubmissions() {
			return (
				this.selectedIncompleteSubmissions.length ===
				this.incompleteSubmissions.length
			);
		},

		/**
		 * Get the Incomplete Submissions
		 * @returns {Array}
		 */
		incompleteSubmissions() {
			return this.items.filter((submission) => submission.submissionProgress);
		},

		/**
		 * Returns a text label for toggling the selection of all incomplete submissions.
		 * If all incomplete submissions are selected, it returns the label for deselecting all.
		 * If not all incomplete submissions are selected, it returns the label for selecting all.
		 */
		checkAllIncompleteSubmissionText() {
			return this.hasSelectedAllIncompleteSubmissions
				? this.t('common.deselectAll')
				: this.t('common.selectAll');
		},

		/**
		 * Can the current user bulk delete incomplete submissions?
		 * @return {Boolean}
		 */
		currentUserCanBulkDeleteIncompleteSubmissions() {
			return this.userHasRole(pkp.const.ROLE_ID_SITE_ADMIN);
		},
	},
	mounted() {
		/**
		 * Refresh the list when a submission is updated
		 */
		pkp.eventBus.$on('updated:submission', () => this.get());

		/**
		 * Remove a submission from the list when it is deleted
		 */
		pkp.eventBus.$on('deleted:submission', (data) => {
			if (
				!data.id ||
				!this.items.find((submission) => submission.id === data.id)
			) {
				return;
			}
			this.setItems(
				this.items.filter((item) => {
					return data.id !== item.id;
				}),
				this.itemsMax - 1,
			);
		});
	},
	unmounted() {
		pkp.eventBus.$off('updated:submission');
		pkp.eventBus.$off('deleted:submission');
	},
	methods: {
		/**
		 * Add a filter
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		addFilter(param, value) {
			// Don't allow other filters to be active when the
			// isIncomplete filter is active
			if (param === 'isIncomplete') {
				this.activeFilters = {isIncomplete: value};
				this.get();
			} else {
				let newFilters = {...this.activeFilters};
				if (Object.prototype.hasOwnProperty.call(newFilters, 'isIncomplete')) {
					delete newFilters.isIncomplete;
				}
				if (
					[
						'isOverdue',
						'daysInactive',
						'assignedTo',
						'issueIds',
						'sectionIds',
						'categoryIds',
						'assignedTo',
					].includes(param)
				) {
					newFilters[param] = value;
				} else {
					if (!newFilters[param]) {
						newFilters[param] = [];
					}
					newFilters[param].push(value);
				}
				this.activeFilters = newFilters;
			}
		},

		/**
		 * Is a filter currently active?
		 *
		 * @param {string} param The filter param
		 * @param {mixed} value The filter value
		 * @return {Boolean}
		 */
		isFilterActive(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return false;
			} else if (Array.isArray(this.activeFilters[param])) {
				return this.activeFilters[param].includes(value);
			} else if (['isOverdue', 'daysInactive'].includes(param)) {
				return true;
			} else {
				return this.activeFilters[param] === value;
			}
		},

		/**
		 * Remove a filter
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		removeFilter(param, value) {
			let newFilters = {...this.activeFilters};
			if (
				[
					'isIncomplete',
					'isOverdue',
					'daysInactive',
					'issueIds',
					'sectionIds',
					'categoryIds',
					'assignedTo',
				].includes(param)
			) {
				delete newFilters[param];
			} else {
				newFilters[param] = newFilters[param].filter((v) => v !== value);
			}
			this.activeFilters = newFilters;
		},

		/**
		 * Update the list of items
		 *
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			this.$emit('set', this.id, {
				items,
				itemsMax,
			});
		},
		/**
		 * Helper function to determine if the current user has a role
		 *
		 * @param int|array roles The role ID to look for (pkp.const.ROLE_ID...)
		 * @return bool
		 */
		userHasRole(roles) {
			if (!Array.isArray(roles)) {
				roles = [roles];
			}

			var hasRole = false;
			roles.forEach((role) => {
				if (pkp.currentUser.roles.indexOf(role) > -1) {
					hasRole = true;
				}
			});

			return hasRole;
		},

		/**
		 * Toggles the selection of a specific Incomplete submission with given ID.
		 * Adds the submission to the selection list if it is not already selected.
		 * Removes the submission from the selection list if it is currently selected.
		 */
		toggleSubmissionSelection(id) {
			const existingEntry = this.selectedIncompleteSubmissions.find(
				(submissionId) => submissionId === id,
			);

			if (!existingEntry) {
				this.selectedIncompleteSubmissions.push(id);
			} else {
				this.selectedIncompleteSubmissions =
					this.selectedIncompleteSubmissions.filter(
						(selectedId) => selectedId !== id,
					);
			}
		},

		/**
		 * Selects or deselects all incomplete submissions based on current selection state.
		 * If all Incomplete submissions are selected, it clears the selection.
		 * If not all Incomplete submissions are selected, it selects them all.
		 */
		toggleAllIncompleteSubmissionsSelection() {
			this.selectedIncompleteSubmissions = this
				.hasSelectedAllIncompleteSubmissions
				? []
				: this.incompleteSubmissions.map(({id}) => id);
		},

		/**
		 * Delete selected submissions
		 */
		deleteIncompleteSubmissions(closeDialog) {
			const self = this;

			$.ajax({
				url:
					this.apiUrl +
					`?${$.param({ids: self.selectedIncompleteSubmissions.join(',')})}`,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE',
				},
				error: self.ajaxErrorCallback,
				success() {
					self.setItems(
						self.items.filter(
							(item) => !self.selectedIncompleteSubmissions.includes(item.id),
						),
						self.itemsMax - 1,
					);
					pkp.eventBus.$emit(
						'notify',
						self.t('admin.submissions.incomplete.bulkDelete.success'),
						'success',
					);
					self.selectedIncompleteSubmissions = [];
					closeDialog();
				},
			});
		},

		/**
		 * Display a confirmation prompt before deleting submissions
		 */
		promptDeleteConfirmation() {
			if (!this.hasSubmissionsSelectedForDeletion) {
				return;
			}

			this.openDialog({
				name: 'bulkDeleteConfirmation',
				title: this.t('admin.submissions.incomplete.bulkDelete.confirm'),
				message: this.t('admin.submissions.incomplete.bulkDelete.body'),
				actions: [
					{
						label: this.t('common.confirm'),
						isPrimary: true,
						callback: (close) => {
							this.deleteIncompleteSubmissions(close);
						},
					},
					{
						label: this.t('common.cancel'),
						isWarnable: true,
						callback: (close) => close(),
					},
				],
			});
		},
	},
};
</script>
