import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
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
	 * Combobox items derived from citationStyles
	 */
	const comboboxItems = computed(() =>
		citationStyles.value.map((style) => ({
			value: style.id,
			label: style.title,
		})),
	);

	/**
	 * Initialize the store from window.pkp.citationConfig
	 * Runs once, called lazily on first open()
	 */
	function initialize() {
		if (initialized.value) {
			return;
		}

		const config =
			typeof window !== 'undefined' ? window.pkp?.citationConfig : null;
		if (!config) {
			return;
		}

		citation.value = config.citation || '';
		citationStyles.value = config.citationStyles || [];
		citationDownloads.value = config.citationDownloads || [];
		citationArgs.value = config.citationArgs || {};
		citationArgsJson.value = config.citationArgsJson || {};

		// Set active style to first available
		if (citationStyles.value.length > 0) {
			activeStyleId.value = citationStyles.value[0].id;
		}

		initialized.value = true;
	}

	/**
	 * Open the citation modal dialog
	 */
	function open() {
		initialize();

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
		comboboxItems,

		// Actions
		initialize,
		open,
		switchStyle,
		copyToClipboard,
	};
});
