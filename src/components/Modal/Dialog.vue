<template>
	<div class="modal__panel modal__panel--dialog">
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
				<div v-html="message" />
			</div>
			<div class="modal__footer">
				<spinner v-if="isLoading" />
				<slot name="actions">
					<pkp-button
						:isPrimary="true"
						:isDisabled="isLoading"
						@click="fireCallback"
					>
						{{ confirmLabel }}
					</pkp-button>
					<pkp-button
						v-if="cancelLabel"
						:isWarnable="true"
						:isDisabled="isLoading"
						@click="$modal.hide(name)"
					>
						{{ cancelLabel }}
					</pkp-button>
				</slot>
			</div>
		</div>
		<span tabindex="0" @focus="setFocusIn($refs.keyboardTrap)" />
	</div>
</template>

<script>
import Modal from './Modal.vue';

export default {
	extends: Modal,
	props: {
		actions: {
			type: Array,
			default() {
				return [];
			}
		},
		callback: {
			type: Function,
			required: true
		},
		cancelLabel: {
			type: String,
			default() {
				return '';
			}
		},
		closeCallback: {
			type: Function,
			default() {
				return () => {};
			}
		},
		confirmLabel: {
			type: String,
			reqired: true
		},
		message: {
			type: String,
			required: true
		},
		title: {
			type: String,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			isLoading: false
		};
	},
	methods: {
		fireCallback() {
			this.isLoading = true;
			this.callback();
		}
	},
	mounted() {
		this.setFocusToRef('keyboardTrap');
	},
	destroyed() {
		if (typeof this.closeCallback === 'function') {
			this.closeCallback();
		}
	}
};
</script>
