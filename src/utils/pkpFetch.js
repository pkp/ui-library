import {ofetch} from 'ofetch';
const uniqueRequestControllers = {};

/**
 * TODO
 * @param {*} url
 * @param {*} opts
 * @returns
 */

export function pkpFetch(url, opts = {}) {
	const extraOpts = {};

	// ensure that only one request with this name is being triggered
	// if there is ongoing request it should be cancelled
	let signal = null;
	if (opts.queueName) {
		if (uniqueRequestControllers[opts.queueName]) {
			// aborting previous request
			uniqueRequestControllers[opts.queueName].abort();
		}

		const controller = new AbortController();
		signal = controller.signal;
		extraOpts.signal = signal;
		uniqueRequestControllers[opts.queueName] = controller;
	}

	return ofetch(url, {...opts, ...extraOpts}).catch((e) => {
		if (signal) {
			e.aborted = signal.aborted;
		}
		throw e;
	});
}
