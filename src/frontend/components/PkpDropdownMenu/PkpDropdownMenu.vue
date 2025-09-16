<template>
	<BaseDropdownMenu v-bind="$attrs">
		<BaseDropdownMenuTrigger class="pkpDropdownActions__trigger">
			<BaseDropdownMenuTriggerIcon class="pkpDropdownActions__triggerIcon" />
		</BaseDropdownMenuTrigger>
		<BaseDropdownMenuItems
			v-slot="slotProps"
			class="pkpDropdownActions__content"
		>
			<BaseDropdownMenuItem v-bind="slotProps" class="pkpDropdownActions__item">
				<BaseDropdownMenuItemLabel />
			</BaseDropdownMenuItem>
		</BaseDropdownMenuItems>
	</BaseDropdownMenu>
</template>

<script setup>
import BaseDropdownMenu from './BaseDropdownMenu.vue';
import BaseDropdownMenuTrigger from './BaseDropdownMenuTrigger.vue';
import BaseDropdownMenuTriggerIcon from './BaseDropdownMenuTriggerIcon.vue';
import BaseDropdownMenuItems from './BaseDropdownMenuItems.vue';
import BaseDropdownMenuItem from './BaseDropdownMenuItem.vue';
import BaseDropdownMenuItemLabel from './BaseDropdownMenuItemLabel.vue';
</script>

<style>
.pkpDropdownActions__trigger {
	background-color: var(--pkp-background-color-transparent);
	border: var(--pkp-border-color-transparent);
	cursor: pointer;
	color: var(--pkp-text-color-secondary);
	padding: var(--pkp-spacing-2);
	border-radius: var(--pkp-radius);
	display: flex;
	align-items: center;
	justify-content: center;
}

.pkpDropdownActions__triggerIcon {
	height: calc(
		1.5 * var(--pkp-text-base-size)
	); /* Adjust for typical close X size, e.g., 24px */
	width: calc(1.5 * var(--pkp-text-base-size));
}

.pkpDropdownActions__trigger:hover {
	background-color: var(--pkp-background-color-tertiary);
}

.pkpDropdownActions__content {
	background-color: var(--pkp-background-color-secondary);
	border-radius: var(--pkp-radius);
	box-shadow: var(--pkp-shadow);
	padding: var(--pkp-spacing-1);
	min-width: 160px;
	z-index: 50;
}

.pkpDropdownActions__item {
	display: flex;
	align-items: center;
	padding: var(--pkp-spacing-2) var(--pkp-spacing-4);
	cursor: pointer;
	font: var(--pkp-font-base-normal);
	color: var(--pkp-text-color-default);
	border-radius: var(--pkp-radius);
}

.pkpDropdownActions__item:hover:not([data-disabled]) {
	background-color: var(--pkp-background-color-selection-light);
}

.pkpDropdownActions__item[data-disabled] {
	color: var(--pkp-text-color-disabled);
	cursor: not-allowed;
}
</style>
