<template>
	<TableCell>
		<div
			class="flex justify-center"
			:style="{'padding-inline-end': `${depth + 0.5}rem`}"
		>
			<button data-cy="category-manager-toggle-sub-categories">
				<Icon
					v-if="isDisplayed"
					class="h-6 w-6 cursor-pointer text-primary"
					:icon="isExpanded ? 'Dropup' : 'Dropdown'"
					:aria-hidden="true"
					@click="emit('toggle', itemId)"
				/>
				<span class="sr-only">
					{{ toggleText }}
				</span>
			</button>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	isDisplayed: {type: Boolean, required: true, default: false},
	isExpanded: {type: Boolean, required: true, default: false},
	expandLabel: {
		type: String,
		required: false,
		// default is handled in computed property to be able to reference `t`
		default: () => null,
	},
	collapseLabel: {
		type: String,
		required: false,
		// default is handled in computed property to be able to reference `t`
		default: () => null,
	},
	depth: {type: Number, default: 0},
});

const emit = defineEmits(['toggle']);

const toggleText = computed(() =>
	props.isExpanded.value
		? props.expandLabel || t('list.expand')
		: props.collapseLabel || t('list.collapse'),
);
</script>
