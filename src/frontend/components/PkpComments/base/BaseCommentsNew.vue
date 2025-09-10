<template>
	<div
		v-if="
			commentsStore.isLatestPublication(publicationId) &&
			!!commentsStore.getCurrentUser()
		"
		class="BaseCommentsNew"
	>
		<slot></slot>
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>
