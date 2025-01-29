<template>
	<div class="min-w-max p-4">
		<div class="bg-secondary flex w-full">
			<div class="border-light flex flex-col border-t">
				<slot name="menu"></slot>
				<div class="border-light bg-tertiary grow border-x border-b"></div>
			</div>
			<div class="border-light flex w-full flex-col border-y border-s border-e">
				<div
					class="border-light text-3xl-bold text-heading border-b p-5 uppercase"
				>
					<slot name="heading"></slot>
				</div>
				<div class="grow">
					<div class="flex h-full">
						<div class="border-light grow border-e">
							<div
								v-if="
									$slots['publication-controls-left'] ||
									$slots['publication-controls-right']
								"
								class="border-light flex justify-between border-b p-4"
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
							class="border-light w-96 border-s"
						>
							<div class="border-light border-b"><slot name="actions" /></div>
							<div><slot name="secondary"></slot></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
