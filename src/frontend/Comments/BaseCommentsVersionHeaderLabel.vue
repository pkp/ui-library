<template>
	<span>{{ versionApi.versionLabel }}</span>
</template>
<script setup>
import {inject} from 'vue';

import {usePkpCommentsStore} from './usePkpCommentsStore';

const versionProps = inject('versionProps');

const commentsStore = usePkpCommentsStore();

const versionApi = commentsStore.getApiPerVersion(versionProps.publicationId);
</script>
