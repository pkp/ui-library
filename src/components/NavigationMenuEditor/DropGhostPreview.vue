<template>
	<div class="pointer-events-none w-full">
		<div
			class="transition-opacity duration-150"
			:class="visible && items.length ? 'opacity-100' : 'opacity-0'"
		>
			<div
				v-for="item in items"
				:key="item.id"
				class="mb-2 flex items-center border border-dashed border-primary/50 bg-primary/5 opacity-60"
				:style="{marginInlineStart: `${(item.depth - 1) * indentPerLevel}px`}"
			>
				<div class="flex h-full items-center px-2 py-1 text-primary/40">
					<Icon icon="Sort" class="h-4 w-4" />
				</div>
				<span class="text-sm flex-grow truncate py-1 pe-2 text-primary/60">
					{{ item.title }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import Icon from '@/components/Icon/Icon.vue';

defineProps({
	items: {
		type: Array,
		default: () => [],
	},
	indentPerLevel: {
		type: Number,
		default: 24,
	},
	visible: {
		type: Boolean,
		default: false,
	},
});
</script>
