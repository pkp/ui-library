/**
 * Dialog mixin
 *
 * Helper function and configuration settings for opening
 * a simple modal
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */

export default {
	methods: {
		/**
		 * Open a dialog modal
		 *
		 * @param {Object} props Props to pass to the <dialog> component
		 */
		openDialog(props, modalProps, modalEvents) {
			this.$store.dialog.openDialog(props);
		},
	},
};
