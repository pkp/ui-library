<template>
	<slot />
</template>

<script setup>
import {provide, inject, useId, onMounted} from 'vue';
const groupId = useId();

const tableContext = inject('tableContext');

onMounted(() => {
	tableContext?.markHasGroups();
});

provide('groupId', groupId);
</script>
