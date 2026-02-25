<template>
	<DropdownMenuRoot :class="cn('root')" :dir="documentDir">
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
			<DropdownMenuContent :class="cn('items')" :align="align">
				<DropdownMenuItem
					v-for="item in items"
					:key="item.name"
					:disabled="item.disabled"
					:class="cn('item')"
					as="a"
					:href="item.href || undefined"
					:target="item.href ? item.target : undefined"
					:rel="
						item.href && item.target === '_blank'
							? 'noopener noreferrer'
							: undefined
					"
					@click="handleClick($event, item)"
				>
					<PkpIcon v-if="item.icon" :class="cn('itemIcon')" :icon="item.icon" />
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
import {usePkpDirection} from '@/frontend/composables/usePkpDirection';

const documentDir = usePkpDirection();

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
	align: {
		type: String,
		default: 'start',
		validator: (value) => ['start', 'center', 'end'].includes(value),
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

const handleClick = (event, item) => {
	if (item.disabled) return;
	// For links without actionFn, let browser handle navigation naturally
	if (item.href && !item.actionFn) {
		// Browser handles the navigation - just emit for tracking if needed
		emit('select', item.name || item.label);
		return;
	}
	// Prevent default for action items (no href) or when actionFn overrides link
	event.preventDefault();
	if (item.actionFn) {
		item.actionFn();
	} else {
		emit('select', item.name || item.label);
	}
};
</script>
