<template>
	<TableCell
		:id="'submission-title-' + item.id"
		class="max-w-[25em] truncate"
		:is-row-header="true"
	>
		<span class="text-base-bold">
			{{ currentPublication.authorsStringShort }}
		</span>
		<template v-if="currentPublication.authorsStringShort">—</template>
		<span
			v-strip-unsafe-html="
				localizeSubmission(
					currentPublication.fullTitle,
					currentPublication.locale,
				)
			"
			class="text-base-normal"
		></span>
	</TableCell>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import {useSubmission} from '@/composables/useSubmission';
import TableCell from '@/components/Table/TableCell.vue';
import {useLocalize} from '@/composables/useLocalize';
const props = defineProps({item: {type: Object, required: true}});

const {getCurrentPublication} = useSubmission();
const {localizeSubmission} = useLocalize();
const currentPublication = computed(() => getCurrentPublication(props.item));
</script>
