<template>
	<doi-list-panel
		apiUrl="http://httpbin.org/get"
		id="previewDoiListPanel--articles"
		:items="previewItems"
		:itemsMax="previewItemsMax"
		title="Article DOIs"
		:crossrefPluginEnabled="true"
		:isSubmission="true"
		:filters="filters"
		:enabledDoiTypes="enabledDoiTypes"
		:doi-prefix="doiPrefix"
	/>
</template>
<script>
import DoiListPanel from '@/components/ListPanel/doi/DoiListPanel.vue';
import submissions from '@/docs/data/submissions';
// import issues from '@/docs/data/issues';
import fieldBase from '@/docs/components/Form/helpers/field-base';
import fieldBaseAutosuggest from '@/docs/components/Form/helpers/field-autosuggest';

export default {
	components: {
		DoiListPanel
	},
	data() {
		const submissionItems = [...submissions];
		// const issueItems = [...issues];

		return {
			previewItems: submissionItems,
			previewItemsMax: submissionItems.length,
			// previewItems: issueItems,
			// previewItemsMax: issueItems.length,
			filters: [
				// For submissions
				{
					heading: 'Publication Status',
					filters: [
						{
							title: 'Published',
							param: 'status',
							value: `${pkp.const.STATUS_PUBLISHED}`
						},
						{
							title: 'Unpublished',
							param: 'status',
							value: `${pkp.const.STATUS_QUEUED}, ${pkp.const.STATUS_SCHEDULED}` // '1,5'
						}
					]
				},
				{
					heading: 'CrossRef Deposit Status',
					filters: [
						{
							title: 'Not deposited',
							param: 'crossrefStatus',
							value: 'notDeposited'
						},
						{
							title: 'Active',
							param: 'crossrefStatus',
							value: 'registered'
						},
						{
							title: 'Failed',
							param: 'crossrefStatus',
							value: 'failed'
						},
						{
							title: 'Marked Active',
							param: 'crossrefStatus',
							value: 'markedRegistered'
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
								label: 'Issues',
								selectedLabel: 'Assigned'
							},
							filterType: 'pkp-filter-autosuggest'
						}
					]
				}
				// For issues
				// {
				// 	heading: 'Publication Status',
				// 	filters: [
				// 		{
				// 			title: 'Published',
				// 			param: 'isPublished',
				// 			value: '1'
				// 		},
				// 		{
				// 			title: 'Unpublished',
				// 			param: 'isPublished',
				// 			value: '0'
				// 		}
				// 	]
				// }
			],
			enabledDoiTypes: ['issue', 'publication', 'representation'],
			doiPrefix: '10.9876'
		};
	},
	created() {
		/**
		 * Add required locale keys
		 */
		pkp.localeKeys['publication.status.unpublished'] = 'Unpublished';
		pkp.localeKeys['publication.status.unpublished'] =
			'publication.status.unpublished';
		pkp.localeKeys['publication.status.published'] =
			'publication.status.published';
		pkp.localeKeys['manager.dois.actions.deposit.label'] =
			'manager.dois.actions.deposit.label';
		pkp.localeKeys['manager.dois.actions.deposit.prompt'] =
			'manager.dois.actions.deposit.prompt';
		pkp.localeKeys['manager.dois.actions.markRegistered.label'] =
			'manager.dois.actions.markRegistered.label';
		pkp.localeKeys['manager.dois.actions.markRegistered.prompt'] =
			'manager.dois.actions.markRegistered.prompt';
		pkp.localeKeys['manager.dois.actions.export.label'] =
			'manager.dois.actions.export.label';
		pkp.localeKeys['manager.dois.actions.export.prompt'] =
			'manager.dois.actions.export.prompt';
		pkp.localeKeys['manager.dois.registration.submittedDescription'] =
			'manager.dois.registration.submittedDescription';
		pkp.localeKeys['manager.dois.registration.notSubmittedDescription'] =
			'manager.dois.registration.notSubmittedDescription';
		pkp.localeKeys['manager.dois.registration.viewError'] =
			'manager.dois.registration.viewError';
		pkp.localeKeys['manager.dois.registration.viewError.title'] =
			'manager.dois.registration.viewError.title';
		pkp.localeKeys['manager.dois.registration.viewRecord'] =
			'manager.dois.registration.viewRecord';
		pkp.localeKeys['manager.dois.registration.viewRecord.title'] =
			'manager.dois.registration.viewRecord.title';
		pkp.localeKeys['manager.dois.registration.depositDois'] =
			'manager.dois.registration.depositDois';
		pkp.localeKeys['manager.dois.status.unregistered'] =
			'manager.dois.status.unregistered';
		pkp.localeKeys['manager.dois.status.submitted'] =
			'manager.dois.status.submitted';
		pkp.localeKeys['manager.dois.status.registered'] =
			'manager.dois.status.registered';
		pkp.localeKeys['manager.dois.status.error'] = 'manager.dois.status.error';
		pkp.localeKeys['manager.dois.status.stale'] = 'manager.dois.status.stale';
	}
};
</script>
