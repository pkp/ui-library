<template>
	<div
		id="announcer"
		class="announcer"
		:aria-live="announcerStore.politeness"
		v-text="announcerStore.content"
	/>
</template>

<script setup>
import {useAnnouncerStore} from '@/stores/announcerStore';

const announcerStore = useAnnouncerStore();
</script>
