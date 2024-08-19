<template>
	<div class="p-4">
		<div class="flex w-full bg-secondary">
			<div class="flex flex-col">
				<slot name="menu"></slot>
				<div class="flex-grow border-x border-b border-light"></div>
			</div>
			<div class="flex w-full flex-col border-y border-e border-light">
				<div
					class="border-b border-light p-5 text-3xl-bold uppercase text-heading"
				>
					<slot name="heading"></slot>
				</div>
				<div class="flex-grow">
					<div class="flex h-full">
						<div class="flex-grow"><slot name="primary"></slot></div>
						<div class="w-96 border-s border-light">
							<div class="border-b border-light"><slot name="actions" /></div>
							<div><slot name="secondary"></slot></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
