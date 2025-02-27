import {ref, unref} from 'vue';
import {ofetch, createFetch} from 'ofetch';
import {useModalStore} from '@/stores/modalStore';
import {useProgressStore} from '@/stores/progressStore';
import {injectFromCurrentInstance} from '@/utils/defineComponentStore';
import {useDebounceFn} from '@vueuse/core';

let ofetchInstance = ofetch;

/** Exported only for legacy purposes, when csrf is included as form data */
export function getCSRFToken() {
	const FALLBACK_TOKEN = 'test_csrf_token';

	if (typeof pkp !== 'undefined') {
		return pkp?.currentUser?.csrfToken || FALLBACK_TOKEN;
	}

	return FALLBACK_TOKEN;
}

/**
 * This workaround addresses the limitation where ofetch does not handle array query params in PHP friendly way.
 * Once this issue is resolved in ofetch, this function can be removed.
 * Fo reference see:
 * - https://github.com/unjs/ufo/issues/185
 * - https://github.com/unjs/ufo/issues/208
 * - https://github.com/unjs/ofetch/pull/440
 *
 */
function _formatQueryParams(params) {
	if (!params) {
		return {};
	}

	const formatedParams = {};
	Object.entries(params).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			formatedParams[`${key}[]`] = value;
		} else {
			formatedParams[key] = value;
		}
	});

	return formatedParams;
}

/**
 *
 * Composable for handling API requests
 * Listed options should be sufficient for PKP use cases. For additional options check [ofetch](https://github.com/unjs/ofetch) docs
 * @function useFetch
 * @param {string} url - The URL to which the HTTP request is to be sent.
 * @param {Object} [options={}] - Optional configuration options for the request.
 * @param {boolean} [options.expectValidationError=false] - Set to `true` to handle validation errors separately. When set, validation errors are stored in `validationError` rather than `error`.
 * @param {Object} [options.query] - An object representing query parameters to be included in the request.
 * @param {Object} [options.body] - The request payload, typically used with 'POST', 'PUT', or 'DELETE' requests.
 * @param {Object} [options.headers] - Additional HTTP headers to be sent with the request.
 * @param {string} [options.method] - The HTTP method to be used for the request (e.g., 'GET', 'POST', etc.).
 * @param {number} [options.debouncedMs] - When the fetch should be debounce, this defines the delay
 * @param {boolean} [options.showFullScreenSpinner] - Automatically shows full screen spinner, when set to true

 * @returns {Object} An object containing several reactive properties and a method for performing the fetch operation:
 * @returns {Ref<Object|null>} return.data - A ref object containing the response data from the fetch operation.
 * @returns {Ref<Object|null>} return.validationError - A ref object containing validation error data, relevant when `expectValidationError` is true.
 * @returns {Ref<boolean>} return.isLoading - A ref object indicating whether the fetch operation is currently in progress.
 * @returns {Function} return.fetch - The function to call to initiate the fetch operation. This function is async and handles the actual fetching logic.
 *
 *  * The `fetch` function accepts the following optional parameter:
 * @param {Object} [fetchOptions={}] - Options to customize the fetch operation.
 * @param {boolean} [fetchOptions.clearData=false] - If set to `true`, processes and cleans the fetched data before storing it in `data`. Defaults to `false`.
 
 */
export function useFetch(url, options = {}) {
	/**
	 *  Workaround for testing https://github.com/unjs/ofetch/issues/295
	 *  Can be removed once issue is addressed
	 *  (likely getting fetch instance in runtime)
	 * */
	if (typeof process !== 'undefined' && process?.env?.VITEST == 'true') {
		ofetchInstance = createFetch();
	}

	const {
		expectValidationError,
		query: _query,
		body: _body,
		...ofetchOptions
	} = options;

	const query = ref(_query || {});
	const body = ref(_body || undefined);

	const modalStore = useModalStore();
	const isLoading = ref(false);
	const data = ref(null);
	const isSuccess = ref(null);
	const validationError = ref(null);

	let lastRequestController = null;

	const modalLevel = injectFromCurrentInstance('modalLevel');
	const screenName = modalLevel?.value ? `modal_${modalLevel.value}` : 'base';
	const progressStore = useProgressStore();

	async function _fetch({clearData} = {clearData: false}) {
		if (lastRequestController) {
			// abort in-flight request
			lastRequestController.abort();
		}
		lastRequestController = new AbortController();

		const signal = lastRequestController.signal;

		const opts = {
			...ofetchOptions,
			query: _formatQueryParams(query.value),
			body: body.value,
			signal,
		};

		// add csrf token
		if (['POST', 'DELETE', 'PUT'].includes(opts.method)) {
			if (!opts.headers) {
				opts.headers = {};
			}

			opts.headers['X-Csrf-Token'] = getCSRFToken();
			//  add method-override for improved server compatibility https://github.com/pkp/pkp-lib/issues/5981
			if (['DELETE', 'PUT'].includes(opts?.method)) {
				opts.headers['X-Http-Method-Override'] = options.method;
				opts.method = 'POST';
			}
		}

		isLoading.value = true;
		progressStore.fetchStarted(screenName);
		if (opts.showFullScreenSpinner) {
			progressStore.startFullScreenSpinner();
		}

		isSuccess.value = null;
		if (clearData) {
			data.value = null;
		}
		try {
			const result = await ofetchInstance(unref(url), opts);
			data.value = result;
			validationError.value = null;
			isSuccess.value = true;
		} catch (e) {
			data.value = null;
			isSuccess.value = false;

			if (signal) {
				e.aborted = signal.aborted;
			}
			if (e.aborted) {
				return; // aborted by subsequent request
			}

			if (expectValidationError && [400, 422].includes(e.status)) {
				validationError.value = e.data;
				data.value = null;
				return;
			}

			modalStore.openDialogNetworkError(e);
		} finally {
			isLoading.value = false;
			progressStore.fetchFinished(screenName);
			if (opts.showFullScreenSpinner) {
				progressStore.stopFullScreenSpinner();
			}
		}
	}

	let fetch = _fetch;
	if (options.debouncedMs) {
		fetch = useDebounceFn(_fetch, options.debouncedMs);
	}
	return {
		data,
		isSuccess,
		validationError,
		isLoading,
		fetch,
	};
}
