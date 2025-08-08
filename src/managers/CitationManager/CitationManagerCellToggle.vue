<template>
	<TableCell :is-row-header="false">
		<span class="text-base-normal">
			<Icon
				v-if="props.useStructuredCitations"
				@click="toggleMoreInfoMode"
				:icon="!props.citation.isExpanded ? 'Dropdown' : 'Dropup'"
				:class="'ms-2 inline-block h-auto w-6 cursor-pointer py-2 align-middle'"
				:inline="true"
			/>
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	citation: {type: Object, required: true},
	useStructuredCitations: {type: Boolean, required: true},
	isRowExpanded: {type: Boolean, required: true},
});

function toggleMoreInfoMode() {
	if (!props.citation['isExpanded']) {
		props.citation['isExpanded'] = false;
	}
	props.citation['isExpanded'] = !props.citation['isExpanded'];
}
</script>
