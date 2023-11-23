<template>
	<TransitionRoot as="template" :show="open">
		<HLDialog as="div" class="relative z-10" @close="handleClose">
			<TransitionChild
				as="template"
				enter="ease-in-out duration-500"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in-out duration-500"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-blur transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-hidden">
				<div class="absolute inset-0 overflow-hidden">
					<div
						class="pointer-events-none fixed inset-y-0 flex max-w-full ltr:right-0 ltr:pl-10 rtl:left-0 rtl:pr-10"
					>
						<TransitionChild
							as="template"
							enter="transform transition ease-in-out duration-500"
							enter-from="ltr:translate-x-full rtl:-translate-x-full"
							enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-500"
							leave-from="translate-x-0"
							leave-to="ltr:translate-x-full rtl:-translate-x-full"
						>
							<div>
								<slot />
							</div>
						</TransitionChild>
					</div>
				</div>
			</div>
		</HLDialog>
	</TransitionRoot>
</template>

<script setup>
import {ref, provide, defineProps, defineEmits} from 'vue';
import {
	Dialog as HLDialog,
	TransitionRoot,
	TransitionChild,
} from '@headlessui/vue';

defineProps({
	open: {
		type: Boolean,
		required: true,
	},

	closeLabel: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(['close']);

const closeCallbacks = ref([]);
function registerCloseCallback(callback) {
	closeCallbacks.value.push(callback);
}

function handleClose() {
	let canClose = true;
	closeCallbacks.value.forEach((callback) => (canClose = callback()));
	if (canClose) {
		emit('close');
	} else {
		console.log('not closing yet');
	}
}

provide('closeModal', handleClose);
provide('registerCloseCallback', registerCloseCallback);
</script>

<style lang="less">
@import '../../styles/_import';

/**
 * All styles for the side modals
 *
 * The side modal is intended to become the default
 * for all modals. See comment below regarding the
 * popup modals.
 */
.modal--side {
	.modal__header {
		display: grid;
		grid-template-columns: 3rem auto;
		position: sticky;
		top: 0;
		background: @bg;
	}

	.modal__header__slot {
		padding: 0.5rem 0;
	}

	.modal__closeButton {
		order: -1;
		width: 3rem;
		height: 3rem;
		padding: 0;
		border: none;
		background: none;

		&:focus-visible {
			outline: 2px solid @primary;
		}
	}

	.modal__closeButton__x,
	.modal__closeButton__right {
		display: none;
	}

	.modal__content {
		padding: 1rem;
	}
}

[dir='rtl'] .modal--side {
	.modal__closeButton__left {
		display: none;
	}

	.modal__closeButton__right {
		display: inline-block;
	}
}

@media (min-width: 992px) {
	.modal--side {
		.v--modal.v--modal {
			left: auto !important;
			width: 90vw !important;
			max-width: 65rem;
			height: 100vh !important;
		}

		.modal__header {
			grid-template-columns: auto 4rem;
		}

		.modal__header__slot {
			padding: 1rem;
		}

		.modal__closeButton {
			order: initial;
			font-size: 2rem;
			width: 4rem;
			height: 4rem;
		}

		.modal__closeButton__left {
			display: none;
		}

		.modal__closeButton__x {
			display: inline-block;
		}
	}

	[dir='rtl'] {
		.modal--side {
			.v--modal.v--modal {
				left: 0 !important;
				right: auto !important;
			}

			.modal__closeButton {
				left: 0;
				right: unset;
			}

			.modal__closeButton__right {
				display: none;
			}
		}
	}
}

@media (min-width: 1280px) {
	.modal--side {
		.v--modal.v--modal {
			width: 80vw !important;
		}
	}
}

/**
 * Isolate all of the styles for a popup modal
 *
 * As part of UX changes, our designer is encouraging us to move to
 * the side-panel style of modal. Ideally, popup modals will only
 * be used for simple Dialogs. Until then, these styles will need
 * to remain to support existing uses of the pop-up modal.
 */
.modal--popup {
	.modal__panel {
		font-size: @font-sml;
		line-height: @line-sml;
	}

	.modal__header {
		display: flex;
		align-items: center;
		min-height: 3rem;
	}

	.modal__title {
		margin: 0;
		min-width: 1px;
		padding: 0.5rem 1rem;
		font-size: @font-base;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	.modal__closeButton {
		margin-inline-start: auto; // fix position when no title exists
		margin-inline-end: 0.5rem;
		border: none;
		font-size: @font-lead;
		line-height: 1;
		width: 2rem;
		height: 2rem;
		text-align: center;
		background: transparent;
		cursor: pointer;
	}

	.modal__closeButton:focus-visible {
		outline: 0;
		border-radius: @radius;
		border: 1px solid @primary;
	}

	.modal__closeButton__left,
	.modal__closeButton__right {
		display: none;
	}

	.modal__content {
		padding: 1rem;

		> p:first-child {
			margin-top: 0;
		}

		> p:last-child {
			margin-bottom: 0;
		}
	}

	.modal__footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 1rem;

		* + .pkpButton {
			margin-inline-start: 0.5rem;
		}
	}

	// Forms in popupmodals
	.pkpForm {
		margin: -1rem;
	}

	.pkpFormLocales {
		border-top: @bg-border-light;
	}

	.pkpFormGroup {
		padding-inline-start: 1rem;
		padding-inline-end: 1rem;
	}

	// Tabs in popup modals
	.pkpTabs {
		margin-inline-start: -1rem;
		margin-inline-end: -1rem;
	}

	.pkpTabs__buttons {
		padding-inline-start: 1rem;
		padding-inline-end: 1rem;
	}

	.pkpTab {
		border-left: none;
		border-right: none;
		border-bottom: none;
	}
}

// Override collapsed padding when a popup
// modal is nested inside of a section
.panelSection .modal--popup .pkpFormGroup {
	padding: 2rem 1rem;
}
</style>
