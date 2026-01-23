<template>
	<span class="pkpComments__version-header-label">
		{{ commentsStore.getVersionLabel(publication.id) }}
	</span>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';

defineProps({
	publication: {type: Object, required: true},
});

const commentsStore = usePkpCommentsStore();
</script>
