<template>
	<pkp-button
		class="BaseCommentsNewSubmit"
		@click="commentsStore.addComment(publicationId)"
	>
		Submit
	</pkp-button>
</template>

<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>
