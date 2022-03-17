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
					<span class="-screenReader">
						{{ closeLabel || __('common.close') }}
					</span>
				</button>
			</div>
			<div class="modal__content">
				<div v-html="message" />
			</div>
			<div class="modal__footer">
				<spinner v-if="isLoading" />
				<pkp-button
					v-for="action in actions"
					:key="action.label"
					:element="action.element || 'button'"
					:href="action.href || null"
					:isPrimary="action.isPrimary || null"
					:isWarnable="action.isWarnable || null"
					:isDisabled="isLoading"
					@click="action.callback ? fireCallback(action.callback) : null"
				>
					{{ action.label }}
				</pkp-button>
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
			required: true
		},
		close: {
			type: Function,
			default() {
				return () => {};
			}
		},
		closeLabel: {
			type: String
		},
		message: {
			type: String,
			required: true
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
			isLoading: false
		};
	},
	methods: {
		fireCallback(callback) {
			this.isLoading = true;
			if (typeof callback === 'function') {
				callback();
			}
		}
	},
	mounted() {
		this.setFocusToRef('keyboardTrap');
	},
	destroyed() {
		if (typeof this.close === 'function') {
			this.close();
		}
	}
};
</script>
