<template>
	<div>
		{{ store.citations.length }}
	</div>
</template>

<script setup>
import {usePkpCitedByStore} from './usePkpCitedByStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	submissionId: {type: Number, required: true},
	styles: {type: Object, default: () => ({})},
});

const store = usePkpCitedByStore();
const {nestedStyles} = usePkpStyles('PkpCitedByCount', props.styles);

store.initialize(props, nestedStyles);
</script>
