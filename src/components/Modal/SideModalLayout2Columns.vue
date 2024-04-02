<template>
	<div class="border-ligh flex w-full border-t border-light">
		<div class="w-3/5 border-e border-light p-4">
			<div class="bg-secondary p-5">
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
