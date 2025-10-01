<template>
	<div>
		<PkpForm v-bind="citationStore.formEnableLookup"></PkpForm>
	</div>
</template>

<script setup>
import PkpForm from '@/components/Form/Form.vue';
import {useCitationManagerStore} from './citationManagerStore.js';

defineProps({
	checked: {type: Boolean, required: true},
});

const citationStore = useCitationManagerStore();
</script>
