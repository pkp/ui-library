<template>
	<div
		v-if="
			commentsVersionStore.isLatestPublication &&
			!!commentsVersionStore.currentUser
		"
		class="BaseCommentsNew"
	>
		<slot></slot>
	</div>
</template>
<script setup>
import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
../usePkpCommentsVersionStore
