<template>
	<DialogPanel class="pointer-events-auto w-screen max-w-md">
		<div
			class="shadow-xl flex h-full flex-col overflow-y-auto bg-lightest py-6"
		>
			<div class="">
				<div class="flex items-start">
					<div class="m-2 flex h-7 items-center">
						<button
							type="button"
							class="bg-ligh rounded-md text-gray-400 hover:text-gray-500 focus:ring-indigo-500 relative focus:outline-none focus:ring-2 focus:ring-offset-2"
							@click="closeModal"
						>
							<span class="sr-only">Close panel</span>
							<icon
								class="text-2xl rtl:hidden"
								icon="chevron-left"
								:aria-hidden="true"
							/>
							<icon
								class="text-2xl ltr:hidden"
								icon="chevron-right"
								:aria-hidden="true"
							/>
						</button>
					</div>
					<div>
						<slot name="header" />
						<!--<DialogTitle
							class="text-gray-900 font-semibold leading-6 text-base"
						>
							Panel title
						</DialogTitle>-->
					</div>
				</div>
			</div>
			<div class="relative mt-6 flex-1 px-4 sm:px-6">
				<slot :closeModal="closeModal" />
			</div>
		</div>
	</DialogPanel>
</template>

<script>
import {DialogPanel /*DialogTitle*/} from '@headlessui/vue';

export default {
	components: {DialogPanel /*DialogTitle*/},
	inject: ['closeModal'],
};
</script>
