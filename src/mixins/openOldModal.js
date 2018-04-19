/**
 * Mixin for launching a modal connected to the old JS framework.
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
export default {

	methods: {
		/**
		 * Create and display a modal that's part of the old JS framework
		 *
		 * @param object opts {
		 *	@required string title
		 *	@required string url URL to the handler which provides content
		 *	@option function closeCallback A callback function to fire when the
		 *		modal is closed. This is usually used to reset focus.
		 *		@see this.setFocusCallback
		 * }
		 * @param string modalHandler Optionally define the handler you want to
		 *  open. Default: $.pkp.controllers.modal.AjaxModalHandler
		 */
		openOldModal: function (opts, modalHandler) {
			modalHandler = modalHandler || '$.pkp.controllers.modal.AjaxModalHandler';
			$('<div id="' + $.pkp.classes.Helper.uuid() + '" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>')
				.pkpHandler(modalHandler, opts);
		},

		/**
		 * Create a callback function to set the focus on an element at a later time
		 *
		 * @param string selector Selector specifying the element to set focus to
		 */
		setFocusCallback: function (selector) {
			let self = this;
			return function () {
				self.$el.querySelector(selector).focus();
			};
		},
	},
};
