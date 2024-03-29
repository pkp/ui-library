<template>
	<div class="pkpNotification" :class="classes">
		<slot />
		<button
			v-if="canDismiss"
			class="pkpNotification__closeButton"
			@click="$emit('dismiss')"
		>
			<span :aria-hidden="true">×</span>
			<span class="-screenReader">{{ t('common.close') }}</span>
		</button>
	</div>
</template>

<script>
export default {
	props: {
		canDismiss: {
			type: Boolean,
			default() {
				return false;
			},
		},
		/** The type of notification. Pass `warning` for notifications about errors or serious problems. */
		type: {
			type: String,
			default() {
				return '';
			},
		},
	},
	computed: {
		classes() {
			let classes = [];
			if (this.type) {
				classes.push('pkpNotification--' + this.type);
			}
			if (this.canDismiss) {
				classes.push('pkpNotification--canDismiss');
			}
			return classes;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpNotification {
	position: relative;
	padding: 0.5rem 0.75rem;
	background: @lift;
	border: 1px solid @primary;
	border-radius: @radius;
	box-shadow: inset 0.25rem 0 0 @primary;
	font-size: @font-sml;
	line-height: 1.6em;
}

.pkpNotification--success {
	border-color: @yes;
	box-shadow: inset 0.25rem 0 0 @yes;
}

.pkpNotification--warning {
	border-color: @no;
	box-shadow: inset 0.25rem 0 0 @no;
}

.pkpNotification--canDismiss {
	padding-inline-end: 2.5rem;
}

.pkpNotification--backendPage__header {
	margin-bottom: 1rem;
}

.pkpNotification__closeButton {
	position: absolute;
	top: 0;
	right: 0;
	border: 1px solid transparent;
	margin: 0.25rem;
	padding: 0;
	width: 2rem;
	height: 1.9rem;
	line-height: 1;
	text-align: center;
	background: transparent;
	font-size: @font-lead;
	line-height: 1;
	cursor: pointer;

	&:focus {
		outline: 0;
		border-radius: @radius;
		border: 1px solid @primary;
	}
}

[dir='rtl'] {
	.pkpNotification {
		box-shadow: inset -0.25rem 0 0 @primary;
	}

	.pkpNotification--success {
		box-shadow: inset -0.25rem 0 0 @yes;
	}

	.pkpNotification--warning {
		box-shadow: inset -0.25rem 0 0 @no;
	}

	.pkpNotification__closeButton {
		right: auto;
		left: 0;
	}
}
</style>
