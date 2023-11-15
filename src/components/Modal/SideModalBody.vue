<template>
	<DialogPanel
		class="pointer-events-auto h-screen w-screen"
		:class="secondary ? 'max-w-3xl' : 'max-w-4xl'"
	>
		<div class="shadow-xl flex h-full flex-col bg-medium py-6">
			<div class="">
				<div class="flex items-start">
					<div class="ml-4">
						<button
							type="button"
							class="bg-ligh rounded-md text-gray-400 hover:text-gray-500 focus:ring-indigo-500 relative focus:outline-none focus:ring-2 focus:ring-offset-2"
							@click="closeModal"
						>
							<span class="sr-only">Close panel</span>
							<icon
								class="w-4 rtl:hidden"
								icon="pkp-chevron-left"
								:aria-hidden="true"
							/>
							<icon
								class="w-4 ltr:hidden"
								icon="pkp-chevron-right"
								:aria-hidden="true"
							/>
						</button>
					</div>
					<div class="ml-8 mr-8 flex-grow">
						<slot name="header" :closeModal="closeModal" />
						<!--<DialogTitle
							class="text-gray-900 font-semibold leading-6 text-base"
						>
							Panel title
						</DialogTitle>-->
					</div>
				</div>
			</div>
			<div class="relative mt-6 flex-1 overflow-y-scroll">
				<slot :closeModal="closeModal" />
			</div>
		</div>
	</DialogPanel>
</template>

<script>
import {DialogPanel /*DialogTitle*/} from '@headlessui/vue';

export default {
	components: {DialogPanel /*DialogTitle*/},
	props: {
		secondary: Boolean,
	},
	inject: ['closeModal'],
};
</script>
