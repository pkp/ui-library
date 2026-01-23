<template>
	<div
		v-if="
			commentsStore.isLatestPublication(publication.id) &&
			!!commentsStore.getCurrentUser()
		"
		class="pkpComments__new"
	>
		<slot></slot>
	</div>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';

defineProps({
	publication: {type: Object, required: true},
});

const commentsStore = usePkpCommentsStore();
</script>
