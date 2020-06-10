<template>
	<div class="previewNotify">
		<pkp-button @click="notify('This is an example notice.')">
			Notice
		</pkp-button>
		<pkp-button
			@click="notify('This issue has been successfully published.', 'success')"
		>
			Success
		</pkp-button>
		<pkp-button
			@click="
				notify(
					'An unexpected error has occurred. Please refresh the page and try again.',
					'warning'
				)
			"
		>
			Warning
		</pkp-button>
		<pkp-button :isWarnable="true" @click="clearAll">
			Clear All Notifications
		</pkp-button>
		<div
			aria-live="polite"
			aria-atomic="true"
			class="app__notifications"
			ref="notifications"
			role="status"
		>
			<transition-group name="app__notification">
				<notification
					v-for="notification in notifications"
					:key="notification.key"
					:type="notification.type"
					:can-dismiss="true"
					@dismiss="dismissNotification(notification.key)"
				>
					{{ notification.message }}
				</notification>
			</transition-group>
		</div>
	</div>
</template>

<script>
import Page from '@/components/Container/Page.vue';

export default {
	extends: Page,
	methods: {
		clearAll() {
			pkp.eventBus.$emit('clear-all-notify');
		},
		notify(message, type) {
			pkp.eventBus.$emit('notify', message, type);
		}
	}
};
</script>

<style lang="less">
.previewNotify > .pkpButton + .pkpButton {
	margin-left: 0.25rem;
}
</style>
