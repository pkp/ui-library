<template>
	<pkp-button
		class="BaseCommentsNewSubmit"
		@click="commentsVersionStore.commentAdd"
	>
		Submit
	</pkp-button>
</template>

<script setup>
import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
