import {defineStore} from 'pinia';
import {ref} from 'vue';
import {usePkpFetch} from '@/frontend/composables/usePkpFetch';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {useUrl} from '@/frontend/composables/usePkpUrl';
import PkpCitedByBody from './PkpCitedByBody.vue';

export const usePkpCitedByStore = defineStore('pkpCitedBy', () => {
	const {t} = usePkpLocalize();

	const citations = ref([]);
	const total = ref(0);
	const isLoading = ref(false);
	const initialized = ref(false);
	const copiedToClipboard = ref(false);
	const styles = ref([]);
	const nestedStyles = ref({});

	async function initialize(config, _nestedStyles) {
		if (!config) {
			return;
		}
		// This store is shared by multiple components which are mounted independent of each other.
		// To prevent one overriding the other's styles, we merge them here.
		// Top level styles are used for PkpCitedBy component, while styles for any other citedBy** related component must be passed via nested styles
		styles.value = {
			...styles.value,
			...(config.styles || {}),
		};
		nestedStyles.value = {
			...nestedStyles.value,
			..._nestedStyles,
		};

		if (initialized.value || isLoading.value) {
			return;
		}
		const submissionId = config.submissionId;

		const {apiUrl: fecthUrl} = useUrl(`crossref/citedBy/${submissionId}`);

		initialized.value = true;
		isLoading.value = true;

		const {data, fetch} = usePkpFetch(fecthUrl, {method: 'GET'});

		await fetch();
		citations.value = data.value.items || [];
		total.value = data.value.itemsMax;
		isLoading.value = false;
	}

	/**
	 * Build a plain-text summary of every citation (used by the
	 * "Copy citation details" action) with one entry per line.
	 */
	function formatCitationForClipboard(citation, i) {
		const parts = [
			i + 1,
			citation.doi,
			getDoiExternalLink(citation.doi),
			citation.issue,
			citation.title,
			citation.journal,
			citation.year,
			citation.volume,
			citation.authors,
			citation.pages,
		].filter(Boolean);
		const text = parts.join(' ');
		return text;
	}

	/**
	 * Copy a plain-text summary of every fetched citation to the clipboard.
	 */
	async function copyAllToClipboard() {
		const text = citations.value.map(formatCitationForClipboard).join('\n');

		try {
			await navigator.clipboard.writeText(text);
			copiedToClipboard.value = true;
			setTimeout(() => {
				copiedToClipboard.value = false;
			}, 2000);
		} catch {
			// Clipboard API not available or denied
		}
	}

	/**
	 * Open the cited-by modal, listing every citation fetched for this
	 * submission.
	 */
	function openCitedByModal() {
		const {openDialog, closeTopDialog} = usePkpModal();

		openDialog({
			title: t('plugins.generic.crossref.citedBy.title'),
			bodyComponent: PkpCitedByBody,
			size: 'large',
			bodyProps: {
				styles: styles.value.PkpCitedByBody,
				onClose: () => closeTopDialog(),
			},
		});
	}

	function closeModal() {
		const {closeDialog} = usePkpModal();
		closeDialog();
	}

	function getDoiExternalLink(doi) {
		return `https://doi.org/${doi}`;
	}

	return {
		citations,
		isLoading,
		initialized,
		copiedToClipboard,
		total,
		initialize,
		openCitedByModal,
		copyAllToClipboard,
		closeModal,
		getDoiExternalLink,
	};
});
