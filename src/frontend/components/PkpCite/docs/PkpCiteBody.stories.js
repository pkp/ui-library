import '@/styles/frontend-theme.css';
import PkpCiteBody from '../PkpCiteBody.vue';
import {usePkpCiteStore} from '../usePkpCiteStore';

export default {
	title: 'Frontend/PkpCite',
	component: PkpCiteBody,
	render: (args) => ({
		components: {PkpCiteBody},
		setup() {
			// Set up mock citation config on window.pkp
			window.pkp = window.pkp || {};
			window.pkp.citationConfig = {
				citation:
					'Author, A. B., & Author, C. D. (2025). Title of the article. <i>Journal Name</i>, <i>1</i>(2), 1–10. https://doi.org/10.1234/example',
				citationStyles: [
					{id: 'apa', title: 'APA'},
					{id: 'mla', title: 'MLA'},
					{id: 'chicago-author-date', title: 'Chicago (Author-Date)'},
					{id: 'harvard-cite-them-right', title: 'Harvard'},
					{id: 'ieee', title: 'IEEE'},
					{id: 'vancouver', title: 'Vancouver'},
					{id: 'turabian-fullnote-bibliography', title: 'Turabian'},
				],
				citationDownloads: [
					{id: 'ris', title: 'RIS'},
					{id: 'bibtex', title: 'BibTeX'},
				],
				citationArgs: {submissionId: 1, publicationId: 1, issueId: 1},
				citationArgsJson: {
					submissionId: 1,
					publicationId: 1,
					issueId: 1,
					return: 'json',
				},
			};

			// Initialize the store
			const store = usePkpCiteStore();
			store.$reset();
			store.initialize();

			return {args};
		},
		template: '<PkpCiteBody v-bind="args" />',
	}),
};

export const Default = {
	args: {},
};

export const Loading = {
	args: {},
	render: (args) => ({
		components: {PkpCiteBody},
		setup() {
			window.pkp = window.pkp || {};
			window.pkp.citationConfig = {
				citation:
					'Author, A. B., & Author, C. D. (2025). Title of the article. <i>Journal Name</i>, <i>1</i>(2), 1–10.',
				citationStyles: [{id: 'apa', title: 'APA'}],
				citationDownloads: [],
				citationArgs: {submissionId: 1, publicationId: 1},
				citationArgsJson: {submissionId: 1, publicationId: 1, return: 'json'},
			};

			const store = usePkpCiteStore();
			store.$reset();
			store.initialize();
			store.isLoading = true;

			return {args};
		},
		template: '<PkpCiteBody v-bind="args" />',
	}),
};
