<template>
	<submissions-list-panel
		addUrl="http://localhost:8000/publicknowledge/submission/wizard"
		apiUrl="http://httpbin.org/get"
		:filters="filters"
		id="previewSubmissionsListPanel"
		infoUrl="http://httbin.org/get"
		:items="items"
		:itemsMax="itemsMax"
		title="Submissions"
	/>
</template>
<script>
import Page from '@/components/Container/Page.vue';
import SubmissionsListPanel from '@/components/ListPanel/submissions/SubmissionsListPanel.vue';
import submissions from '@/docs/data/submissions';
import fieldBase from '../../Form/helpers/field-base';
import fieldBaseAutosuggest from '../../Form/helpers/field-autosuggest';

export default {
	extends: Page,
	components: {
		SubmissionsListPanel
	},
	data() {
		return {
			filters: [
				{
					filters: [
						{
							title: 'Overdue',
							param: 'isOverdue',
							value: true
						},
						{
							title: 'Incomplete',
							param: 'isIncomplete',
							value: true
						}
					]
				},
				{
					heading: 'Stages',
					filters: [
						{
							title: 'Submission',
							param: 'stageIds',
							value: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION
						},
						{
							title: 'Review',
							param: 'stageIds',
							value: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
						},
						{
							title: 'Copyediting',
							param: 'stageIds',
							value: pkp.const.WORKFLOW_STAGE_ID_EDITING
						},
						{
							title: 'Production',
							param: 'stageIds',
							value: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION
						}
					]
				},
				{
					heading: 'Activity',
					filters: [
						{
							title: 'Days since last activity',
							param: 'daysInactive',
							value: 30,
							min: 1,
							max: 180,
							filterType: 'pkp-filter-slider'
						}
					]
				},
				{
					heading: 'Sections',
					filters: [
						{
							title: 'Articles',
							param: 'sectionIds',
							value: 1
						},
						{
							title: 'Reviews',
							param: 'sectionIds',
							value: 2
						}
					]
				},
				{
					filters: [
						{
							title: 'Editors',
							param: 'assignedTo',
							value: [],
							component: 'field-select-users',
							autosuggestProps: {
								...fieldBase,
								...fieldBaseAutosuggest,
								apiUrl: '/usernames.json',
								name: 'assignedTo',
								label: 'Assigned To Editors',
								selectedLabel: 'Assigned'
							},
							filterType: 'pkp-filter-autosuggest'
						}
					]
				},
				{
					filters: [
						{
							title: 'Issues',
							param: 'issueIds',
							value: [],
							component: 'field-select-issues',
							autosuggestProps: {
								...fieldBase,
								...fieldBaseAutosuggest,
								apiUrl: '/issues.json',
								name: 'issueIds',
								label: 'Assigned To Issues',
								selectedLabel: 'Assigned'
							},
							filterType: 'pkp-filter-autosuggest'
						}
					]
				}
			],
			items: [...submissions],
			itemsMax: submissions.length
		};
	},
	created() {
		/**
		 * Add required locale keys
		 */
		pkp.localeKeys['common.lastActivity'] =
			'Last activity recorded on {$date}.';
		pkp.localeKeys['submission.list.empty'] = 'No submissions found.';
		pkp.localeKeys['submission.submit.newSubmissionSingle'] = 'New Submission';
		pkp.localeKeys['submission.review'] = 'Review';
		pkp.localeKeys['submissions.incomplete'] = 'Incomplete';
		pkp.localeKeys['submission.list.assignEditor'] = 'Assign Editor';
		pkp.localeKeys['submission.list.copyeditsSubmitted'] =
			'Copyedited files submitted';
		pkp.localeKeys['submission.list.currentStage'] =
			'Currently in the {$stage} stage.';
		pkp.localeKeys['submission.list.discussions'] = 'Open discussions';
		pkp.localeKeys[
			'submission.list.dualWorkflowLinks'
		] = `You have been assigned multiple roles for this submission. Would you like to access the <a href="{$urlAuthorWorkflow}">Author's workflow</a>  or the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?`;
		pkp.localeKeys['submission.list.galleysCreated'] =
			'Copyedited files submitted';
		pkp.localeKeys['submission.list.infoCenter'] = 'Activity Log & Notes';
		pkp.localeKeys['submission.list.reviewAssignment'] = 'Review Assignment';
		pkp.localeKeys['submission.list.responseDue'] = 'Response Due: {$date}';
		pkp.localeKeys['submission.list.reviewCancelled'] = 'Review Cancelled';
		pkp.localeKeys['submission.list.reviewComplete'] = 'Review Submitted';
		pkp.localeKeys['submission.list.reviewDue'] = 'Review Due: {$date}';
		pkp.localeKeys[
			'submission.list.reviewerWorkflowLink'
		] = `You have been assigned an editorial role for this submission. Would you like to access the <a href="{$urlEditorialWorkflow}">Editorial workflow</a>?`;
		pkp.localeKeys['submission.list.reviewsCompleted'] =
			'Assigned reviews completed';
		pkp.localeKeys['submission.list.revisionsSubmitted'] =
			'Production galleys created';
		pkp.localeKeys['submission.list.viewSubmission'] = 'View Submission';
	}
};
</script>
