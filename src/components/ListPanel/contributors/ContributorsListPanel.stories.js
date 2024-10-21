import ContributorsListPanel from './ContributorsListPanel.vue';

import ContributorMock from '@/mocks/contributor';
import PublicationMock from '@/mocks/publication';
import FormContributorsMock from '@/components/Form/mocks/form-contributors';

export default {
	title: 'ListPanel/ContributorsListPanel',
	component: ContributorsListPanel,
};

const contributors = [
	{
		...ContributorMock,
		affiliation: {
			en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		},
		fullName: 'Clara Mitchell',
	},
	{
		...ContributorMock,
		affiliation: {
			en: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
		fullName: 'Ethan Brooks',
	},
	{
		...ContributorMock,
		affiliation: {
			en: ' Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		},
		fullName: 'Sophia Reyes',
	},
];

export const Base = {
	render: (args) => ({
		components: {ContributorsListPanel},
		setup() {
			return {args};
		},
		template: `
			<ContributorsListPanel
				v-bind="args"
			/>
		`,
	}),

	args: {
		canEditPublication: true,
		form: {...FormContributorsMock},
		id: 'contributors',
		items: [...contributors],
		publication: PublicationMock,
		publicationApiUrlFormat: '/submissions/9/publications/__publicationId__',
		itemsMax: contributors.length,
		title: 'Contributors',
	},
};
