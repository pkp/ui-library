import {reactive, computed, watch} from 'vue';

// Shared state across all usages
const tabGroups = reactive({});

// Track which groups have URL watchers to avoid duplicates
const urlWatchers = new Set();

/**
 * Composable for managing tab state with URL sync.
 * The name serves as both the group identifier and URL param name.
 *
 * @param {string} name - Identifier for the tab group (also used as URL param)
 * @param {Object} options - Configuration options
 * @param {string} options.defaultValue - Default active tab
 * @returns {{ activeTab: ComputedRef<string>, setTab: (value: string) => void }}
 *
 * @example
 * // In PkpTabRoot
 * const { activeTab } = usePkpTab('tab', { defaultValue: 'article' });
 *
 * // In any other component
 * const { setTab } = usePkpTab('tab');
 * setTab('peer-review-record');
 */
export function usePkpTab(name, options = {}) {
	const {defaultValue = null} = options;

	// Initialize group if not exists
	if (!tabGroups[name]) {
		// Check URL for initial value
		let initialValue = defaultValue;
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const urlValue = params.get(name);
			if (urlValue) {
				initialValue = urlValue;
			}
		}
		tabGroups[name] = initialValue;
	}

	// Writable computed for activeTab
	const activeTab = computed({
		get: () => tabGroups[name],
		set: (value) => {
			tabGroups[name] = value;
		},
	});

	function setTab(value) {
		tabGroups[name] = value;
	}

	// Set up URL sync watcher (once per group)
	if (typeof window !== 'undefined' && !urlWatchers.has(name)) {
		urlWatchers.add(name);
		watch(
			() => tabGroups[name],
			(value) => {
				if (value) {
					const url = new URL(window.location.href);
					url.searchParams.set(name, value);
					window.history.replaceState({}, '', url.toString());
				}
			},
		);
	}

	return {activeTab, setTab};
}
