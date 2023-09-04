<template>
	<slot></slot>
	<PkpDialog
		:open="pkpIsDialogOpened"
		@close="pkpIsDialogOpened = false"
		v-bind="pkpDialogProps"
	></PkpDialog>
</template>
<script>
import PkpDialog from '../Modal/Dialog.vue';

export default {
	components: {
		PkpDialog,
	},
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
</script>
