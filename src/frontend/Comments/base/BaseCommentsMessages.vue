<template>
	<div>
		<template v-for="comment in commentsVersionStore.comments">
			<slot :message="comment"></slot>
		</template>
	</div>
</template>
<script setup>
import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
