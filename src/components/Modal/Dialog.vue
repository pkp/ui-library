<template>
	<div class="modal modal--dialog">
		<span tabindex="0" @focus="setFocusIn($refs.keyboardTrap, true)" />
		<div ref="keyboardTrap">
			<div class="modal__header">
				<h2 v-if="title" class="modal__title">
					{{ title }}
				</h2>
				<spinner v-if="isLoading" />
				<button class="modal__closeButton" @click="$modal.hide(modalName)">
					<span :aria-hidden="true">×</span>
					<span class="-screenReader">{{ closeLabel }}</span>
				</button>
			</div>
			<div class="modal__content">
				<slot>
					<div v-html="message" />
				</slot>
				<div class="modal__footer">
					<slot name="actions">
						<pkp-button :isDisabled="isLoading" @click="fireCallback">
							{{ confirmLabel }}
						</pkp-button>
						<pkp-button
							v-if="cancelLabel"
							:isWarnable="true"
							:isDisabled="isLoading"
							@click="$modal.hide(modalName)"
						>
							{{ cancelLabel }}
						</pkp-button>
					</slot>
				</div>
			</div>
		</div>
		<span tabindex="0" @focus="setFocusIn($refs.keyboardTrap)" />
	</div>
</template>

<script>
import ModalContent from './ModalContent.vue';

export default {
	extends: ModalContent,
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
	destroyed() {
		if (typeof this.closeCallback === 'function') {
			this.closeCallback();
		}
	}
};
</script>
