<template>
	<span class="BaseCommentsMessageDate">
		{{ formatShortDateTime(messageProps.message.createdAt) }}
	</span>
</template>
<script setup>
import {inject} from 'vue';
import {formatShortDateTime} from '@/utils/dateUtils';
const messageProps = inject('messageProps');
</script>
