<template>
	<pkp-dropdown-menu
		v-if="!!commentsVersionStore.currentUser"
		:items="commentsVersionStore.getCommentActions(messageProps.message)"
		@select="
			(actionName) => commentsVersionStore[actionName](messageProps.message)
		"
	/>
</template>
<script setup>
import {inject} from 'vue';

const messageProps = inject('messageProps');

import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
../usePkpCommentsVersionStore
