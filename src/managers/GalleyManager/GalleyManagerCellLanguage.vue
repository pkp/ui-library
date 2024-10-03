<template>
	<TableCell>
		<span class="text-base-normal">
			{{ language }}
		</span>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';

import {useGalleyManagerStore} from './galleyManagerStore';

const props = defineProps({
	galley: {type: Object, required: true},
});

const galleyManagerStore = useGalleyManagerStore();

const language = computed(() => {
	return galleyManagerStore.submission.metadataLocales[props.galley.locale];
});
</script>
