<template>
	<TableCell
		:id="'submission-title-' + item.id"
		class="max-w-[25em] truncate"
		:is-row-header="true"
	>
		<span class="text-lg-semibold">{{ title }}</span>
	</TableCell>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

import TableCell from '@/components/TableNext/TableCell.vue';
const {localizeSubmission} = useLocalize();

const props = defineProps({item: {type: Object, required: true}});

// TODO add submission locale once available in the response
const title = computed(() => localizeSubmission(props.item.publicationTitle));
</script>
