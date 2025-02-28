<template>
	<Popover class="relative inline-block">
		<PopoverButton
			class="text-sm text-gray-900 inline-flex items-center gap-x-1 font-semibold leading-6"
		>
			<slot name="button"></slot>
		</PopoverButton>

		<transition
			enter-active-class="transition ease-out duration-150"
			enter-from-class="opacity-0 translate-y-1"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition ease-in duration-100"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-1"
		>
			<PopoverPanel
				class="absolute left-1/2 z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 px-4"
			>
				<div
					class="tooltip-arrow absolute left-1/2 z-20 h-4 w-4 origin-top-right -translate-x-1/2 rotate-45 bg-secondary shadow"
				></div>

				<div
					:class="sizeClasses"
					class="text-sm flex-auto rounded bg-secondary shadow"
				>
					<div class="p-4"><slot></slot></div>
				</div>
			</PopoverPanel>
		</transition>
	</Popover>
</template>

<script setup>
import {computed} from 'vue';
import {PopoverButton, Popover, PopoverPanel} from '@headlessui/vue';

const props = defineProps({
	sizeVariant: {
		required: false,
		type: String,
		default: () => 'default',
		validator: (prop) => ['default', 'content'].includes(prop),
	},
});

const sizeClasses = computed(() => {
	if (props.sizeVariant === 'content') {
		return 'max-w-sm';
	}

	return 'w-screen max-w-sm';
});
</script>
<style>
.tooltip-arrow {
	clip-path: polygon(
		-20% -20%,
		120% -20%,
		100% 0%,
		95% 10%,
		10% 95%,
		0% 100%,
		-20% 120%
	);
}
</style>
