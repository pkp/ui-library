<template>
	<pkp-button @click="openExampleDialog">Dialog</pkp-button>
</template>

<script>
import dialog from '@/mixins/dialog';

export default {
	mixins: [dialog],
	methods: {
		openExampleDialog() {
			this.openDialog({
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				message: 'Are you sure you want to submit this article?',
				name: 'dialog',
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
