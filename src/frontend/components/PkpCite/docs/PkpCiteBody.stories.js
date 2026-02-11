import '@/styles/frontend-theme.css';
import PkpCiteBody from '../PkpCiteBody.vue';
import {usePkpCiteStore} from '../usePkpCiteStore';
import {useModal} from '@/composables/useModal.js';
import PkpButton from '@/components/Button/Button.vue';
import {within, userEvent} from 'storybook/test';
import {t} from '@/utils/i18n';

const citationConfig = {
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
	citationPrimaryStyle: 'apa',
};

export default {
	title: 'Frontend/PkpCite',
	component: PkpCiteBody,
	render: (args) => ({
		components: {PkpButton},
		setup() {
			const store = usePkpCiteStore();
			const {openDialog} = useModal();

			function openCite() {
				store.initialized = false;
				store.initialize(citationConfig);
				openDialog({
					title: t('submission.howToCite'),
					bodyComponent: PkpCiteBody,
					showCloseButton: true,
					size: 'large',
				});
			}

			return {openCite, t};
		},
		template: `<PkpButton @click="openCite">{{ t('submission.howToCite') }}</PkpButton>`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 400px"><story/></div>',
		}),
	],
};

export const Default = {
	args: {},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();
		await user.click(canvas.getByText('How to Cite'));
	},
};

export const Loading = {
	args: {},
	render: (args) => ({
		components: {PkpButton},
		setup() {
			const store = usePkpCiteStore();
			const {openDialog} = useModal();

			function openCite() {
				store.initialized = false;
				store.initialize(citationConfig);
				store.isLoading = true;
				openDialog({
					title: t('submission.howToCite'),
					bodyComponent: PkpCiteBody,
					showCloseButton: true,
					size: 'large',
				});
			}

			return {openCite, t};
		},
		template: `<PkpButton @click="openCite">{{ t('submission.howToCite') }}</PkpButton>`,
	}),
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();
		await user.click(canvas.getByText('How to Cite'));
	},
};
