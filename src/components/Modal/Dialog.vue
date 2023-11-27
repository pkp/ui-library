<template>
	<TransitionRoot as="template" :show="open">
		<HLDialog class="modal" :class="'modal--' + type" @close="onClose">
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
							class="modal__panel modal__panel--dialog rounded-lg shadow-xl relative mx-3 w-10/12 max-w-3xl transform overflow-hidden bg-lightest text-left transition-all sm:my-8"
						>
							<div class="modal__header">
								<DialogTitle v-if="title" class="modal__title">
									{{ title }}
								</DialogTitle>
								<button class="modal__closeButton" @click="onClose">
									<span :aria-hidden="true">×</span>
									<span class="-screenReader">
										{{ closeLabel || t('common.close') }}
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
									:is-primary="action.isPrimary || null"
									:is-warnable="action.isWarnable || null"
									:is-disabled="isLoading"
									@click="
										action.callback ? fireCallback(action.callback) : null
									"
								>
									{{ action.label }}
								</pkp-button>
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
	DialogTitle,
	DialogPanel,
	TransitionRoot,
	TransitionChild,
} from '@headlessui/vue';

import Modal from './Modal.vue';

export default {
	components: {
		HLDialog,
		DialogTitle,
		DialogPanel,
		TransitionRoot,
		TransitionChild,
	},
	extends: Modal,
	props: {
		actions: {
			type: Array,
			required: true,
		},
		open: {
			type: Boolean,
			required: true,
		},
		close: {
			type: Function,
			default() {
				return () => {};
			},
		},
		closeLabel: {
			type: String,
		},
		message: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default() {
				return '';
			},
		},
	},
	data() {
		return {
			isLoading: false,
		};
	},
	mounted() {},
	unmounted() {
		if (typeof this.close === 'function') {
			this.close();
		}
	},
	methods: {
		fireCallback(callback) {
			this.isLoading = true;
			if (typeof callback === 'function') {
				callback(() => {
					this.onClose();
				});
			}
		},
		onClose() {
			// reset state;
			this.isLoading = false;
			this.$emit('close');
		},
	},
};
</script>
