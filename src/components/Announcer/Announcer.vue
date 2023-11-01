<template>
	<div
		id="announcer"
		class="announcer"
		:aria-live="announcerStore.politeness"
		v-text="announcerStore.content"
	/>
</template>

<script>
import {mapStores} from 'pinia';
import {useAnnouncerStore} from '@/stores/announcerStore';
export default {
	computed: {
		...mapStores(useAnnouncerStore),
	},
};
</script>
