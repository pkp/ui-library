/**
 * Ajax error callback mixin
 *
 * This mixin provides a method to display error messages from ajax
 * requests, including a fallback for failed requests like 500 server
 * errors.
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
import dialog from './dialog';

export default {
	mixins: [dialog],
	methods: {
		/**
		 * Display an error message from an ajax request
		 *
		 * This callback expects to be attached to the `error` param of the
		 * jQuery $.ajax method. It can also be fired directly, but should have
		 * a jQuery response object with the following:
		 * {
		 *   responseJSON: {
		 *     error: 'localised.string.key',
		 *     errorMessage: 'The string rendered into localised form for display',
		 *   }
		 * }
		 *
		 * @param {Object} r The response from jQuery's ajax request
		 */
		ajaxErrorCallback(r) {
			// If the user browses away from the page before a response has been
			// received by the ajax request, the error handler will be invoked.
			// Do nothing so the user does not see an obsolete error message.
			if ('status' in r && r.status == 0) {
				return;
			}

			let msg;
			if ('responseJSON' in r && 'errorMessage' in r.responseJSON) {
				msg = r.responseJSON.errorMessage;
			} else {
				msg = this.__('common.unknownError');
			}

			this.openDialog({
				name: 'ajaxError',
				title: this.__('common.error'),
				message: msg,
				actions: [
					{
						label: this.__('common.ok'),
						callback: () => this.$modal.hide('ajaxError')
					}
				]
			});
		}
	}
};
