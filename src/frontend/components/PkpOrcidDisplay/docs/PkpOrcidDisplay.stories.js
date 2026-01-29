import PkpOrcidDisplay from '../PkpOrcidDisplay.vue';

export default {
	title: 'Frontend/PkpOrcidDisplay',
	component: PkpOrcidDisplay,
	render: (args) => ({
		components: {PkpOrcidDisplay},
		setup() {
			return {args};
		},
		template: '<PkpOrcidDisplay v-bind="args" />',
	}),
};

export const Verified = {
	name: 'Verified ORCID',
	args: {
		orcidUrl: 'https://orcid.org/0000-0002-1234-5678',
		isVerified: true,
	},
};

export const Unverified = {
	name: 'Unverified ORCID',
	args: {
		orcidUrl: 'https://orcid.org/0000-0003-9876-5432',
		isVerified: false,
	},
};
