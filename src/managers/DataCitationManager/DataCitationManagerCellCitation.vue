<template>
	<TableCell :is-row-header="false">
		<div>
			<div class="text-lg-normal">
				<span v-if="dataCitation.identifier">
					{{ dataCitation.identifier }}
				</span>
			</div>
			<div>
				<div class="pt-2 text-secondary">{{ dataCitation.title }}</div>
			</div>
		</div>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({
	dataCitation: {type: Object, required: true},
});

const dataCitation = computed(() => props.dataCitation);
</script>
