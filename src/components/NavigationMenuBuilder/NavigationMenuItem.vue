<template>
	<li
		ref="dragEl"
		class="relative list-none"
		:class="{'opacity-40': isDragging}"
	>
		<div
			ref="dropEl"
			class="bg-white shadow-sm flex items-center justify-between rounded border border-light p-3 transition-colors hover:border-primary/50"
			:class="{'border-primary': isDragOver}"
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
					aria-label="Toggle Visibility"
				>
					<Icon icon="View" class="h-4 w-4" />
				</button>
			</div>
		</div>

		<!-- Nested Children -->
		<ul
			v-if="item.children && item.children.length"
			ref="listEl"
			class="mt-2 flex flex-col gap-1 pb-2 pl-8"
			:class="{'rounded bg-primary/5': isListOver}"
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

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	level: {
		type: Number,
		default: 1,
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
const {isDragging, isDragOver, isListOver} = useNavigationMenuItem(
	dragEl,
	dropEl,
	listEl,
	props,
);
</script>
