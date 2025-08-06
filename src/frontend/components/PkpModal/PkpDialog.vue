<template>
	<DialogRoot :open="opened" @update:open="handleCloseUpdate">
		<DialogPortal>
			<DialogOverlay class="pkp-dialog__overlay"></DialogOverlay>
			<DialogContent class="pkp-dialog__content" data-cy="dialog">
				<div class="pkp-dialog__wrapper">
					<div :class="dialogInnerClass" class="pkp-dialog__inner">
						<DialogClose
							v-if="shouldShowCloseButton"
							class="pkp-dialog__close"
							@click="onClose"
						>
							<PkpIcon
								class="pkp-dialog__close-icon"
								icon="Cancel"
								:aria-hidden="true"
							/>
							<span class="pkp-dialog__sr-only">
								{{ t('common.close') }}
							</span>
						</DialogClose>
						<div class="pkp-dialog__header">
							<DialogTitle
								v-if="title"
								:class="titleClass"
								class="pkp-dialog__title"
							>
								<div
									v-if="icon"
									:class="iconWrapperClass"
									class="pkp-dialog__icon-wrapper"
								>
									<PkpIcon :icon="icon" class="pkp-dialog__icon"></PkpIcon>
								</div>
								<span class="pkp-dialog__title-text">{{ title }}</span>
							</DialogTitle>
						</div>
						<slot>
							<component
								:is="bodyComponent"
								v-if="bodyComponent"
								v-bind="{...bodyProps, actions, message, onClose}"
								:has-icon="!!icon"
							/>
							<PkpDialogBody
								v-else
								v-bind="{...props, onClose, shouldShowCloseButton}"
								:has-icon="!!icon"
							></PkpDialogBody>
						</slot>
					</div>
				</div>
			</DialogContent>
		</DialogPortal>
	</DialogRoot>
</template>

<script setup>
import {computed} from 'vue';
import PkpDialogBody from './PkpDialogBody.vue';
import {
	DialogRoot,
	DialogPortal,
	DialogContent,
	DialogOverlay,
	DialogClose,
	DialogTitle,
} from 'reka-ui';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

const props = defineProps({
	/** Used only internally, don't pass this prop via openDialog */
	opened: {type: Boolean, default: false},
	/** Title of the dialog */
	title: {type: String, required: false, default: ''},
	/** Message to be displayed, for more complex messages use bodyComponent&bodyProps */
	message: {type: String, default: null},
	/** For more complex messages Vue.js component can be passed */
	bodyComponent: {type: Object, default: null},
	/** Props to be passed to bodyComponent */
	bodyProps: {type: Object, default: null},
	/** Array of button props to display actions, following props are passed to button component: label, element, href, isPrimary, isWarnable, callback */
	actions: {type: Array, default: () => []},
	/** Callback when dialog is being closed by close button or clicking outside of the modal */
	close: {type: Function, default: null},
	/** Defines the visual style of the modal: 'basic' (no border style)', 'primary', 'negative', or 'success'. */
	modalStyle: {
		type: String,
		default: () => 'primary',
		validator: (value) =>
			['primary', 'negative', 'success', 'basic'].includes(value),
	},
	/** Defines if clicking outside the modal should close it */
	isDismissible: {
		type: Boolean,
		default: () => true,
	},
	/** Defines if the close button (x) should be shown */
	/** If not set, the close button will be shown if there are no actions */
	showCloseButton: {
		type: Boolean,
		default: undefined,
	},
});

const shouldShowCloseButton = computed(() => {
	if (props.showCloseButton !== undefined) {
		return props.showCloseButton;
	}
	return !props.actions?.length;
});

const dialogInnerClass = computed(() => [
	'pkp-dialog__inner--' + props.modalStyle,
]);

const titleClass = computed(() => [
	icon.value ? 'pkp-dialog__title--with-icon' : '',
]);

const icon = computed(() => {
	switch (props.modalStyle) {
		case 'negative':
			return 'Cancel';
		case 'success':
			return 'Complete';
		default:
			return null;
	}
});

const iconWrapperClass = computed(() => [
	'pkp-dialog__icon-wrapper--' + props.modalStyle,
]);

const emit = defineEmits(['close']);

function handleCloseUpdate(opened) {
	if (!opened) {
		onClose('default');
	}
}

function onClose(triggerOrigin) {
	// Prevent closing the modal on outside clicks or "Esc" key presses if isDismissible is false
	if (!props.isDismissible && triggerOrigin === 'default') {
		return;
	}
	if (props.close) {
		props.close();
	}
	emit('close');
}
</script>

<style>
@keyframes pkp-dialog-fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes pkp-dialog-fade-out {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}

.pkp-dialog__overlay[data-state='open'] {
	animation: pkp-dialog-fade-in 300ms ease-out;
}

.pkp-dialog__overlay[data-state='closed'] {
	animation: pkp-dialog-fade-out 300ms ease-in;
}

/* Mobile (default): fade + slide only */
@keyframes pkp-dialog-content-enter-mobile {
	0% {
		opacity: 0;
		transform: translateY(var(--pkp-spacing-4));
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pkp-dialog-content-exit-mobile {
	0% {
		opacity: 1;
		transform: translateY(0);
	}
	100% {
		opacity: 0;
		transform: translateY(var(--pkp-spacing-4));
	}
}

.pkp-dialog__content[data-state='open'] {
	animation: pkp-dialog-content-enter-mobile 300ms ease-out forwards;
}

.pkp-dialog__content[data-state='closed'] {
	animation: pkp-dialog-content-exit-mobile 200ms ease-in forwards;
}

@keyframes pkp-dialog-content-enter-desktop {
	0% {
		opacity: 0;
		transform: scale(0.95);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes pkp-dialog-content-exit-desktop {
	0% {
		opacity: 1;
		transform: scale(1);
	}
	100% {
		opacity: 0;
		transform: scale(0.95);
	}
}

/* Desktop (sm and up): fade + scale only (no slide) */
@media (min-width: 640px) {
	.pkp-dialog__content[data-state='open'] {
		animation: pkp-dialog-content-enter-desktop 300ms ease-out forwards;
	}
	.pkp-dialog__content[data-state='closed'] {
		animation: pkp-dialog-content-exit-desktop 200ms ease-in forwards;
	}
}

.pkp-dialog__overlay {
	position: fixed;
	inset: 0;
	z-index: 10;
	background-color: var(--pkp-background-color-blur);
}

.pkp-dialog__content {
	position: fixed;
	inset: 0;
	z-index: 20;
	overflow-y: auto;
	pointer-events: none !important;
}

.pkp-dialog__wrapper {
	display: flex;
	min-height: 100%;
	align-items: flex-end;
	justify-content: center;
	padding: var(--pkp-spacing-4);
	text-align: center;
}

@media (min-width: 640px) {
	.pkp-dialog__wrapper {
		align-items: flex-start;
		padding: 0;
	}
}

.pkp-dialog__inner {
	position: relative;
	margin-left: var(--pkp-spacing-3);
	margin-right: var(--pkp-spacing-3);
	width: 83.333333%; /* 10/12 */
	max-width: calc(48rem);
	transform: none;
	overflow: hidden;
	pointer-events: auto;
	border-radius: var(--pkp-radius);
	background-color: var(--pkp-background-color-secondary);
	text-align: start;
	box-shadow: var(--pkp-shadow);
	transition: all 0.3s ease;
}

.pkp-dialog__inner--basic {
	border: none;
}

.pkp-dialog__inner--primary {
	border-left: 14px solid var(--pkp-color-primary);
}

.pkp-dialog__inner--success {
	border-left: 14px solid var(--pkp-color-success);
}

.pkp-dialog__inner--negative {
	border-left: 14px solid var(--pkp-color-negative);
}

.pkp-dialog__close {
	position: absolute;
	right: var(--pkp-spacing-3);
	top: var(--pkp-spacing-3);
	cursor: pointer;
	background-color: transparent;
}

.pkp-dialog__close-icon {
	height: calc(1.5 * var(--pkp-text-base-size)); /* h-6 = 24px */
	width: calc(1.5 * var(--pkp-text-base-size)); /* w-6 = 24px */
	color: var(--pkp-color-negative);
}

.pkp-dialog__sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

.pkp-dialog__header {
	display: flex;
	min-height: calc(3 * var(--pkp-text-base-size)); /* min-h-12 = 48px */
	align-items: center;
}

.pkp-dialog__title {
	margin: 0;
	display: inline-flex;
	min-width: 1px;
	align-items: center;
	overflow-x: hidden;
	text-overflow: ellipsis;
	padding-left: var(--pkp-spacing-8);
	padding-right: var(--pkp-spacing-8);
	padding-top: var(--pkp-spacing-12);
	padding-bottom: var(--pkp-spacing-8);
	font: var(--pkp-font-4xl-bold);
}

.pkp-dialog__title--with-icon {
	padding-bottom: var(--pkp-spacing-5);
}

.pkp-dialog__icon-wrapper {
	display: flex;
	height: calc(3 * var(--pkp-text-base-size)); /* h-12 = 48px */
	width: calc(3 * var(--pkp-text-base-size)); /* w-12 = 48px */
	align-items: center;
	justify-content: center;
	border-radius: var(--pkp-radius-full);
}

.pkp-dialog__icon-wrapper--success {
	background-color: var(--pkp-color-success);
}

.pkp-dialog__icon-wrapper--negative {
	background-color: var(--pkp-color-negative);
}

.pkp-dialog__icon {
	height: calc(2.75 * var(--pkp-text-base-size)); /* h-11 ≈ 44px */
	width: calc(2.75 * var(--pkp-text-base-size)); /* w-11 ≈ 44px */
	color: var(--pkp-text-color-on-dark);
}

.pkp-dialog__title-text {
	padding-left: var(--pkp-spacing-4);
	padding-right: var(--pkp-spacing-4);
}
</style>
