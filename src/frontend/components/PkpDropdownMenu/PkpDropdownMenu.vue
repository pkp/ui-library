<template>
	<DropdownMenuRoot :class="cn('root')">
		<DropdownMenuTrigger as-child>
			<button :class="cn('trigger')" :aria-label="computedAriaLabel">
				<PkpIcon
					v-if="effectiveIcon"
					:class="cn('triggerIcon')"
					:icon="effectiveIcon"
				/>
				<span v-if="triggerLabel" :class="cn('triggerLabel')">
					{{ triggerLabel }}
				</span>
			</button>
		</DropdownMenuTrigger>
		<DropdownMenuPortal>
			<DropdownMenuContent :class="cn('items')">
				<DropdownMenuItem
					v-for="item in items"
					:key="item.name"
					:disabled="item.disabled"
					:class="cn('item')"
					@click="handleClick(item)"
				>
					<span :class="cn('itemLabel')">{{ item.label }}</span>
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
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

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
	styles: {
		type: Object,
		default: () => ({}),
	},
});

const {cn} = usePkpStyles('PkpDropdownMenu', props.styles);

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
