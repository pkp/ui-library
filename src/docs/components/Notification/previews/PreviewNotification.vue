<template>
	<div class="previewNotification">
		<notification>
			Revisions have been submitted and a decision is required.
		</notification>
		<notification type="success">
			This article has been been successfully published.
			<a href="#">View Article</a>
			.
		</notification>
		<notification type="warning">
			<icon icon="exclamation-triangle" :inline="true" />
			This submission does not have any contributors. At least one contributor
			must be provided.
		</notification>
		<notification v-if="!dismissed" :canDismiss="true" @dismiss="dismiss">
			This notification can be dismissed.
		</notification>
	</div>
</template>

<script>
import Notification from '@/components/Notification/Notification.vue';

export default {
	components: {
		Notification
	},
	data() {
		return {
			dismissed: false
		};
	},
	methods: {
		dismiss() {
			this.dismissed = true;
		}
	}
};
</script>

<style lang="less">
.previewNotification > .pkpNotification + .pkpNotification {
	margin-top: 1rem;
}
</style>
