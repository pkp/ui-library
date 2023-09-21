/**
 * DialogProvider mixin
 *
 * Exposes openDialog method to the dialog mixin, used in root components (Page, App)
 *
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */

export default {
	methods: {
		pkpOpenDialog(props) {
			this.pkpDialogProps = props;
			this.pkpIsDialogOpened = true;
		},
	},
	data() {
		return {pkpIsDialogOpened: false, pkpDialogProps: {}};
	},
	provide() {
		return {
			pkpOpenDialog: this.pkpOpenDialog,
		};
	},
};
