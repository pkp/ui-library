<template>
	<div class="p-4">
		<div class="flex w-full bg-secondary">
			<div class=""><slot name="menu"></slot></div>
			<div class="w-full border-y border-e border-light">
				<div class="border-b border-light p-4">
					<slot name="heading"></slot>
				</div>
				<div class="flex">
					<div class="flex-grow"><slot name="primary"></slot></div>
					<div class="w-96 border-s border-light">
						<div class="border-b border-light"><slot name="actions" /></div>
						<div><slot name="secondary"></slot></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
