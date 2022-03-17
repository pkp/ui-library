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
		 * @param {Object} modalProps Optional. Props to pass to this.$modal. See vue-js-modal docs
		 * @param {Object} modalEvents Optional. Events to pass to this.$modal. See vue-js-modal docs
		 */
		openDialog(props, modalProps, modalEvents) {
			const focusEl = document.activeElement;
			modalProps = modalProps || {};
			modalEvents = modalEvents || {};
			this.$modal.show(
				Dialog,
				{
					...props,
					close: () => {
						if (focusEl) {
							focusEl.focus();
						}
						if (props.close) {
							props.close();
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
