<template>
	<DropdownMenuRoot class="pkpDropdownMenu">
		<DropdownMenuTrigger as-child>
			<button class="pkpDropdownMenu__trigger" :aria-label="computedAriaLabel">
				<PkpIcon
					v-if="effectiveIcon"
					class="pkpDropdownMenu__trigger-icon"
					:icon="effectiveIcon"
				/>
				<span v-if="triggerLabel" class="pkpDropdownMenu__trigger-label">
					{{ triggerLabel }}
				</span>
			</button>
		</DropdownMenuTrigger>
		<DropdownMenuPortal>
			<DropdownMenuContent class="pkpDropdownMenu__items">
				<DropdownMenuItem
					v-for="item in items"
					:key="item.name"
					:disabled="item.disabled"
					class="pkpDropdownMenu__item"
					@click="handleClick(item)"
				>
					<span class="pkpDropdownMenu__item-label">{{ item.label }}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenuPortal>
	</DropdownMenuRoot>
</template>

<script setup>
import {computed, onMounted} from 'vue';
import {
	DropdownMenuRoot,
	DropdownMenuTrigger,
	DropdownMenuPortal,
	DropdownMenuContent,
	DropdownMenuItem,
} from 'reka-ui';

const props = defineProps({
	items: {
		type: Array,
		default: () => [],
	},
	triggerIcon: {
		type: String,
		default: null,
	},
	triggerLabel: {
		type: String,
		default: null,
	},
	triggerAriaLabel: {
		type: String,
		default: null,
	},
});

// Default to "MoreOptions" icon when no icon or label is provided
const effectiveIcon = computed(() => {
	if (props.triggerIcon) {
		return props.triggerIcon;
	}
	// Show default icon only when no label is provided
	if (!props.triggerLabel) {
		return 'MoreOptions';
	}
	return null;
});

// Compute aria-label: use explicit prop, fall back to label, or null
const computedAriaLabel = computed(() => {
	if (props.triggerAriaLabel) {
		return props.triggerAriaLabel;
	}
	if (props.triggerLabel) {
		return props.triggerLabel;
	}
	return null;
});

// Dev-mode warning for icon-only triggers without aria-label
onMounted(() => {
	if (import.meta.env.DEV) {
		const isIconOnly = effectiveIcon.value && !props.triggerLabel;
		if (isIconOnly && !props.triggerAriaLabel) {
			console.warn(
				'[PkpDropdownMenu] Icon-only trigger should have a triggerAriaLabel for accessibility.',
			);
		}
	}
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
/**
 * PkpDropdownMenu - Structural Styles
 *
 * These styles handle the core layout, sizing, and positioning
 * of the dropdown menu component. Visual styling (colors, shadows,
 * padding, etc.) should be handled by the theme (dropdownMenu.less).
 *
 * This style block is intentionally NOT scoped so themes can override
 * when necessary.
 */

.pkpDropdownMenu__trigger {
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.pkpDropdownMenu__trigger-icon {
	height: 1.5rem;
	width: 1.5rem;
}

.pkpDropdownMenu__items {
	min-width: 160px;
	z-index: 50;
}

.pkpDropdownMenu__item {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.pkpDropdownMenu__item[data-disabled] {
	cursor: not-allowed;
}
</style>
