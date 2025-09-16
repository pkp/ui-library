<template>
	<span class="BaseCommentsVersionHeaderLabel">
		{{ commentsStore.getVersionLabel(publicationId) }}
	</span>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const publicationId = inject('publicationId');
const commentsStore = usePkpCommentsStore();
</script>
