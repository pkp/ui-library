<template>
	<PkpForm v-bind="citationStore.formAddRawCitations"></PkpForm>
</template>

<script setup>
import {useCitationManagerStore} from './citationManagerStore.js';

const citationStore = useCitationManagerStore();
</script>
