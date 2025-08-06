<template>
	<DropdownMenuRoot>
		<DropdownMenuTrigger as-child>
			<button class="pkp-dropdown-actions__trigger">
				<PkpIcon
					class="pkp-dropdown-actions__trigger-icon"
					icon="MoreOptions"
				/>
			</button>
		</DropdownMenuTrigger>
		<DropdownMenuPortal>
			<DropdownMenuContent class="pkp-dropdown-actions__content">
				<DropdownMenuItem
					v-for="item in props.items"
					:key="item.label"
					class="pkp-dropdown-actions__item"
					:disabled="item.disabled"
					@click="handleClick(item)"
				>
					{{ item.label }}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenuPortal>
	</DropdownMenuRoot>
</template>

<script setup>
import {
	DropdownMenuRoot,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
} from 'reka-ui';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
	items: {
		type: Array,
		default: () => [
			{
				label: 'Edit',
				name: 'edit',
				disabled: false,
			},
			{
				label: 'Notify',
				name: 'notify',
				disabled: false,
			},
			{
				label: 'Login As',
				name: 'login_as',
				disabled: false,
			},
			{
				label: 'Remove',
				name: 'remove',
				disabled: false,
			},
		],
	},
});

const emit = defineEmits(['select']);

const handleClick = (item) => {
	if (item.disabled) return;
	if (item.actionFn) {
		item.actionFn();
	} else {
		emit('select', item.name || item.label);
	}
};
</script>

<style>
.pkp-dropdown-actions__trigger {
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

.pkp-dropdown-actions__trigger-icon {
	height: calc(
		1.5 * var(--pkp-text-base-size)
	); /* Adjust for typical close X size, e.g., 24px */
	width: calc(1.5 * var(--pkp-text-base-size));
}

.pkp-dropdown-actions__trigger:hover {
	background-color: var(--pkp-background-color-tertiary);
}

.pkp-dropdown-actions__content {
	background-color: var(--pkp-background-color-secondary);
	border-radius: var(--pkp-radius);
	box-shadow: var(--pkp-shadow);
	padding: var(--pkp-spacing-1);
	min-width: 160px;
	z-index: 50;
}

.pkp-dropdown-actions__item {
	display: flex;
	align-items: center;
	padding: var(--pkp-spacing-2) var(--pkp-spacing-4);
	cursor: pointer;
	font: var(--pkp-font-base-normal);
	color: var(--pkp-text-color-default);
	border-radius: var(--pkp-radius);
}

.pkp-dropdown-actions__item:hover:not([data-disabled]) {
	background-color: var(--pkp-background-color-selection-light);
}

.pkp-dropdown-actions__item[data-disabled] {
	color: var(--pkp-text-color-disabled);
	cursor: not-allowed;
}
</style>
