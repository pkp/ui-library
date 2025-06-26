import DiscussionManager from './DiscussionManager.vue';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {DiscussionsDataMock} from '@/mockFactories/discussionMock';
export default {
	title: 'Managers/DiscussionManager',
	component: DiscussionManager,
};

export const Default = {
	render: (args) => ({
		components: {DiscussionManager},
		setup() {
			return {args};
		},
		template: `
            <DiscussionManager v-bind="args"/>`,
	}),
	args: {
		submission: getSubmissionMock({
			stages: [
				{
					id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					currentUserAssignedRoles: [16, 1],
				},
			],
		}),
		discussions: DiscussionsDataMock,
	},
};
