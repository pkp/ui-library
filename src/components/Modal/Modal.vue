<template>
	<TransitionRoot as="template" :show="open">
		<HLDialog
			:open="open"
			class="modal"
			:class="'modal--' + type"
			@close="$emit('close')"
		>
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div
					class="bg-gray-500 fixed inset-0 z-10 bg-opacity-75 transition-opacity"
				/>
			</TransitionChild>
			<div class="fixed inset-0 z-20 overflow-y-auto">
				<div
					class="flex min-h-full items-end justify-center p-4 text-center sm:items-start sm:p-0"
				>
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<DialogPanel
							class="modal__panel relative mx-3 w-10/12 max-w-3xl transform overflow-hidden rounded bg-secondary text-left shadow transition-all sm:my-8"
						>
							<div class="modal__header">
								<div class="modal__header__slot">
									<slot name="header">
										<DialogTitle v-if="title" class="modal__title">
											{{ title }}
										</DialogTitle>
									</slot>
								</div>
								<button class="modal__closeButton" @click="$emit('close')">
									<Icon
										icon="Cancel"
										:class="'h-5 w-5 text-negative'"
										:aria-hidden="true"
										class="modal__closeButton__x"
									/>
									<Icon
										icon="ChevronLeft"
										:aria-hidden="true"
										class="modal__closeButton__left h-5 w-5"
									/>
									<Icon
										icon="ChevronRight"
										:aria-hidden="true"
										class="modal__closeButton__right h-5 w-5"
									/>
									<span class="-screenReader">{{ closeLabel }}</span>
								</button>
							</div>
							<div class="modal__content">
								<slot />
							</div>
							<div v-if="!!$slots.footer" class="modal__footer">
								<slot name="footer" />
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</HLDialog>
	</TransitionRoot>
</template>

<script>
import {
	Dialog as HLDialog,
	DialogPanel,
	DialogTitle,
	TransitionRoot,
	TransitionChild,
} from '@headlessui/vue';

import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {
		HLDialog,
		DialogPanel,
		DialogTitle,
		TransitionRoot,
		TransitionChild,
		Icon,
	},

	props: {
		/** Control whether Modal is Opened */
		open: {
			type: Boolean,
			required: true,
		},
		/** The accessible text on the modal's close icon (×). Required */
		closeLabel: {
			type: String,
			required: true,
		},
		/** The title to display at the top of the modal. This is optional but should be used in most cases.  */
		title: {
			type: String,
			default() {
				return '';
			},
		},
		type: {
			type: String,
			default() {
				return 'popup';
			},
			validator(value) {
				return ['popup', 'side'].includes(value);
			},
		},
	},
	emits: [
		/** When the modal should be closed. */
		'close',
	],
	data() {
		return {
			isOpen: true,
			MODAL_PROPS: {
				height: 'auto',
				scrollable: true,
			},
		};
	},
	methods: {},
};
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
	.pkpTabs {
		.pkpTabs {
			margin-inline-start: -2rem;
			margin-inline-end: -2rem;
		}
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
