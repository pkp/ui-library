<template>
	<pkp-dropdown-menu
		v-if="!!commentsStore.getCurrentUser()"
		class="BaseCommentsMessageActions"
		:items="
			commentsStore.getCommentActions(publicationId, messageProps.message)
		"
		@select="
			(actionName) =>
				commentsStore[actionName](publicationId, messageProps.message)
		"
	/>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const messageProps = inject('messageProps');
const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>
