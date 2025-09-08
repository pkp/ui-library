<template>
	<pkp-button @click="commentsVersionStore.commentAdd">Submit</pkp-button>
</template>

<script setup>
import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
