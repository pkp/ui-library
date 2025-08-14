<template>
	<div class="BaseCommentsMessages">
		<template v-for="comment in commentsStore.getComments(publicationId)">
			<slot :message="comment"></slot>
		</template>
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>
