<template>
	<TransitionRoot as="template" :show="opened">
		<HLDialog class="modal" @close="onClose">
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
					class="fixed inset-0 z-10 bg-blur bg-opacity-75 transition-opacity"
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
							class="modal__panel modal__panel--dialog relative mx-3 w-10/12 max-w-3xl transform overflow-hidden rounded bg-secondary text-start shadow transition-all sm:my-8"
						>
							<div class="flex min-h-12 items-center">
								<DialogTitle
									v-if="title"
									class="m-0 min-w-[1px] overflow-x-hidden overflow-ellipsis whitespace-nowrap px-4 py-2 text-xl-bold"
								>
									{{ title }}
								</DialogTitle>
								<button
									class="me-2 ms-auto cursor-pointer border-0 bg-transparent text-center"
									@click="onClose"
								>
									<Icon
										class="h-6 w-6 text-negative"
										icon="Cancel"
										:aria-hidden="true"
									/>
									<span class="-screenReader">
										{{ t('common.close') }}
									</span>
								</button>
							</div>
							<div class="modal-content p-4">
								<div v-html="message" />
								<component
									:is="bodyComponent"
									v-if="bodyComponent"
									v-bind="bodyProps"
								/>
							</div>
							<div class="flex items-center justify-end p-4">
								<Spinner v-if="isLoading" />
								<PkpButton
									v-for="action in actions"
									:key="action.label"
									class="ms-2"
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
								</PkpButton>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</HLDialog>
	</TransitionRoot>
</template>

<script setup>
import {ref} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

import {
	Dialog as HLDialog,
	DialogTitle,
	DialogPanel,
	TransitionRoot,
	TransitionChild,
} from '@headlessui/vue';

import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/** Used only internally, don't pass this prop via openDialog */
	opened: {type: Boolean, default: false},
	/** Title of the dialog */
	title: {type: String, required: true},
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
});

const emit = defineEmits(['close']);

const isLoading = ref(false);

function onClose() {
	if (props.close) {
		props.close();
	}
	emit('close');
}

function fireCallback(callback) {
	isLoading.value = true;
	if (typeof callback === 'function') {
		callback(() => {
			onClose();
		});
	}
}
</script>
