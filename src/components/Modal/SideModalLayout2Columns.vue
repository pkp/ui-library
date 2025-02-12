<template>
	<div class="border-light flex w-full border-t">
		<div class="border-light grow border-e p-4">
			<div class="bg-secondary p-5">
				<slot name="left"></slot>
			</div>
		</div>
		<div class="w-96">
			<div class="border-light border-b p-4">
				<slot name="right1"></slot>
			</div>
			<div class="p-4">
				<slot name="right2"></slot>
			</div>
		</div>
	</div>
</template>
