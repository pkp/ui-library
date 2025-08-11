<template>
	<DialogContent
		class="DialogContent"
		as-child
		@open-auto-focus="handleAutoFocus"
		@focus-outside="handleOutsideEvent"
		@interact-outside="handleOutsideEvent"
		@pointer-down-outside="handleOutsideEvent"
		@escape-key-down="handleOutsideEvent"
	>
		<div
			:id="containerId"
			class="fixed inset-y-0 z-10 flex max-w-full ltr:right-0 rtl:left-0"
		>
			<div class="pointer-events-auto h-screen w-screen" :class="levelClasses">
				<div class="shadow-xl flex h-full flex-col bg-default">
					<div
						class="flex h-12 items-center justify-end bg-selection-dark px-4"
					>
						<TopNavActions />
					</div>

					<div class="mt-4">
						<div class="flex items-start">
							<div class="ms-4">
								<DialogClose
									ref="closeModalButton"
									type="button"
									class="DialogClose rounded-md text-gray-400 hover:text-gray-500 focus:ring-indigo-500 relative inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2"
								>
									<span class="sr-only">{{ t('common.close') }}</span>
									<Icon
										class="h-8 w-8 text-primary"
										icon="BackButton"
										:aria-hidden="true"
									/>
								</DialogClose>
							</div>
							<div class="ml-8 mr-8 flex-grow" data-cy="sidemodal-header">
								<div class="flex">
									<div class="flex-grow">
										<!-- @slot Small text above title, might be useful for example to display submission Id-->
										<div class="text-xl-medium">
											<slot name="pre-title"></slot>
										</div>
										<DialogTitle
											as="h1"
											class="mt-1 inline-block text-4xl-bold text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
											tabindex="-1"
										>
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
			</div>
		</div>
	</DialogContent>
</template>

<script setup>
import {inject, computed, useId} from 'vue';
import TopNavActions from '@/components/TopNavActions/TopNavActions.vue';
import {
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from 'reka-ui';
import Icon from '@/components/Icon/Icon.vue';
import {focusFirstHeading} from './modalHelpers';

const containerId = useId();

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
const closeModalButton = inject('closeModalButton');

// #11693 When tinyMCE modal is opened inside modal, ignore outside clicks to prevent closing the current modals
function handleOutsideEvent(event) {
	// Check if the target is part of TinyMCE's dialog
	if (event.target.closest('.tox-tinymce-aux')) {
		event.preventDefault(); // Bypass the focus trap for TinyMCE elements
	}
}

/* Initial focus */
function handleAutoFocus(event) {
	const container = document.getElementById(containerId);

	if (container) {
		focusFirstHeading(container, event);
	}
}
</script>
<style scoped>
/* Sliding */
@keyframes sideModalSlideIn {
	from {
		transform: translateX(100%);
	}
	to {
		transform: translateX(0);
	}
}
@keyframes sideModalSlideOut {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(100%);
	}
}

.DialogContent[data-state='open'] {
	animation: sideModalSlideIn 450ms ease-in-out;
}
.DialogContent[data-state='closed'] {
	animation: sideModalSlideOut 450ms ease-in-out;
}

/* 3) RTL support */
@keyframes sideModalSlideInRtl {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translateX(0);
	}
}
@keyframes sideModalSlideOutRtl {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-100%);
	}
}
html[dir='rtl'] .DialogContent[data-state='open'] {
	animation: sideModalSlideInRtl 450ms ease-in-out;
}
html[dir='rtl'] .DialogContent[data-state='closed'] {
	animation: sideModalSlideOutRtl 450ms ease-in-out;
}
</style>
