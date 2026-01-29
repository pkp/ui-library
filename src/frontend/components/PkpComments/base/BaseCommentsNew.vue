<template>
	<div
		v-if="
			commentsStore.isLatestPublication(publication.id) &&
			!!commentsStore.getCurrentUser()
		"
		:class="cn('new')"
	>
		<slot></slot>
	</div>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	publication: {type: Object, required: true},
});

const {cn} = usePkpStyles();

const commentsStore = usePkpCommentsStore();
</script>
