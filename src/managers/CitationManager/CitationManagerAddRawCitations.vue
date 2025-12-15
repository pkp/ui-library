<template>
	<PkpForm v-bind="citationStore.formAddRawCitations"></PkpForm>
</template>

<script setup>
import PkpForm from '@/components/Form/Form.vue';
import {useCitationManagerStore} from './citationManagerStore.js';

const citationStore = useCitationManagerStore();
</script>
