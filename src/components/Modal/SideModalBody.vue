<template>
	<DialogPanel
		class="pointer-events-auto h-screen w-screen"
		:class="levelClasses"
	>
		<div class="shadow-xl flex h-full flex-col bg-default py-6">
			<div class="">
				<div class="flex items-start">
					<div class="ms-4">
						<button
							type="button"
							class="rounded-md text-gray-400 hover:text-gray-500 focus:ring-indigo-500 relative inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2"
							@click="closeModal"
						>
							<span class="sr-only">{{ t('common.close') }}</span>
							<Icon
								class="h-8 w-8 text-primary"
								icon="BackButton"
								:aria-hidden="true"
							/>
						</button>
					</div>
					<div class="ml-8 mr-8 flex-grow" data-cy="sidemodal-header">
						<div class="flex">
							<div class="flex-grow">
								<!-- @slot Small text above title, might be useful for example to display submission Id-->
								<div class="text-xl-medium"><slot name="pre-title"></slot></div>
								<DialogTitle as="h1" class="mt-1 text-4xl-bold text-heading">
									<!-- @slot Main title, also used for accessibility (aria-labelledby) -->
									<slot name="title"></slot>
								</DialogTitle>
								<DialogDescription class="mt-1 text-3xl-normal">
									<!-- @slot Optionally descrition, also used for accessibility (aria-describedby) -->
									<slot name="description"></slot>
								</DialogDescription>
								<div class="mt-1">
									<!-- @slot For additional information that needs to be in the modal header add it here, check submissionSummaryModal.vue for good example -->
									<slot name="post-description"></slot>
								</div>
							</div>
							<div class="flex flex-none items-center">
								<!-- @slot Optionally actions buttons that are placed on the right side of header -->
								<slot name="actions" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- pkp-modal-scroll-container is important for scrolling within form-->
			<div
				class="pkp-modal-scroll-container relative mt-6 flex-1 overflow-y-scroll"
			>
				<!-- @slot Body content -->
				<slot :close-modal="closeModal" />
			</div>
		</div>
	</DialogPanel>
</template>

<script setup>
import {inject, computed} from 'vue';
import {DialogPanel, DialogTitle, DialogDescription} from '@headlessui/vue';
import Icon from '@/components/Icon/Icon.vue';

import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

/** Handle styling for nested SideModals */
const levelClasses = computed(() => {
	if (modalLevel.value === 4) {
		return 'max-w-[72vw]';
	}

	if (modalLevel.value === 3) {
		return 'max-w-[79vw]';
	}

	if (modalLevel.value === 2) {
		return 'max-w-[86vw]';
	}

	return 'max-w-[93vw]';
});

const closeModal = inject('closeModal');
const modalLevel = inject('modalLevel');
</script>
