import {defineStore} from 'pinia';
import {ref} from 'vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpModal} from '@/frontend/composables/usePkpModal';

export const usePkpCiteStore = defineStore('pkpCite', () => {
	const {t} = usePkpLocalize();
	const {openDialog} = usePkpModal();

	// State
	const citation = ref('');
	const citationStyles = ref([]);
	const citationDownloads = ref([]);
	const activeStyleId = ref(null);
	const citationArgs = ref({});
	const citationArgsJson = ref({});
	const isLoading = ref(false);
	const copiedToClipboard = ref(false);
	const initialized = ref(false);

	/**
	 * Initialize the store with citation configuration
	 * @param {Object} config - Citation config from server
	 */
	function initialize(config) {
		if (initialized.value) {
			return;
		}

		if (!config) {
			return;
		}

		citation.value = config.citation || '';
		citationStyles.value = config.citationStyles || [];
		citationDownloads.value = config.citationDownloads || [];
		citationArgs.value = config.citationArgs || {};
		citationArgsJson.value = config.citationArgsJson || {};

		if (citationStyles.value.length > 0) {
			activeStyleId.value =
				config.citationPrimaryStyle || citationStyles.value[0].id;
		}

		initialized.value = true;
	}

	/**
	 * Open the citation modal dialog
	 */
	function openCiteModal() {
		openDialog({
			title: t('submission.howToCite'),
			bodyComponent: 'PkpCiteBody',
			showCloseButton: true,
			size: 'large',
		});
	}

	/**
	 * Switch the active citation style and fetch the new citation
	 * @param {string} styleId - The citation style ID to switch to
	 */
	async function switchStyle(styleId) {
		if (styleId === activeStyleId.value) {
			return;
		}

		activeStyleId.value = styleId;
		isLoading.value = true;

		const params = new URLSearchParams(citationArgsJson.value);
		const url = `${pkp.context.pageBaseUrl}/citationstylelanguage/get/${styleId}?${params.toString()}`;

		try {
			const response = await fetch(url);
			const data = await response.json();
			citation.value = data.content || '';
		} catch {
			// Keep the current citation on error
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * Copy the current citation to clipboard as plain text
	 */
	async function copyToClipboard() {
		// Strip HTML tags to get plain text
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = citation.value;
		const plainText = tempDiv.textContent || tempDiv.innerText || '';

		try {
			await navigator.clipboard.writeText(plainText);
			copiedToClipboard.value = true;
			setTimeout(() => {
				copiedToClipboard.value = false;
			}, 2000);
		} catch {
			// Clipboard API not available or denied
		}
	}

	return {
		// State
		citation,
		citationStyles,
		citationDownloads,
		activeStyleId,
		isLoading,
		copiedToClipboard,

		// Actions
		initialize,
		openCiteModal,
		switchStyle,
		copyToClipboard,
	};
});
