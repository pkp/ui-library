<template>
	<div class="modal" :class="'modal--' + type">
		<modal
			v-bind="MODAL_PROPS"
			:name="name"
			@opened="setFocusToRef('keyboardTrap')"
			@closed="(data) => this.$emit('closed', data)"
		>
			<div class="modal__panel">
				<span tabindex="0" @focus="setFocusIn($refs.keyboardTrap, true)" />
				<div tabindex="0" ref="keyboardTrap" class="modal__keyboardTrap">
					<div class="modal__header">
						<div class="modal__header__slot">
							<slot name="header">
								<h2 v-if="title" class="modal__title">
									{{ title }}
								</h2>
							</slot>
						</div>
						<button
							class="modal__closeButton"
							@click.stop.prevent="$modal.hide(name)"
						>
							<icon
								icon="times"
								:aria-hidden="true"
								class="modal__closeButton__x"
							/>
							<icon
								icon="chevron-left"
								:aria-hidden="true"
								class="modal__closeButton__left"
							/>
							<icon
								icon="chevron-right"
								:aria-hidden="true"
								class="modal__closeButton__right"
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
				</div>
				<span tabindex="0" @focus="setFocusIn($refs.keyboardTrap)" />
			</div>
		</modal>
	</div>
</template>

<script>
export default {
	props: {
		closeLabel: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			reqired: true,
		},
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
	data() {
		return {
			MODAL_PROPS: {
				height: 'auto',
				scrollable: true,
			},
		};
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

// vue-js-modal
.v--modal-overlay.v--modal-overlay {
	background: rgba(0, 0, 0, 0.5);
}

.v--modal-background-click {
	padding-top: 1rem;
	padding-bottom: 1rem;
}

// Don't cut off dropdowns or autosuggest
.v--modal-overlay .v--modal-box.v--modal-box {
	overflow: visible;
}

// Fix text alignment overrides in right-to-left languages
.v--modal.v--modal {
	text-align: unset;
}

.modal__keyboardTrap:focus-visible {
	outline: 2px solid @primary;
	border-radius: @radius;
}

/**
 * All styles for the side modals
 *
 * The side modal is intended to become the default
 * for all modals. See comment below regarding the
 * popup modals.
 */
.modal--side {
	.v--modal-background-click {
		padding: 0 !important;
	}

	.v--modal.v--modal {
		position: fixed;
		top: unset !important;
		left: 0 !important;
		bottom: 0 !important;
		right: 0 !important;
		width: 100vw !important;
		max-height: 100vh;
		overflow-y: scroll;
		margin: 0 !important;
		border-radius: 0;
		background: @bg;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
	}

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
	// Use our own positioning strategy to work around
	// flickering that occurs when resizing the browser
	.v--modal.v--modal {
		top: 0 !important;
		left: 0 !important;
		bottom: auto !important;
		right: auto !important;
		width: 90% !important;
		max-width: 50rem;
		margin-left: auto;
		margin-right: auto;
	}

	.v--modal-dialog.v--modal-dialog {
		top: 50vh !important;
		transform: translateY(-75%);
		max-width: 30rem;
	}

	// Don't center a dialog when it is scrollable
	.v--modal-overlay.scrollable .v--modal-dialog.v--modal-dialog {
		top: 0 !important;
		transform: none;
		max-width: 50rem;
	}

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
