<template>
	<TransitionRoot as="template" :show="opened">
		<HLDialog class="modal" @close="onClose('default')">
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
						<DialogPanel data-cy="dialog" :class="styles">
							<button
								v-if="shouldShowCloseButton"
								class="absolute right-3 top-3 cursor-pointer bg-transparent"
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
							<div class="flex min-h-12 items-center">
								<DialogTitle
									v-if="title"
									class="m-0 inline-flex min-w-[1px] items-center overflow-x-hidden overflow-ellipsis px-8 pt-12 text-4xl-bold"
									:class="icon ? 'pb-5' : 'pb-8'"
								>
									<div v-if="icon" :class="iconStyles">
										<Icon :icon="icon" class="h-11 w-11 text-on-dark"></Icon>
									</div>
									<span class="px-4">{{ title }}</span>
								</DialogTitle>
							</div>
							<slot>
								<component
									:is="bodyComponent"
									v-if="bodyComponent"
									v-bind="{...bodyProps, actions, message, onClose}"
									:has-icon="!!icon"
								/>
								<DialogBody
									v-else
									v-bind="{...props, onClose}"
									:has-icon="!!icon"
								></DialogBody>
							</slot>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</HLDialog>
	</TransitionRoot>
</template>

<script setup>
import {computed} from 'vue';
import DialogBody from './DialogBody.vue';

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
	title: {type: String, required: false, default: ''},
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
	/** Defines the visual style of the modal: 'basic' (no border style)', 'primary', 'negative', or 'success'. */
	modalStyle: {
		type: String,
		default: () => 'primary',
		validator: (value) =>
			['primary', 'negative', 'success', 'basic'].includes(value),
	},
	/** Defines if clicking outside the modal should close it */
	isDismissible: {
		type: Boolean,
		default: () => true,
	},
	/** Defines if the close button (x) should be shown */
	/** If not set, the close button will be shown if there are no actions */
	showCloseButton: {
		type: Boolean,
		default: undefined,
	},
});

const shouldShowCloseButton = computed(() => {
	if (props.showCloseButton !== undefined) {
		return props.showCloseButton;
	}

	return !props.actions?.length;
});

const styles = computed(() => ({
	'relative mx-3 w-10/12 max-w-3xl transform overflow-hidden rounded bg-secondary text-start shadow transition-all sm:my-8': true,
	'border-none': props.modalStyle === 'basic',
	'border-s-[14px] border-primary': props.modalStyle === 'primary',
	'border-s-[14px] border-success': props.modalStyle === 'success',
	'border-s-[14px] border-negative': props.modalStyle === 'negative',
}));

const icon = computed(() => {
	switch (props.modalStyle) {
		case 'negative':
			return 'Cancel';
		case 'success':
			return 'Complete';
		default:
			return null;
	}
});

const iconStyles = computed(() => ({
	'flex h-12 w-12 items-center justify-center rounded-full': true,
	'bg-success': props.modalStyle === 'success',
	'bg-negative': props.modalStyle === 'negative',
}));

const emit = defineEmits(['close']);

function onClose(triggerOrigin) {
	// Prevent closing the modal on outside clicks or "Esc" key presses if isDismissible is false
	if (!props.isDismissible && triggerOrigin === 'default') {
		return;
	}

	if (props.close) {
		props.close();
	}

	emit('close');
}
</script>
