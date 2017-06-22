<script>
import SubmissionsListPanel from './../../../../components/ListPanel/submissions/SubmissionsListPanel.vue';
import BaseSubmissionObject from './helpers/BaseSubmissionObject.js';

export default {
	extends: SubmissionsListPanel,
	name: 'ExampleSubmissionsListPanel',
	data: function () {
		return {
			id: 'ExampleSubmissionsListPanel',
			filterParams: {},
			searchPhrase: '',
			isLoading: false,
			isSearching: false,
			isOrdering: false,
			isFilterVisible: false,
			count: 3,
			offset: 0,
			apiPath: '',
			getParams: {},
			lazyLoad: false,
			_lastGetRequest: null,
			collection: {
				items: [
					BaseSubmissionObject,
					{
						...BaseSubmissionObject,
						id: 2,
						title: 'Quisque vel ultrices ut vel sollicitudin vel varius suscipit phasellus',
						author: {
							authorString: 'Catherine Kwantes',
						},
						reviewAssignments: [],
						reviewRounds: [],
						stages: [
							{
								id: 1,
								label: 'Submission',
								isActiveStage: false,
								queries: [],
								files: {
									count: 1,
								},
							},
							{
								id: 3,
								label: 'Review',
								isActiveStage: true,
								status: 'Waiting for reviewers to be selected',
								statusId: 6,
								queries: [],
								files: {
									count: 2,
								},
							},
							{
								id: 4,
								label: 'Copyediting',
								isActiveStage: false,
								queries: [],
								files: {
									count: 0,
								},
							},
							{
								id: 5,
								label: 'Production',
								isActiveStage: false,
								queries: [],
								files: {
									count: 0,
								},
							},
						],
						urlWorkflow: '/workflow/access/2',
						urlPublished: '/article/view/2',
					},
					{
						...BaseSubmissionObject,
						id: 3,
						title: 'Metus ut elit est ultrices vivamus mauris est quisque arcu',
						author: {
							authorString: 'Domatilia Sokoloff',
						},
						urlWorkflow: '/workflow/access/3',
						urlPublished: '/article/view/3',
					},
					{
						...BaseSubmissionObject,
						id: 4,
						title: 'Current user is assigned as reviewer to this submission',
						author: {
							authorString: 'Donec Congue',
						},
						reviewAssignments: [
							{
								due: '2025-12-05',
								responseDue: '2017-01-01',
								id: 7,
								isCurrentUserAssigned: true,
								round: 1,
								roundId: 5,
								status: 'The reviewer has missed the response due date.',
								statusId: 4,
							},
						],
						stages: [
							{
								id: 1,
								label: 'Submission',
								isActiveStage: false,
								queries: [],
								files: {
									count: 1,
								},
							},
							{
								id: 3,
								label: 'Review',
								isActiveStage: true,
								status: 'Waiting for reviewers to be selected',
								statusId: 6,
								queries: [{
									assocId: 21,
									assocType: 1048585,
									closed: false,
									id: 47,
									sequence: 1,
									stageId: 3,
								}],
								files: {
									count: 2,
								},
							},
							{
								id: 4,
								label: 'Copyediting',
								isActiveStage: false,
								queries: [],
								files: {
									count: 0,
								},
							},
							{
								id: 5,
								label: 'Production',
								isActiveStage: false,
								queries: [],
								files: {
									count: 0,
								},
							},
						],
						urlWorkflow: '/workflow/access/4',
						urlPublished: '/article/view/4',
					},
					{
						...BaseSubmissionObject,
						id: 5,
						title: 'Sed sed mattis amet eget aenean leo est nam sit',
						author: {
							authorString: 'Sed Aenean',
						},
						urlWorkflow: '/workflow/access/5',
						urlPublished: '/article/view/5',
					},
					{
						...BaseSubmissionObject,
						id: 6,
						title: 'Lacus ut leo dolor nam neque nam dolor aenean sagittis',
						author: {
							authorString: 'Lacus Agittis',
						},
						urlWorkflow: '/workflow/access/3',
						urlPublished: '/article/view/3',
					},
				],
				maxItems: 10,
			},
			i18n: {
				title: 'Example Submissions List',
				add: 'New Submissions',
				search: 'Search',
				itemsOfTotal: '{$count} of {$total} items',
				itemCount: '{$count} items',
				loadMore: 'Load more',
				loading: 'Loading',
				incomplete: 'Incomplete',
				delete: 'Delete',
				infoCenter: 'Activity Log & Notes',
				yes: 'Yes',
				no: 'No',
				deleting: 'Deleting',
				confirmDelete: 'Delete submission?',
				responseDue: 'Response due',
				reviewDue: 'Review due',
				filter: 'Filter',
				filterRemove: 'Clear filter: {$filterTitle}',
				itemOrdererUp: 'Increase position of {$itemTitle}',
				reviewsCompleted: 'Reviews completed',
				filesPrepared: 'Files prepared',
				discussions: 'Discussions',
			},
			addUrl: '/submission/wizard',
			infoUrl: '/$$$call$$$/information-center/submission-information-center/view-information-center?submissionId=__id__',
		};
	},
};
</script>
