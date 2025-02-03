<template>
	<div class="min-w-max p-4">
		<div class="flex w-full bg-secondary">
			<div class="flex flex-col border-t border-light">
				<slot name="menu"></slot>
				<div class="flex-grow border-x border-b border-light bg-tertiary"></div>
			</div>
			<div class="flex w-full flex-col border-y border-e border-s border-light">
				<div
					class="border-b border-light p-5 text-3xl-bold uppercase text-heading"
				>
					<slot name="heading"></slot>
				</div>
				<div class="flex-grow">
					<div class="flex h-full">
						<div class="flex-grow border-e border-light">
							<div
								v-if="
									$slots['publication-controls-left'] ||
									$slots['publication-controls-right']
								"
								class="flex justify-between border-b border-light p-4"
							>
								<div class="">
									<slot name="publication-controls-left"></slot>
								</div>
								<div>
									<slot name="publication-controls-right"></slot>
								</div>
							</div>

							<slot name="primary"></slot>
						</div>
						<div
							v-if="$slots.secondary || $slots.actions"
							class="w-96 border-s border-light"
						>
							<div class="border-b border-light"><slot name="actions" /></div>
							<div><slot name="secondary"></slot></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
