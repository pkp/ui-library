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

<script setup>
import BaseDropdownMenu from './base/BaseDropdownMenu.vue';
import BaseDropdownMenuTrigger from './base/BaseDropdownMenuTrigger.vue';
import BaseDropdownMenuTriggerIcon from './base/BaseDropdownMenuTriggerIcon.vue';
import BaseDropdownMenuItems from './base/BaseDropdownMenuItems.vue';
import BaseDropdownMenuItem from './base/BaseDropdownMenuItem.vue';
import BaseDropdownMenuItemLabel from './base/BaseDropdownMenuItemLabel.vue';
</script>
