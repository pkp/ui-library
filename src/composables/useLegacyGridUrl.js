import {ref, computed} from 'vue';
import {useModal} from '@/composables/useModal';

/**
 * Convert camelCase string to dash-separated string
 * @param {string} str - The camelCase string to convert
 * @returns {string} The dash-separated string
 */
function camelCaseToDashes(str) {
	return str.replace(/([a-z]+)([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Provides functions for working with legacy grid URLs and modals
 * @param {Object} options - Configuration options
 * @param {string} [options.component] - The component name
 * @param {string} [options.op] - The operation name
 * @param {Object} [options.params] - Query parameters
 * @returns {Object} Object containing URL and functions for working with legacy grids
 * @throws {Error} If pkp.context.legacyGridBaseUrl is not configured
 */
export function useLegacyGridUrl({
	component: _component,
	op: _op,
	params: _params,
} = {}) {
	if (typeof pkp === 'undefined' || !pkp?.context?.legacyGridBaseUrl) {
		throw new Error('pkp.context.legacyGridBaseUrl is not configured');
	}

	const component = ref(_component);
	const op = ref(_op);
	const params = ref(_params);

	/**
	 * Query parameters formatted as a URL string
	 * @type {ComputedRef<string>}
	 */
	const queryParamsString = computed(() => {
		if (params.value && Object.keys(params.value).length) {
			return `?${new URLSearchParams(params.value).toString()}`;
		}
		return '';
	});

	/**
	 * Complete legacy grid URL
	 * @type {ComputedRef<string>}
	 */
	const url = computed(() => {
		let componentPath = component.value.slice(0, -7);
		componentPath = camelCaseToDashes(componentPath.split('.').join('/'));
		const opPath = camelCaseToDashes(op.value);

		let baseUrl = pkp.context.legacyGridBaseUrl
			.replace('component', componentPath)
			.replace('action', opPath);
		return `${baseUrl}${queryParamsString.value}`;
	});

	/**
	 * Open a legacy modal with the configured URL
	 * @param {Object} options - Modal options
	 * @param {string} options.title - Modal title
	 * @param {string} [options.closeOnFormSuccessId] - ID of form to close on success
	 * @param {string} [options.description] - Modal description
	 * @param {Function} finishedCallback - Function to call when modal is closed
	 */
	function openLegacyModal(
		{title, closeOnFormSuccessId, description},
		finishedCallback,
	) {
		const {openSideModal} = useModal();

		openSideModal(
			'LegacyAjax',
			{
				legacyOptions: {
					title,
					url,
					closeOnFormSuccessId,
					description,
				},
			},
			{
				onClose: async (closeData) => {
					finishedCallback(closeData);
				},
			},
		);
	}

	return {url, openLegacyModal};
}
