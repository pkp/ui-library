import DataCitationManager from './DataCitationManager.vue';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getPublicationMock} from '@/mockFactories/publicationMock';
import {
	getDataCitationsMock,
	getDataCitationEditFormMock,
} from '@/mockFactories/dataCitationMock';

export default {
	title: 'Managers/DataCitationManager',
	component: DataCitationManager,
	render: (args) => ({
		components: {DataCitationManager},
		setup() {
			return {args};
		},
		template: `<DataCitationManager v-bind="args"/>`,
	}),
};

export const Base = {
	args: {
		submission: getSubmissionMock(),
		publication: getPublicationMock({
			dataCitations: getDataCitationsMock(),
		}),
		dataCitationEditForm: getDataCitationEditFormMock(),
	},
};

// How a reviewer sees the table - View is the only action
export const ViewOnly = {
	args: {
		...Base.args,
		canEdit: false,
	},
};
