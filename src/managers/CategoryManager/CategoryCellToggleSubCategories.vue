<template>
	<TableCell>
		<div
			class="flex justify-center"
			:style="{'padding-inline-end': `${depth + 0.5}rem`}"
		>
			<button data-cy="category-manager-toggle-sub-categories">
				<Icon
					v-if="category.subCategories?.length"
					class="h-6 w-6 cursor-pointer text-primary"
					:icon="isExpanded ? 'Dropup' : 'Dropdown'"
					:aria-hidden="true"
					@click="categoryManagerStore.toggleItemExpansion(category.id)"
				/>
				<span class="sr-only">
					{{ getToggleText }}
				</span>
			</button>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useCategoryManagerStore} from '@/managers/CategoryManager/categoryManagerStore.js';
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	category: {type: Object, required: true},
	depth: {type: Number, default: 0},
});

const categoryManagerStore = useCategoryManagerStore();

const isExpanded = computed(() =>
	categoryManagerStore.expanded.includes(props.category.id),
);

const getToggleText = computed(() =>
	isExpanded.value
		? t('manager.category.collapseSubcategories')
		: t('manager.category.expandSubcategories'),
);
</script>
