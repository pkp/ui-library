<template>
	<div
		v-if="progressStore.isFullScreenSpinner"
		class="fixed inset-0 z-50 flex items-center justify-center bg-default bg-opacity-75"
	>
		<Spinner size-variant="big" />
	</div>
</template>

<script setup>
import Spinner from '@/components/Spinner/Spinner.vue';
import {useProgressStore} from '@/stores/progressStore';

const progressStore = useProgressStore();
</script>
