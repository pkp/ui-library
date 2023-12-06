/**
 * Dialog mixin
 *
 * Helper function and configuration settings for opening
 * a simple modal
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */

import {useDialogStore} from '@/stores/dialogStore';

export default {
	methods: {
		/**
		 * Open a dialog modal
		 *
		 * @param {Object} props Props to pass to the <dialog> component
		 */
		openDialog(props, modalProps, modalEvents) {
			const dialogStore = useDialogStore();
			dialogStore.openDialog(props);
		},
	},
};
