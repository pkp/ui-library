<template>
	<div class="app__page width width--full">
		<div class="submissions">
			<div class="submissions__views">
				<h1 class="submissions__views__title">Submissions</h1>
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
					<pkp-button :is-primary="true">Start a New Submission</pkp-button>
				</div>
				<h1 class="submissions__list__title">
					{{ currentView.name }}
					<span class="submissions__view__count">
						{{ submissionsMax }}
					</span>
				</h1>
				<pkp-table>
					<template slot="caption">
						<button-row>
							<template slot="end">
								<pkp-button @click="openFilters">Filters</pkp-button>
								<span v-if="isLoadingSubmissions">
									<spinner></spinner>
									Loading
								</span>
							</template>
							<search
								:search-phrase="searchPhrase"
								search-label="Search submissions, ID, authors, keywords, etc."
								@search-phrase-changed="(value) => (this.searchPhrase = value)"
							/>
						</button-row>
					</template>
					<template slot="head">
						<table-header
							:can-sort="true"
							:sort-direction="sortColumn === 'id' ? sortDirection : 'none'"
							@table:sort="sort('id')"
						>
							ID
						</table-header>
						<table-header>Submissions</table-header>
						<table-header>Stage</table-header>
						<table-header>Days</table-header>
						<table-header>Editorial Activity</table-header>
						<table-header>
							<span class="-screenReader">Actions</span>
						</table-header>
					</template>
					<tr v-for="submission in submissions" :key="submission.id">
						<table-cell>{{ submission.id }}</table-cell>
						<table-cell
							class="submissions__list__item__title"
							:is-row-header="true"
						>
							<strong>
								{{ submission.publications[0].authorsStringShort }}
							</strong>
							{{ submission.publications[0].fullTitle.en }}
						</table-cell>
						<table-cell class="submissions__list__item__stage">
							<stage-bubble :stage-id="submission.stageId">
								{{ submission.stageName }}
								<template
									v-if="
										(submission.stageId === 2 || submission.stageId === 3) &&
										submission.reviewRounds.length
									"
								>
									(Round
									{{
										submission.reviewRounds[submission.reviewRounds.length - 1]
											.round
									}})
								</template>
							</stage-bubble>
						</table-cell>
						<table-cell>{{ submission.daysInStage }}</table-cell>
						<table-cell>TODO</table-cell>
						<table-cell>
							<pkp-button
								class="submissions__list__item__view"
								@click="openSummary(submission)"
							>
								View Summary
							</pkp-button>
						</table-cell>
					</tr>
				</pkp-table>
				<div class="submissions__list__footer">
					<span class="submission__list__showing">
						{{ showingXofX }}
					</span>
					<pagination
						v-if="lastPage > 1"
						slot="footer"
						:current-page="currentPage"
						:is-loading="isLoadingPage"
						:last-page="lastPage"
						@set-page="setPage"
					/>
				</div>
			</div>
		</div>
		<modal
			close-label="Close"
			name="summary"
			type="side"
			@closed="resetFocusToList"
		>
			<template v-if="summarySubmission">
				<template slot="header">
					<stage-bubble :stage-id="summarySubmission.stageId">
						{{ summarySubmission.stageName }}
						<template v-if="summarySubmission.reviewRound">
							(Round {{ summarySubmission.reviewRound }})
						</template>
					</stage-bubble>
					<span class="summary__id">
						{{ summarySubmission.id }}
					</span>
				</template>
				<h2 class="summary__authors">
					{{ summarySubmission.publications[0].authorsStringShort }}
				</h2>
				<div class="summary__title">
					{{ summarySubmission.publications[0].fullTitle.en }}
				</div>
				<panel>
					<panel-section>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</p>
					</panel-section>
				</panel>
			</template>
		</modal>
		<modal
			close-label="Close"
			name="filters"
			type="side"
			@closed="resetFocusToList"
		>
			<template slot="header">
				<h2>Filters</h2>
			</template>
			<panel>
				<panel-section>
					<pkp-form
						v-bind="filtersForm"
						@set="setFiltersForm"
						@success="saveFilters"
					/>
				</panel-section>
			</panel>
		</modal>
	</div>
</template>

<script>
import SubmissionsPage from '../../../../components/Container/SubmissionsPage.vue';
import submissions from '../../../data/submissions';
import form from '../../Form/helpers/form-base';

export default {
	extends: SubmissionsPage,
	data() {
		return {
			count: 10,
			filtersForm: {
				...form,
				action: 'emit',
			},
			i18nShowingXofX: 'Showing {$start} to {$finish} of {$total}',
			submissions: {...submissions},
			submissionsMax: 120,
			views: [
				{
					id: 'assigned-to-me',
					name: 'Assigned to me',
					count: 11,
				},
				{
					id: 'active',
					name: 'Active Submissions',
					count: 83,
				},
				{
					id: 'initial-review',
					name: 'All in desk/initial review',
					count: 34,
				},
				{
					id: 'external-review',
					name: 'All in peer review',
					count: 18,
				},
				{
					id: 'no-reviewers',
					name: 'Needs reviewers assigned',
					count: 2,
				},
				{
					id: 'waiting-reviews',
					name: 'Awaiting reviews',
					count: 9,
				},
				{
					id: 'reviews-submitted',
					name: 'Reviews submitted',
					count: 0,
				},
				{
					id: 'reviews-overdue',
					name: 'Reviews overdue',
					count: 1,
				},
				{
					id: 'revisions-submitted',
					name: 'Revisions submitted',
					count: 2,
				},
				{
					id: 'copyediting',
					name: 'All in copyediting',
					count: 4,
				},
				{
					id: 'production',
					name: 'All in production',
					count: 6,
				},
				{
					id: 'scheduled',
					name: 'Scheduled for publication',
					count: 3,
				},
				{
					id: 'published',
					name: 'Published',
					count: 6921,
				},
				{
					id: 'declined',
					name: 'Declined',
					count: 28234,
				},
			],
		};
	},
	methods: {
		/**
		 * Get submissions matching the current request params
		 *
		 * @param {Function} cb A callback function to fire when successful
		 */
		get(cb) {
			this.isLoadingSubmissions = true;
			this.$announcer.set(this.__('common.loading'));
			setTimeout(() => {
				this.isLoadingSubmissions = false;
				this.$announcer.set(this.__('common.loaded'));
				if (cb) {
					cb.apply(this, [...this.submissions]);
				}
			}, 1000);
		},
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';
</style>
