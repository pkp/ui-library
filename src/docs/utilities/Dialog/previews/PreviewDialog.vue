<template>
	<div class="previewDialog">
		<pkp-button @click="openBasicExample">Basic Example</pkp-button>
		<pkp-button @click="openFullExample">Full Example</pkp-button>
	</div>
</template>

<script>
import dialog from '@/mixins/dialog';

export default {
	mixins: [dialog],
	methods: {
		openBasicExample() {
			this.openDialog({
				name: 'basic',
				title: 'Submit Article',
				message: 'Are you sure you want to submit this article?',
				actions: [
					{
						label: 'Confirm',
						isPrimary: true,
						callback: () => {
							// Simulate a server request
							setTimeout(() => this.$modal.hide('basic'), 2000);
						}
					},
					{
						label: 'Cancel',
						isWarnable: true,
						callback: () => this.$modal.hide('basic')
					}
				]
			});
		},
		openFullExample() {
			this.openDialog({
				name: 'full',
				title: 'Several Actions',
				message:
					'This dialog includes an action that is a link (Visit Page). It also logs something to the console when the modal is closed. Dialogs should have 2 or 3 actions at the most.',
				actions: [
					{
						label: 'Confirm',
						isPrimary: true,
						callback: () => {
							// Simulate a server request
							setTimeout(() => this.$modal.hide('full'), 2000);
						}
					},
					{
						label: 'Visit Page',
						element: 'a',
						href: 'https://example.org'
					},
					{
						label: 'Cancel',
						isWarnable: true,
						callback: () => this.$modal.hide('full')
					}
				],
				close: () => console.log('closed full example dialog'), // eslint-disable-line
			});
		}
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.previewDialog .pkpButton {
	margin-right: 0.25rem;
}
</style>
