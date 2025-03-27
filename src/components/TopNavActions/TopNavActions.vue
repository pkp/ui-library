<template>
	<div
		class="pointer-events-auto flex h-12 items-center justify-end bg-selection-dark px-4"
	>
		<div class="ms-auto flex h-full whitespace-nowrap">
			<div>
				<a
					href="#"
					target="_blank"
					class="relative flex h-full items-center p-2 leading-8 !text-on-dark outline-none hover:-translate-y-1 hover:text-on-dark hover:shadow-[0_0.25rem_#fff] focus:-translate-y-1 focus:text-on-dark focus:shadow-[0_0.25rem_#fff]"
				>
					<Icon icon="HelpTopNav" class="h-7 w-7"></Icon>
					<span class="-screenReader">{translate key="common.help"}</span>
				</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import Icon from '@/components/Icon/Icon.vue';
</script>
