/**
 * Modal mixins
 *
 * Modal mixins provide helper functions and configuration settings
 * for opening and closing modals
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
import Dialog from '@/components/Modal/Dialog.vue';
import ModalContent from '@/components/Modal/ModalContent.vue';

const MODAL_PROPS = {
	height: 'auto',
	scrollable: true
};

const MODAL_PROPS_DIALOG = {
	...MODAL_PROPS,
	classes: 'v--modal v--modal-dialog',
	scrollable: false
};

export default {
	components: {
		ModalContent
	},
	data() {
		return {
			MODAL_PROPS: MODAL_PROPS,
			MODAL_PROPS_DIALOG: MODAL_PROPS_DIALOG
		};
	},
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
					...MODAL_PROPS_DIALOG,
					...modalProps,
					name: props.modalName
				},
				modalEvents
			);
		},

		/**
		 * Set the focus to a ref
		 *
		 * Use this method to restore focus to where it was before the modal
		 * was opened.
		 *
		 * @param {String} ref
		 */
		setFocusToRef(ref) {
			if (this.$refs[ref]) {
				this.$refs[ref].$el.focus();
			}
		}
	}
};
