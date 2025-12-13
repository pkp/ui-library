<template>
	<li
		ref="dragEl"
		class="relative list-none"
		:class="{'opacity-40': isDragging}"
	>
		<!-- Drop Indicator: Above -->
		<div
			v-if="instruction && instruction.type === 'reorder-above'"
			class="absolute -top-1 right-0 z-10 h-0.5 bg-primary"
			:style="{left: `${instruction.currentLevel * 32}px`}"
		></div>

		<div
			ref="dropEl"
			class="bg-white shadow-sm flex items-center justify-between rounded border border-light p-3 transition-colors hover:border-primary/50"
			:class="{
				'border-primary': instruction && instruction.type === 'make-child',
				'bg-primary/5': instruction && instruction.type === 'make-child',
			}"
		>
			<div class="flex items-center gap-3">
				<Icon
					icon="Sort"
					class="h-4 w-4 cursor-move text-default/40 hover:text-default"
				/>
				<span class="text-sm font-medium text-default">{{ item.title }}</span>
				<span
					v-if="item.taskCount"
					class="text-xs rounded bg-primary/10 px-1.5 py-0.5 font-bold text-primary"
				>
					{{ item.taskCount }}
				</span>
			</div>
			<div class="flex items-center gap-2">
				<Icon
					v-if="item.isWarning"
					icon="Attention"
					class="h-4 w-4 text-negative"
				/>
				<button
					class="text-default/50 hover:text-primary"
					:aria-label="t('common.view')"
				>
					<Icon icon="View" class="h-4 w-4" />
				</button>
			</div>
		</div>

		<!-- Drop Indicator: Below -->
		<div
			v-if="instruction && instruction.type === 'reorder-below'"
			class="absolute -bottom-1 right-0 z-10 h-0.5 bg-primary"
			:style="{left: `${instruction.currentLevel * 32}px`}"
		></div>

		<!-- Nested Children -->
		<ul
			v-if="item.children && item.children.length"
			ref="listEl"
			class="mt-2 flex flex-col gap-1 pb-2 pl-8"
		>
			<template v-for="child in item.children" :key="child.id">
				<NavigationMenuItem
					:item="child"
					:level="level + 1"
					:is-assigned="isAssigned"
				/>
			</template>
		</ul>
	</li>
</template>

<script setup>
import {ref} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import {useNavigationMenuItem} from '@/composables/useNavigationMenuItem';
import {t} from '@/utils/i18n';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	level: {
		type: Number,
		default: 0,
	},
	isAssigned: {
		type: Boolean,
		default: false,
	},
});

defineOptions({
	name: 'NavigationMenuItem',
});

const dragEl = ref(null);
const dropEl = ref(null);
const listEl = ref(null);
const {isDragging, instruction} = useNavigationMenuItem(
	dragEl,
	dropEl,
	listEl,
	props,
);
</script>
