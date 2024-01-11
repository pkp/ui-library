/**
 * Dialog mixin
 *
 * Helper function and configuration settings for opening
 * a simple modal
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */

import {useModalStore} from '@/stores/modalStore';

export default {
	methods: {
		/**
		 * Open a dialog modal
		 *
		 * @param {Object} props Props to pass to the <dialog> component
		 */
		openDialog(props, modalProps, modalEvents) {
			const modalStore = useModalStore();
			modalStore.openDialog(props);
		},
	},
};
