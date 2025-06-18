import TasksAndDiscussionsManager from './TasksAndDiscussionsManager.vue';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {TasksAndDiscussionsDataMock} from '@/mockFactories/tasksAndDiscussionsMock';
export default {
	title: 'Managers/TasksAndDiscussionsManager',
	component: TasksAndDiscussionsManager,
};

export const Default = {
	render: (args) => ({
		components: {TasksAndDiscussionsManager},
		setup() {
			return {args};
		},
		template: `
            <TasksAndDiscussionsManager v-bind="args"/>`,
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
		tasksAndDiscussions: TasksAndDiscussionsDataMock,
	},
};
