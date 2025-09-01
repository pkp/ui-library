<template>
	<div>
		<template v-for="comment in versionApi.comments">
			<slot :message="comment"></slot>
		</template>
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
console.log('BaseCommentsMessages loaded');
const publicationId = inject('publicationId');
const {getApiPerVersion} = usePkpCommentsStore();

const versionApi = getApiPerVersion(publicationId);
console.log('BaseCommentsMessages, versionApi:', versionApi);
</script>
