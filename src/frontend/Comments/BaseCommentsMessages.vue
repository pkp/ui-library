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
const versionProps = inject('versionProps');
const {getApiPerVersion} = usePkpCommentsStore();

const versionApi = getApiPerVersion(versionProps.publicationId);
console.log('BaseCommentsMessages, versionApi:', versionApi);
</script>
