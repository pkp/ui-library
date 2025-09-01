<template>
	<pkp-dropdown-menu
		v-if="!!currentUser"
		:items="versionApi.getCommentActions(messageProps.message)"
		@select="(actionName) => versionApi[actionName](messageProps.message)"
	/>
</template>
<script setup>
import {inject} from 'vue';

import {usePkpCommentsStore} from './usePkpCommentsStore';
const currentUser = pkp.currentUser;

const versionProps = inject('versionProps');
const messageProps = inject('messageProps');

const commentsStore = usePkpCommentsStore();

const versionApi = commentsStore.getApiPerVersion(versionProps.publicationId);
</script>
