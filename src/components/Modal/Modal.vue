<template>
	<div class="modal">
		<modal
			v-bind="MODAL_PROPS"
			:name="name"
			@opened="setFocusToRef('keyboardTrap')"
			@closed="data => this.$emit('closed', data)"
		>
			<div class="modal__panel">
				<span tabindex="0" @focus="setFocusIn($refs.keyboardTrap, true)" />
				<div tabindex="0" ref="keyboardTrap" class="modal__keyboardTrap">
					<div class="modal__header">
						<h2 v-if="title" class="modal__title">
							{{ title }}
						</h2>
						<button class="modal__closeButton" @click="$modal.hide(name)">
							<span :aria-hidden="true">×</span>
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
			required: true
		},
		name: {
			type: String,
			reqired: true
		},
		title: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			MODAL_PROPS: {
				height: 'auto',
				scrollable: true
			}
		};
	}
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
	margin-left: auto; // fix position when no title exists
	margin-right: 0.5rem;
	border: none;
	font-size: @font-lead;
	line-height: 1;
	width: 2rem;
	height: 2rem;
	text-align: center;
	background: transparent;
	cursor: pointer;
}

.modal__closeButton:focus {
	outline: 0;
	border-radius: @radius;
	border: 1px solid @primary;
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
		margin-left: 0.5rem;
	}
}

.modal__keyboardTrap:focus {
	outline: 2px solid @primary;
	border-radius: @radius;
}

// Forms in modals
.modal {
	.pkpForm {
		margin: -1rem;
	}

	.pkpFormLocales {
		border-top: @bg-border-light;
	}

	.pkpFormGroup {
		padding-left: 1rem;
		padding-right: 1rem;
	}
}

// Tabs in modals
.modal {
	.pkpTabs {
		margin-left: -1rem;
		margin-right: -1rem;
	}

	.pkpTabs__buttons {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.pkpTab {
		border-left: none;
		border-right: none;
		border-bottom: none;
	}
}

[dir='rtl'] {
	.modal__footer {
		* + .pkpButton {
			margin-left: 0;
			margin-right: 0.5rem;
		}
	}
}
</style>
