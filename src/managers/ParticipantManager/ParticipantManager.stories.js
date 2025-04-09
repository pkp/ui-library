import {http, HttpResponse} from 'msw';

import ParticipantManager from './ParticipantManager.vue';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getParticipantMock} from '@/mockFactories/participantMock';
export default {
	title: 'Managers/ParticipantManager',
	component: ParticipantManager,
};

export const Default = {
	render: (args) => ({
		components: {ParticipantManager},
		setup() {
			return {args};
		},
		template: `
            <ParticipantManager v-bind="args"/>`,
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
		submissionStageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
	},
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/participants/5',
					({request}) => {
						const participants = [
							getParticipantMock({id: 3}),
							getParticipantMock({
								id: 4,
								displayInitials: 'TN',
								fullName:
									'Test some very longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong name',
							}),
							getParticipantMock({
								id: 5,
								stageAssignments: [
									{
										stageAssignmentStageId:
											pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
										recommendOnly: true,
									},
								],
							}),
						];

						return HttpResponse.json(participants);
					},
				),
			],
		},
	},
};
