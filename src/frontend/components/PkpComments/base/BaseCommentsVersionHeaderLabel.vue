<template>
	<span :class="cn('versionHeaderLabel')">
		{{ commentsStore.getVersionLabel(publication.id) }}
	</span>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	publication: {type: Object, required: true},
});

const {cn} = usePkpStyles();

const commentsStore = usePkpCommentsStore();
</script>
