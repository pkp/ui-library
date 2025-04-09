import GalleyManager from './GalleyManager.vue';
import {getGalleyMock} from '@/mockFactories/galleyMock';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getPublicationMock} from '@/mockFactories/publicationMock';
export default {
	title: 'Managers/GalleyManager',
	component: GalleyManager,
};

export const Default = {
	render: (args) => ({
		components: {GalleyManager},
		setup() {
			return {args};
		},
		template: `
            <GalleyManager v-bind="args"/>`,
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
		publication: getPublicationMock({
			galleys: [
				getGalleyMock({}),
				getGalleyMock({
					label: 'Audio Version 2',
					file: {
						documentType: 'audio',
						genreName: 'Article Audio',
					},
				}),
			],
		}),
	},
};
