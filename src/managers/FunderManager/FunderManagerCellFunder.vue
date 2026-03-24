<template>
	<TableCell :is-row-header="false">
		<div>
			<div>
				<div class="text-lg-normal">
					{{ localize(funder.name) }}
					<Icon v-if="funder.ror" icon="ROR" class="w-6" :inline="true" />
				</div>
			</div>
		</div>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import { localize } from '@/utils/i18n';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	funder: {type: Object, required: true},
});

const funder = computed(() => props.funder);

</script>
