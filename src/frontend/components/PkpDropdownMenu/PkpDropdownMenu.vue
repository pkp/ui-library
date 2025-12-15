<template>
	<BaseDropdownMenu v-bind="$attrs">
		<BaseDropdownMenuTrigger>
			<BaseDropdownMenuTriggerIcon />
		</BaseDropdownMenuTrigger>
		<BaseDropdownMenuItems v-slot="slotProps">
			<BaseDropdownMenuItem v-bind="slotProps">
				<BaseDropdownMenuItemLabel />
			</BaseDropdownMenuItem>
		</BaseDropdownMenuItems>
	</BaseDropdownMenu>
</template>
