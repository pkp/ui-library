<template>
	<PkpButton @click="versionApi.commentAdd">Submit</PkpButton>
</template>

<script setup>
import {inject} from 'vue';

import PkpButton from '../components/PkpButton/PkpButton.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';

const versionProps = inject('versionProps');

const commentsStore = usePkpCommentsStore();

const versionApi = commentsStore.getApiPerVersion(versionProps.publicationId);
</script>
