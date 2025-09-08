<template>
	<PkpButton @click="commentsVersionStore.commentAdd">Submit</PkpButton>
</template>

<script setup>
import PkpButton from '../components/PkpButton/PkpButton.vue';
import {usePkpCommentsVersionStore} from './usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
../usePkpCommentsVersionStore
