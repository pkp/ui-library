<template>
	<div class="flex w-full gap-6">
		<!-- Assigned Menu Items (Left) -->
		<div class="flex w-1/2 flex-col">
			<h3 class="text-lg mb-3 font-bold text-default">
				{{ t('manager.navigationMenus.assignedMenuItems') }}
			</h3>
			<div
				ref="assignedListEl"
				class="rounded-lg min-h-[400px] border border-light bg-secondary p-4"
				:class="{'bg-primary/5': isAssignedOver}"
			>
				<ul class="flex min-h-[300px] flex-col gap-2">
					<div
						v-if="!localAssignedItems.length"
						class="py-10 text-center text-default/50"
					>
						{{ t('common.noItems') }}
					</div>
					<template v-for="item in localAssignedItems" :key="item.id">
						<NavigationMenuItem :item="item" :level="0" :is-assigned="true" />
					</template>
				</ul>
			</div>
		</div>

		<!-- Unassigned Menu Items (Right) -->
		<div class="flex w-1/2 flex-col">
			<h3 class="text-lg mb-3 font-bold text-default">
				{{ t('manager.navigationMenus.unassignedMenuItems') }}
			</h3>
			<div
				ref="unassignedListEl"
				class="rounded-lg min-h-[400px] border border-light bg-secondary p-4"
				:class="{'bg-primary/5': isUnassignedOver}"
			>
				<ul class="flex min-h-[300px] flex-col gap-2">
					<div
						v-if="!localUnassignedItems.length"
						class="py-10 text-center text-default/50"
					>
						{{ t('common.noItems') }}
					</div>
					<template v-for="item in localUnassignedItems" :key="item.id">
						<NavigationMenuItem :item="item" :level="0" :is-assigned="false" />
					</template>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import NavigationMenuItem from './NavigationMenuItem.vue';
import {useNavigationMenuBuilder} from '@/composables/useNavigationMenuBuilder';
import {t} from '@/utils/i18n';

const props = defineProps({
	assignedItems: {
		type: Array,
		default: () => [],
	},
	unassignedItems: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits([
	'update:assignedItems',
	'update:unassignedItems',
	'update:formData',
]);

const {
	localAssignedItems,
	localUnassignedItems,
	assignedListEl,
	unassignedListEl,
	isAssignedOver,
	isUnassignedOver,
} = useNavigationMenuBuilder(props, emit);
</script>
