<template>
	<div class="border-ligh flex h-full w-full border-r border-t border-light">
		<div class="w-3/5 border-r border-light p-4">
			<div class="bg-lightest p-5">
				<slot name="left"></slot>
			</div>
		</div>
		<div class="w-2/5">
			<div class="border-b border-light p-4">
				<slot name="right1"></slot>
			</div>
			<div class="p-4">
				<slot name="right2"></slot>
			</div>
		</div>
	</div>
</template>
