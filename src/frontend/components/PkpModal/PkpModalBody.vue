<template>
	<DialogContent
		class="pkpModalBody__content"
		as-child
		@open-auto-focus="handleAutoFocus"
	>
		<div :id="containerId" class="pkpModalBody__container">
			<div class="pkpModalBody__wrapper">
				<div class="pkpModalBody__header">
					<div class="pkpModalBody__headerStart">
						<div class="pkpModalBody__headerContent" data-cy="sidemodal-header">
							<div class="pkpModalBody__headerFlex">
								<div class="pkpModalBody__headerGrow">
									<!-- @slot Small text above title, might be useful for example for example to display submission Id-->
									<div class="pkpModalBody__preTitle">
										<slot name="pre-title"></slot>
									</div>
									<DialogTitle
										as="h1"
										class="pkpModalBody__title"
										tabindex="-1"
									>
										<!-- @slot Main title, also used for accessibility (aria-labelledby) -->
										<slot name="title"></slot>
									</DialogTitle>
									<DialogDescription class="pkpModalBody__description">
										<!-- @slot Optionally descrition, also used for accessibility (aria-describedby) -->
										<slot name="description"></slot>
									</DialogDescription>
									<div class="pkpModalBody__postDescription">
										<!-- @slot For additional information that needs to be in the modal header add it here, check submissionSummaryModal.vue for good example -->
										<slot name="post-description"></slot>
									</div>
								</div>
								<div class="pkpModalBody__headerActions">
									<!-- @slot Optionally actions buttons that are placed on the right side of header -->
									<slot name="actions" />
								</div>
							</div>
						</div>
						<div class="pkpModalBody__closeWrapper">
							<DialogClose
								ref="closeModalButton"
								type="button"
								class="pkpModalBody__close"
							>
								<span class="pkpModalBody__srOnly">
									{{ t('common.close') }}
								</span>
								<PkpIcon
									class="pkpModalBody__closeIcon"
									icon="Cancel"
									:aria-hidden="true"
								/>
							</DialogClose>
						</div>
					</div>
				</div>
				<!-- pkpModalBody__scrollContainer is important for scrolling within form-->
				<div class="pkpModalBody__scrollContainer">
					<!-- @slot Body content -->
					<slot :close-modal="closeModal" />
				</div>
			</div>
		</div>
	</DialogContent>
</template>

<script setup>
import {inject, useId} from 'vue';
import {
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from 'reka-ui';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {focusFirstHeading} from '@/components/Modal/modalHelpers';

const containerId = useId();
import {useLocalize} from '@/composables/useLocalize';
const {t} = useLocalize();
const closeModal = inject('closeModal');
const closeModalButton = inject('closeModalButton');
/* Initial focus */
function handleAutoFocus(event) {
	const container = document.getElementById(containerId);
	if (container) {
		focusFirstHeading(container, event);
	}
}
</script>

<style>
/* Mobile (default): fade + slide from bottom */
@keyframes pkpModalBodyContentEnterMobile {
	0% {
		opacity: 0;
		transform: translateY(var(--pkp-spacing-4));
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pkpModalBodyContentExitMobile {
	0% {
		opacity: 1;
		transform: translateY(0);
	}
	100% {
		opacity: 0;
		transform: translateY(var(--pkp-spacing-4));
	}
}

/* Desktop: fade + scale */
@keyframes pkpModalBodyContentEnterDesktop {
	0% {
		opacity: 0;
		transform: scale(0.95);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes pkpModalBodyContentExitDesktop {
	0% {
		opacity: 1;
		transform: scale(1);
	}
	100% {
		opacity: 0;
		transform: scale(0.95);
	}
}

.pkpModalBody__content[data-state='open'] {
	animation: pkpModalBodyContentEnterMobile 300ms ease-out forwards;
}

.pkpModalBody__content[data-state='closed'] {
	animation: pkpModalBodyContentExitMobile 200ms ease-in forwards;
}

@media (min-width: 640px) {
	.pkpModalBody__content[data-state='open'] {
		animation: pkpModalBodyContentEnterDesktop 300ms ease-out forwards;
	}
	.pkpModalBody__content[data-state='closed'] {
		animation: pkpModalBodyContentExitDesktop 200ms ease-in forwards;
	}
}

.pkpModalBody__container {
	position: fixed;
	inset: 0;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding: var(--pkp-spacing-4);
	text-align: center;
	pointer-events: none !important;
}

@media (min-width: 640px) {
	.pkpModalBody__container {
		align-items: center;
		padding: 0;
	}
}

.pkpModalBody__wrapper {
	position: relative;
	margin-left: var(--pkp-spacing-3);
	margin-right: var(--pkp-spacing-3);
	width: 83.333333%; /* w-10/12 */
	max-width: calc(
		48 * var(--pkp-text-base-size)
	); /* max-w-3xl equivalent, assuming 1rem base = 48rem */
	transform: none;
	overflow: hidden;
	pointer-events: auto;
	border-radius: var(--pkp-radius);
	background-color: var(--pkp-background-color-secondary);
	text-align: start;
	box-shadow: var(--pkp-shadow);
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	pointer-events: auto;
}

@media (min-width: 640px) {
	.pkpModalBody__wrapper {
		margin-block: var(--pkp-spacing-8);
	}
}

.pkpModalBody__topNav {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: var(--pkp-spacing-4);
	background-color: var(--pkp-background-color-selection-dark);
	height: calc(3 * var(--pkp-text-base-size)); /* h-12 */
}

.pkpModalBody__header {
	margin-top: var(--pkp-spacing-4);
}

.pkpModalBody__headerStart {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.pkpModalBody__closeWrapper {
	margin-inline-end: var(--pkp-spacing-4);
}

.pkpModalBody__close {
	display: inline-flex;
	border-radius: var(--pkp-radius);
	color: var(--pkp-text-color-secondary); /* gray-400 */
	position: relative;
	outline: none;
	background-color: var(--pkp-background-color-secondary);
}

.pkpModalBody__close:hover {
	color: var(--pkp-text-color-default); /* gray-500 */
}

.pkpModalBody__close:focus {
	ring: 2px solid var(--pkp-color-primary);
	ring-offset: 2px;
}

.pkpModalBody__srOnly {
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

.pkpModalBody__closeIcon {
	height: calc(
		1.5 * var(--pkp-text-base-size)
	); /* Adjust for typical close X size, e.g., 24px */
	width: calc(1.5 * var(--pkp-text-base-size));
	color: var(--pkp-text-color-secondary);
}

.pkpModalBody__headerContent {
	margin-left: var(--pkp-spacing-4);
	margin-right: var(--pkp-spacing-4);
	flex-grow: 1;
}

.pkpModalBody__headerFlex {
	display: flex;
}

.pkpModalBody__headerGrow {
	flex-grow: 1;
}

.pkpModalBody__preTitle {
	font: var(--pkp-font-xl-medium);
}

.pkpModalBody__title {
	margin-top: var(--pkp-spacing-1);
	display: inline-block;
	font: var(--pkp-font-4xl-bold);
	color: var(--pkp-text-color-heading);
	outline: none;
}

.pkpModalBody__title:focus-visible {
	ring: 2px solid var(--pkp-color-primary);
	ring-offset: 2px;
}

.pkpModalBody__description {
	margin-top: var(--pkp-spacing-1);
	font: var(--pkp-font-3xl-normal);
}

.pkpModalBody__postDescription {
	margin-top: var(--pkp-spacing-1);
}

.pkpModalBody__headerActions {
	display: flex;
	flex: none;
	align-items: center;
}

.pkpModalBody__scrollContainer {
	position: relative;
	margin-top: var(--pkp-spacing-6);
	flex: 1 1 auto;
	overflow-y: auto; /* Changed from scroll to auto to hide scrollbar when not needed */
}
</style>
