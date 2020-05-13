<template>
	<pkp-button @click="openExampleDialog">Dialog</pkp-button>
</template>

<script>
import modal from '@/mixins/modal';

export default {
	mixins: [modal],
	methods: {
		openExampleDialog() {
			this.openDialog({
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				message: 'Are you sure you want to submit this article?',
				modalName: 'dialog',
				title: 'Submit Article',
				callback: () => {
					// Simulate a server request
					setTimeout(() => {
						this.$modal.hide('dialog');
					}, 2000);
				}
			});
		}
	}
};
</script>
