<template>
	<BaseComments v-bind="$props" />
</template>

<script setup>
import BaseComments from './base/BaseComments.vue';

defineProps({
	latestPublicationId: {type: Number, required: true},
	publications: {type: Array, default: () => []},
	itemsPerPage: {type: Number, required: true},
	loginUrl: {type: String, required: true},
	commentsCountPerPublication: {type: Object, required: true},
	allCommentsCount: {type: Number, required: true},
	styles: {type: Object, default: () => ({})},
});
</script>
