<template>
	<pkp-dropdown-menu
		v-if="!!commentsStore.getCurrentUser()"
		class="pkpComments__message-actions"
		:items="commentsStore.getCommentActions(publication.id, message)"
		@select="(actionName) => commentsStore[actionName](publication.id, message)"
	/>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';

defineProps({
	publication: {type: Object, required: true},
	message: {type: Object, required: true},
});

const commentsStore = usePkpCommentsStore();
</script>
