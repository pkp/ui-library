/**
 * Dialog mixin
 *
 * Helper function and configuration settings for opening
 * a simple modal
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
import Dialog from '@/components/Modal/Dialog.vue';

export default {
	methods: {
		/**
		 * Open a dialog modal
		 *
		 * @param {Object} props Props to pass to the <dialog> component
		 * @param {Object} modalProps Props to pass to this.$modal. See vue-js-modal docs
		 * @param {Object} modalEvents Events to pass to this.$modal. See vue-js-modal docs
		 */
		openDialog(props, modalProps, modalEvents) {
			const focusEl = document.activeElement;
			props.closeLabel = props.closeLabel || this.__('common.close');
			props.confirmLabel = props.confirmLabel || this.__('common.yes');
			modalProps = modalProps || {};
			modalEvents = modalEvents || {};
			this.$modal.show(
				Dialog,
				{
					...props,
					closeCallback: () => {
						if (focusEl) {
							focusEl.focus();
						}
						if (props.closeCallback) {
							props.closeCallback();
						}
					}
				},
				{
					height: 'auto',
					scrollable: false,
					classes: 'v--modal v--modal-dialog',
					...modalProps,
					name: props.name
				},
				modalEvents
			);
		}
	}
};
